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
import {
  getAccessibleCaseIds,
  hasGlobalCaseAccess,
  requireCaseAccess,
} from "@/lib/studio/access";

const priorities = ["low", "normal", "high", "urgent"] as const;

export async function GET(request: NextRequest) {
  const auth = await requireStudioUser({ capability: "cases.read" });
  if ("error" in auth) return auth.error;
  const { limit, offset } = pageParams(request);
  const sb = createAdminClient();
  const accessibleCaseIds = await getAccessibleCaseIds(sb, auth);
  const caseId = request.nextUrl.searchParams.get("caseId");
  if (caseId) {
    const denied = await requireCaseAccess(sb, auth, caseId);
    if (denied) return denied;
  }
  let query = sb
    .from("tasks")
    .select("*, task_checklist_items(*), task_watchers(profile_id), profiles!tasks_assignee_id_fkey(id,name)")
    .order("due_at", { ascending: true, nullsFirst: false })
    .range(offset, offset + limit - 1);
  if (!hasGlobalCaseAccess(auth)) {
    const caseFilter = accessibleCaseIds?.length
      ? `case_id.in.(${accessibleCaseIds.join(",")}),and(case_id.is.null,or(created_by.eq.${auth.id},assignee_id.eq.${auth.id}))`
      : `and(case_id.is.null,or(created_by.eq.${auth.id},assignee_id.eq.${auth.id}))`;
    query = query.or(caseFilter);
  }
  const assigneeId = request.nextUrl.searchParams.get("assigneeId");
  const status = request.nextUrl.searchParams.get("status");
  if (caseId) query = query.eq("case_id", caseId);
  if (assigneeId) query = query.eq("assignee_id", assigneeId);
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const auth = await requireStudioUser({ capability: "tasks.manage" });
  if ("error" in auth) return auth.error;
  try {
    const body = await readJsonObject(request);
    const caseId = optionalUuid(body.caseId, "caseId");
    const sb = createAdminClient();
    if (caseId) {
      const denied = await requireCaseAccess(sb, auth, caseId);
      if (denied) return denied;
    }
    const { data, error } = await sb
      .from("tasks")
      .insert({
        case_id: caseId ?? null,
        parent_task_id: optionalUuid(body.parentTaskId, "parentTaskId") ?? null,
        template_id: optionalUuid(body.templateId, "templateId") ?? null,
        title: requiredString(body.title, "title", 300),
        description: optionalString(body.description, "description", 10000),
        priority: oneOf(body.priority, "priority", priorities, "normal"),
        assignee_id: optionalUuid(body.assigneeId, "assigneeId") ?? null,
        due_at: optionalString(body.dueAt, "dueAt", 40),
        created_by: auth.id,
      })
      .select("*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    await recordStudioMutation(sb, {
      actorId: auth.id,
      action: "task.create",
      entity: "tasks",
      entityId: data.id,
      ...(caseId
        ? {
            caseEvent: {
              caseId,
              eventType: "task.created",
              entityType: "tasks",
              entityId: data.id,
              payload: { title: data.title },
            },
          }
        : {}),
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
