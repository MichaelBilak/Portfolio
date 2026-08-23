import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStudioUser } from "@/lib/studio/auth";
import {
  ApiInputError,
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
  taskAccessOrFilter,
} from "@/lib/studio/access";

const priorities = ["low", "normal", "high", "urgent"] as const;
const views = ["active", "done", "deleted", "all"] as const;

function optionalMinutes(value: unknown, name: string, minimum = 0): number | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  const result = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(result) || result < minimum || result > 10_000_000) {
    throw new ApiInputError(`${name} must be a non-negative integer`);
  }
  return result;
}

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
  const viewParam = request.nextUrl.searchParams.get("view");
  const view = views.includes(viewParam as (typeof views)[number])
    ? (viewParam as (typeof views)[number])
    : caseId
      ? "all"
      : "active";

  let query = sb
    .from("tasks")
    .select("*, task_checklist_items(*), task_watchers(profile_id), profiles!tasks_assignee_id_fkey(id,name)")
    .range(offset, offset + limit - 1);

  if (view === "deleted") {
    query = query.not("deleted_at", "is", null).order("deleted_at", { ascending: false });
  } else if (view === "done") {
    query = query
      .is("deleted_at", null)
      .eq("status", "done")
      .order("completed_at", { ascending: false, nullsFirst: false });
  } else if (view === "all") {
    query = query.is("deleted_at", null).order("due_at", { ascending: true, nullsFirst: false });
  } else {
    query = query
      .is("deleted_at", null)
      .neq("status", "done")
      .order("due_at", { ascending: true, nullsFirst: false });
  }

  if (!hasGlobalCaseAccess(auth)) {
    query = query.or(taskAccessOrFilter(auth.id, accessibleCaseIds));
  }
  const assigneeId = request.nextUrl.searchParams.get("assigneeId");
  const status = request.nextUrl.searchParams.get("status");
  const companyId = request.nextUrl.searchParams.get("companyId");
  const dealId = request.nextUrl.searchParams.get("dealId");
  const projectId = request.nextUrl.searchParams.get("projectId");
  if (caseId) query = query.eq("case_id", caseId);
  if (assigneeId) query = query.eq("assignee_id", assigneeId);
  if (companyId) query = query.eq("company_id", companyId);
  if (dealId) query = query.eq("deal_id", dealId);
  if (projectId) query = query.eq("client_project_id", projectId);
  if (status && view === "active") query = query.eq("status", status);
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
        company_id: optionalUuid(body.companyId, "companyId") ?? null,
        deal_id: optionalUuid(body.dealId, "dealId") ?? null,
        client_project_id: optionalUuid(body.projectId, "projectId") ?? null,
        parent_task_id: optionalUuid(body.parentTaskId, "parentTaskId") ?? null,
        template_id: optionalUuid(body.templateId, "templateId") ?? null,
        title: requiredString(body.title, "title", 300),
        description: optionalString(body.description, "description", 10000),
        priority: oneOf(body.priority, "priority", priorities, "normal"),
        assignee_id: optionalUuid(body.assigneeId, "assigneeId") ?? null,
        due_at: optionalString(body.dueAt, "dueAt", 40),
        estimated_minutes: optionalMinutes(body.estimatedMinutes, "estimatedMinutes", 1) ?? null,
        actual_minutes: optionalMinutes(body.actualMinutes, "actualMinutes") ?? null,
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
