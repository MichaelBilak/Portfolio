import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ApiInputError, apiError, optionalString, optionalUuid, pageParams, readJsonObject } from "@/lib/studio/api";
import { requireStudioUser } from "@/lib/studio/auth";
import { PAYMENT_STATUSES } from "@/lib/studio/hq/enums";
import { recordStudioMutation } from "@/lib/studio/audit";

const DECIMAL = /^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/;

export async function GET(request: NextRequest) {
  const auth = await requireStudioUser({ capability: "reports.read" });
  if ("error" in auth) return auth.error;
  const { limit, offset } = pageParams(request);
  const sb = createAdminClient();
  let query = sb
    .from("payments")
    .select("*, invoices(id,invoice_number,status,total,amount_paid), companies(id,name)", { count: "exact" })
    .order("paid_at", { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1);
  const companyId = request.nextUrl.searchParams.get("companyId");
  const invoiceId = request.nextUrl.searchParams.get("invoiceId");
  const status = request.nextUrl.searchParams.get("status");
  if (companyId) query = query.eq("company_id", companyId);
  if (invoiceId) query = query.eq("invoice_id", invoiceId);
  if (status) query = query.eq("status", status);
  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ items: data || [], total: count || 0, limit, offset });
}

export async function POST(request: NextRequest) {
  const auth = await requireStudioUser({ capability: "finance.manage" });
  if ("error" in auth) return auth.error;
  try {
    const body = await readJsonObject(request);
    const allowed = new Set([
      "invoiceId",
      "amount",
      "currency",
      "status",
      "method",
      "externalReference",
      "paidAt",
      "metadata",
    ]);
    const unknown = Object.keys(body).filter((key) => !allowed.has(key));
    if (unknown.length) throw new ApiInputError(`Unknown fields: ${unknown.join(", ")}`);
    const invoiceId = optionalUuid(body.invoiceId, "invoiceId");
    if (!invoiceId) throw new ApiInputError("invoiceId is required");
    const amount = typeof body.amount === "number" ? String(body.amount) : body.amount;
    if (typeof amount !== "string" || !DECIMAL.test(amount) || Number(amount) <= 0) {
      throw new ApiInputError("amount must be a positive decimal with at most 2 decimal places");
    }
    const status = body.status === undefined ? "succeeded" : body.status;
    if (typeof status !== "string" || !PAYMENT_STATUSES.includes(status as (typeof PAYMENT_STATUSES)[number])) {
      throw new ApiInputError("status is invalid");
    }
    if (status !== "succeeded") {
      throw new ApiInputError("Only succeeded invoice payments can be recorded atomically");
    }
    const currency = optionalString(body.currency, "currency", 3) || "EUR";
    if (!/^[A-Z]{3}$/.test(currency)) throw new ApiInputError("currency must be a 3-letter uppercase code");
    const paidAt = optionalString(body.paidAt, "paidAt", 40) || new Date().toISOString();
    if (Number.isNaN(Date.parse(paidAt))) throw new ApiInputError("paidAt must be an ISO date-time");
    const metadata =
      body.metadata === undefined
        ? {}
        : body.metadata && typeof body.metadata === "object" && !Array.isArray(body.metadata)
          ? (body.metadata as Record<string, unknown>)
          : null;
    if (!metadata) throw new ApiInputError("metadata must be an object");

    const sb = createAdminClient();
    const { data, error } = await sb.rpc("record_invoice_payment", {
      p_invoice_id: invoiceId,
      p_amount: amount,
      p_currency: currency,
      p_method: optionalString(body.method, "method", 100) ?? null,
      p_external_reference: optionalString(body.externalReference, "externalReference", 300) ?? null,
      p_paid_at: paidAt,
      p_metadata: metadata,
      p_created_by: auth.id,
    });
    if (error) {
      const missingRpc =
        error.code === "PGRST202" ||
        /record_invoice_payment|function.*not found|schema cache/i.test(error.message);
      return NextResponse.json(
        {
          error: missingRpc
            ? "Atomic payment RPC record_invoice_payment is not installed; payment was not recorded"
            : error.message,
        },
        { status: missingRpc ? 501 : 400 },
      );
    }
    const payment =
      data && typeof data === "object" && !Array.isArray(data)
        ? (data as Record<string, unknown>)
        : null;
    await recordStudioMutation(sb, {
      actorId: auth.id,
      action: "payment.create",
      entity: "payments",
      entityId: typeof payment?.id === "string" ? payment.id : null,
      meta: { invoiceId, amount, currency },
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
