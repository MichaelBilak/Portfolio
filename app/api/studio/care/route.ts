import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStudioUser } from "@/lib/studio/auth";
import {
  apiError,
  oneOf,
  optionalString,
  optionalUuid,
  pageParams,
  readJsonObject,
  requiredString,
} from "@/lib/studio/api";
import { recordStudioMutation } from "@/lib/studio/audit";
import { CARE_STATUSES } from "@/lib/studio/care";

export async function GET(request: NextRequest) {
  const auth = await requireStudioUser({ capability: "cases.read" });
  if ("error" in auth) return auth.error;

  const { limit, offset } = pageParams(request);
  const status = request.nextUrl.searchParams.get("status") || undefined;
  const sb = createAdminClient();
  let query = sb
    .from("care_retainers")
    .select("*", { count: "exact" })
    .order("updated_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (status) query = query.eq("status", status);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ items: data || [], total: count || 0, limit, offset });
}

export async function POST(request: NextRequest) {
  const auth = await requireStudioUser({ capability: "cases.update" });
  if ("error" in auth) return auth.error;

  try {
    const body = await readJsonObject(request);
    const sb = createAdminClient();
    const caseId = optionalUuid(body.caseId, "caseId");
    const status = oneOf(body.status, "status", CARE_STATUSES, "active")!;
    const monthlyAmount =
      typeof body.monthlyAmount === "number" && Number.isFinite(body.monthlyAmount)
        ? body.monthlyAmount
        : Number(body.monthlyAmount || 0);
    if (!Number.isFinite(monthlyAmount) || monthlyAmount < 0) {
      return NextResponse.json({ error: "monthlyAmount is invalid" }, { status: 400 });
    }

    let clientName = optionalString(body.clientName, "clientName", 300) ?? null;
    let clientEmail = optionalString(body.clientEmail, "clientEmail", 320) ?? null;
    let companyName = optionalString(body.companyName, "companyName", 300) ?? null;

    if (caseId) {
      const { data: existingCare } = await sb
        .from("care_retainers")
        .select("id")
        .eq("case_id", caseId)
        .maybeSingle();
      if (existingCare) {
        return NextResponse.json(
          { error: "Care retainer already exists for this case", id: existingCare.id },
          { status: 409 },
        );
      }
      const { data: caseRow } = await sb
        .from("cases")
        .select("client_name, client_email, company_name, currency")
        .eq("id", caseId)
        .maybeSingle();
      if (caseRow) {
        clientName = clientName || caseRow.client_name;
        clientEmail = clientEmail || caseRow.client_email;
        companyName = companyName || caseRow.company_name;
      }
    }

    const row = {
      case_id: caseId ?? null,
      client_name: clientName,
      client_email: clientEmail,
      company_name: companyName || requiredString(body.companyName || body.clientName || "Care client", "companyName", 300),
      monthly_amount: monthlyAmount,
      currency: optionalString(body.currency, "currency", 8) || "EUR",
      status,
      next_review_at:
        typeof body.nextReviewAt === "string" && body.nextReviewAt
          ? body.nextReviewAt
          : new Date(Date.now() + 30 * 86_400_000).toISOString(),
      notes: optionalString(body.notes, "notes", 5000) ?? null,
      created_by: auth.id,
    };

    const { data, error } = await sb.from("care_retainers").insert(row).select("*").single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    await recordStudioMutation(sb, {
      actorId: auth.id,
      action: "care.create",
      entity: "care_retainers",
      entityId: data.id,
      meta: { caseId },
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireStudioUser({ capability: "cases.update" });
  if ("error" in auth) return auth.error;

  try {
    const body = await readJsonObject(request);
    const id = optionalUuid(body.id, "id");
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if ("status" in body) patch.status = oneOf(body.status, "status", CARE_STATUSES);
    if ("monthlyAmount" in body) {
      const value = Number(body.monthlyAmount);
      if (!Number.isFinite(value) || value < 0) {
        return NextResponse.json({ error: "monthlyAmount is invalid" }, { status: 400 });
      }
      patch.monthly_amount = value;
    }
    if ("currency" in body) patch.currency = optionalString(body.currency, "currency", 8);
    if ("nextReviewAt" in body) {
      patch.next_review_at = optionalString(body.nextReviewAt, "nextReviewAt", 40);
    }
    if ("notes" in body) patch.notes = optionalString(body.notes, "notes", 5000);
    if ("clientName" in body) patch.client_name = optionalString(body.clientName, "clientName", 300);
    if ("clientEmail" in body) {
      patch.client_email = optionalString(body.clientEmail, "clientEmail", 320);
    }
    if ("companyName" in body) {
      patch.company_name = optionalString(body.companyName, "companyName", 300);
    }

    const sb = createAdminClient();
    const { data, error } = await sb
      .from("care_retainers")
      .update(patch)
      .eq("id", id)
      .select("*")
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await recordStudioMutation(sb, {
      actorId: auth.id,
      action: "care.update",
      entity: "care_retainers",
      entityId: id,
    });

    return NextResponse.json(data);
  } catch (error) {
    return apiError(error);
  }
}
