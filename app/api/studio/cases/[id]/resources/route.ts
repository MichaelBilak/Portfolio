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
import { requireCaseAccess } from "@/lib/studio/access";

const resourceTables = {
  decision: "case_decisions",
  question: "case_questions",
  requirement: "case_requirements",
  member: "case_members",
} as const;

type Resource = keyof typeof resourceTables;

function resourceName(value: unknown): Resource {
  if (typeof value !== "string" || !(value in resourceTables)) {
    throw new ApiInputError("resource must be decision, question, requirement, or member");
  }
  return value as Resource;
}

export async function POST(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireStudioUser({ capability: "cases.update" });
  if ("error" in auth) return auth.error;
  try {
    const { id: caseId } = await ctx.params;
    const sb = createAdminClient();
    const denied = await requireCaseAccess(sb, auth, caseId);
    if (denied) return denied;
    const body = await readJsonObject(request);
    const resource = resourceName(body.resource);
    let insert: Record<string, unknown>;
    if (resource === "member") {
      const profileId = optionalUuid(body.profileId, "profileId");
      if (!profileId) throw new ApiInputError("profileId is required");
      insert = {
        case_id: caseId,
        profile_id: profileId,
        member_role: optionalString(body.memberRole, "memberRole", 100) || "member",
        added_by: auth.id,
      };
    } else if (resource === "decision") {
      insert = {
        case_id: caseId,
        title: requiredString(body.title, "title", 300),
        body: optionalString(body.body, "body", 20000),
        created_by: auth.id,
      };
    } else if (resource === "question") {
      insert = {
        case_id: caseId,
        question: requiredString(body.question, "question", 5000),
        asked_by: auth.id,
        due_at: optionalString(body.dueAt, "dueAt", 40),
      };
    } else {
      insert = {
        case_id: caseId,
        title: requiredString(body.title, "title", 300),
        details: optionalString(body.details, "details", 20000),
        priority: optionalString(body.priority, "priority", 30) || "normal",
        created_by: auth.id,
      };
    }
    const { data, error } = await sb
      .from(resourceTables[resource])
      .upsert(insert)
      .select("*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const entityId = resource === "member" ? String(data.profile_id) : String(data.id);
    await recordStudioMutation(sb, {
      actorId: auth.id,
      action: `case.${resource}_create`,
      entity: resourceTables[resource],
      entityId,
      caseEvent: {
        caseId,
        eventType: `case.${resource}_created`,
        entityType: resourceTables[resource],
        entityId,
      },
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireStudioUser({ capability: "cases.update" });
  if ("error" in auth) return auth.error;
  try {
    const { id: caseId } = await ctx.params;
    const sb = createAdminClient();
    const denied = await requireCaseAccess(sb, auth, caseId);
    if (denied) return denied;
    const body = await readJsonObject(request);
    const resource = resourceName(body.resource);
    if (resource === "member") throw new ApiInputError("Member updates are not supported");
    const id = requiredString(body.id, "id", 36);
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (resource === "decision") {
      if ("status" in body) {
        patch.status = oneOf(body.status, "status", ["proposed", "approved", "rejected", "superseded"] as const);
        if (body.status === "approved" || body.status === "rejected") {
          patch.decided_by = auth.id;
          patch.decided_at = new Date().toISOString();
        }
      }
      if ("body" in body) patch.body = optionalString(body.body, "body", 20000);
    } else if (resource === "question") {
      if ("answer" in body) {
        patch.answer = optionalString(body.answer, "answer", 20000);
        patch.answered_by = auth.id;
        patch.status = body.answer ? "answered" : "open";
      }
      if ("status" in body) patch.status = oneOf(body.status, "status", ["open", "answered", "closed"] as const);
    } else {
      if ("status" in body) patch.status = oneOf(body.status, "status", ["draft", "confirmed", "met", "waived"] as const);
      if ("details" in body) patch.details = optionalString(body.details, "details", 20000);
    }
    if (Object.keys(patch).length === 1) throw new ApiInputError("No supported fields supplied");
    const { data, error } = await sb
      .from(resourceTables[resource])
      .update(patch)
      .eq("id", id)
      .eq("case_id", caseId)
      .select("*")
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (!data) return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    await recordStudioMutation(sb, {
      actorId: auth.id,
      action: `case.${resource}_update`,
      entity: resourceTables[resource],
      entityId: id,
      caseEvent: {
        caseId,
        eventType: `case.${resource}_updated`,
        entityType: resourceTables[resource],
        entityId: id,
      },
    });
    return NextResponse.json(data);
  } catch (error) {
    return apiError(error);
  }
}
