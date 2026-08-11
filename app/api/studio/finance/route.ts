import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStudioUser } from "@/lib/studio/auth";
import {
  ApiInputError,
  apiError,
  oneOf,
  optionalString,
  optionalUuid,
  readJsonObject,
  requiredString,
} from "@/lib/studio/api";
import { recordStudioMutation } from "@/lib/studio/audit";
import { getAccessibleCaseIds, requireCaseAccess } from "@/lib/studio/access";

const statuses = ["planned", "invoiced", "paid", "overdue", "cancelled"] as const;

export async function GET(request: NextRequest) {
  const auth = await requireStudioUser({ capability: "reports.read" });
  if ("error" in auth) return auth.error;
  const caseId = request.nextUrl.searchParams.get("caseId");
  const sb = createAdminClient();
  if (caseId) {
    const denied = await requireCaseAccess(sb, auth, caseId);
    if (denied) return denied;
  }
  const accessibleCaseIds = await getAccessibleCaseIds(sb, auth);
  if (!caseId && accessibleCaseIds?.length === 0) return NextResponse.json([]);
  let query = sb
    .from("finance_milestones")
    .select("*, cases(id,case_number,title)")
    .order("due_date", { ascending: true, nullsFirst: false });
  if (caseId) query = query.eq("case_id", caseId);
  else if (accessibleCaseIds) query = query.in("case_id", accessibleCaseIds);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const auth = await requireStudioUser({ capability: "finance.manage" });
  if ("error" in auth) return auth.error;
  try {
    const body = await readJsonObject(request);
    const caseId = optionalUuid(body.caseId, "caseId");
    if (!caseId) throw new ApiInputError("caseId is required");
    if (typeof body.amount !== "number" || !Number.isFinite(body.amount) || body.amount < 0) {
      throw new ApiInputError("amount must be a non-negative number");
    }
    const sb = createAdminClient();
    const denied = await requireCaseAccess(sb, auth, caseId);
    if (denied) return denied;
    const { data, error } = await sb
      .from("finance_milestones")
      .insert({
        case_id: caseId,
        title: requiredString(body.title, "title", 300),
        amount: body.amount,
        currency: optionalString(body.currency, "currency", 3) || "EUR",
        status: oneOf(body.status, "status", statuses, "planned"),
        due_date: optionalString(body.dueDate, "dueDate", 10),
        invoice_reference: optionalString(body.invoiceReference, "invoiceReference", 100),
        created_by: auth.id,
      })
      .select("*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    await recordStudioMutation(sb, {
      actorId: auth.id,
      action: "finance.milestone_create",
      entity: "finance_milestones",
      entityId: data.id,
      caseEvent: {
        caseId,
        eventType: "finance.milestone_created",
        entityType: "finance_milestones",
        entityId: data.id,
        payload: { amount: data.amount, currency: data.currency },
      },
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireStudioUser({ capability: "finance.manage" });
  if ("error" in auth) return auth.error;
  try {
    const body = await readJsonObject(request);
    const id = requiredString(body.id, "id", 36);
    const sb = createAdminClient();
    const { data: milestone, error: milestoneError } = await sb
      .from("finance_milestones")
      .select("case_id")
      .eq("id", id)
      .maybeSingle();
    if (milestoneError) {
      return NextResponse.json({ error: milestoneError.message }, { status: 400 });
    }
    if (!milestone) return NextResponse.json({ error: "Milestone not found" }, { status: 404 });
    const denied = await requireCaseAccess(sb, auth, milestone.case_id, "Milestone");
    if (denied) return denied;
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if ("status" in body) {
      patch.status = oneOf(body.status, "status", statuses);
      patch.paid_at = body.status === "paid" ? new Date().toISOString() : null;
    }
    if ("dueDate" in body) patch.due_date = optionalString(body.dueDate, "dueDate", 10);
    if ("invoiceReference" in body) {
      patch.invoice_reference = optionalString(body.invoiceReference, "invoiceReference", 100);
    }
    if (Object.keys(patch).length === 1) throw new ApiInputError("No supported fields supplied");
    const { data, error } = await sb
      .from("finance_milestones")
      .update(patch)
      .eq("id", id)
      .select("*")
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (!data) return NextResponse.json({ error: "Milestone not found" }, { status: 404 });
    await recordStudioMutation(sb, {
      actorId: auth.id,
      action: "finance.milestone_update",
      entity: "finance_milestones",
      entityId: id,
      caseEvent: {
        caseId: data.case_id,
        eventType: data.status === "paid" ? "finance.milestone_paid" : "finance.milestone_updated",
        entityType: "finance_milestones",
        entityId: id,
      },
    });
    return NextResponse.json(data);
  } catch (error) {
    return apiError(error);
  }
}
