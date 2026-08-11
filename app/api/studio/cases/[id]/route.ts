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
} from "@/lib/studio/api";
import { recordStudioMutation } from "@/lib/studio/audit";
import { requireCaseAccess } from "@/lib/studio/access";

const priorities = ["low", "normal", "high", "urgent"] as const;

export async function GET(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireStudioUser({ capability: "cases.read" });
  if ("error" in auth) return auth.error;

  const { id } = await ctx.params;
  const sb = createAdminClient();
  const denied = await requireCaseAccess(sb, auth, id);
  if (denied) return denied;
  const { data, error } = await sb
    .from("cases")
    .select(
      "*, pipeline_stages(*), case_members(*, profiles!case_members_profile_id_fkey(id,name,role)), tasks(*), case_decisions(*), case_questions(*), case_requirements(*), finance_milestones(*)",
    )
    .eq("id", id)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (!data) return NextResponse.json({ error: "Case not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireStudioUser({ capability: "cases.update" });
  if ("error" in auth) return auth.error;

  try {
    const { id } = await ctx.params;
    const sb = createAdminClient();
    const denied = await requireCaseAccess(sb, auth, id);
    if (denied) return denied;
    const body = await readJsonObject(request);
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if ("title" in body) patch.title = optionalString(body.title, "title", 300);
    if ("description" in body) patch.description = optionalString(body.description, "description", 20000);
    if ("stageId" in body) patch.stage_id = optionalUuid(body.stageId, "stageId");
    if ("ownerId" in body) patch.owner_id = optionalUuid(body.ownerId, "ownerId");
    if ("clientName" in body) patch.client_name = optionalString(body.clientName, "clientName", 300);
    if ("clientEmail" in body) patch.client_email = optionalString(body.clientEmail, "clientEmail", 320);
    if ("companyName" in body) patch.company_name = optionalString(body.companyName, "companyName", 300);
    if ("priority" in body) patch.priority = oneOf(body.priority, "priority", priorities);
    if ("dueDate" in body) patch.due_date = optionalString(body.dueDate, "dueDate", 10);
    if ("estimatedValue" in body) {
      if (body.estimatedValue !== null && (typeof body.estimatedValue !== "number" || !Number.isFinite(body.estimatedValue))) {
        throw new ApiInputError("estimatedValue must be a finite number");
      }
      patch.estimated_value = body.estimatedValue;
    }
    if ("tags" in body) {
      if (!Array.isArray(body.tags)) throw new ApiInputError("tags must be an array");
      patch.tags = body.tags.filter((tag): tag is string => typeof tag === "string").slice(0, 30);
    }
    if (Object.keys(patch).length === 1) {
      return NextResponse.json({ error: "No supported fields supplied" }, { status: 400 });
    }

    const { data, error } = await sb.from("cases").update(patch).eq("id", id).select("*").maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (!data) return NextResponse.json({ error: "Case not found" }, { status: 404 });
    if (patch.owner_id && typeof patch.owner_id === "string") {
      const { error: membershipError } = await sb.from("case_members").upsert({
        case_id: id,
        profile_id: patch.owner_id,
        member_role: "owner",
        added_by: auth.id,
      });
      if (membershipError) {
        return NextResponse.json({ error: membershipError.message }, { status: 400 });
      }
    }
    await recordStudioMutation(sb, {
      actorId: auth.id,
      action: "case.update",
      entity: "cases",
      entityId: id,
      meta: { fields: Object.keys(patch).filter((field) => field !== "updated_at") },
      caseEvent: {
        caseId: id,
        eventType: patch.stage_id ? "case.stage_changed" : "case.updated",
        payload: { fields: Object.keys(patch).filter((field) => field !== "updated_at") },
      },
    });
    return NextResponse.json(data);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireStudioUser({ capability: "cases.archive" });
  if ("error" in auth) return auth.error;
  const { id } = await ctx.params;
  const sb = createAdminClient();
  const denied = await requireCaseAccess(sb, auth, id);
  if (denied) return denied;
  const { data, error } = await sb
    .from("cases")
    .update({ archived_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", id)
    .is("archived_at", null)
    .select("id")
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (!data) return NextResponse.json({ error: "Case not found" }, { status: 404 });
  await recordStudioMutation(sb, {
    actorId: auth.id,
    action: "case.archive",
    entity: "cases",
    entityId: id,
    caseEvent: { caseId: id, eventType: "case.archived" },
  });
  return NextResponse.json({ ok: true });
}
