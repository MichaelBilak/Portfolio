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
import { hasGlobalCaseAccess, requireCaseAccess } from "@/lib/studio/access";
import type { StudioProfile } from "@/lib/studio/auth";

const statuses = ["todo", "in_progress", "blocked", "done", "cancelled"] as const;
const priorities = ["low", "normal", "high", "urgent"] as const;

type TaskAccessRow = {
  id: string;
  case_id: string | null;
  created_by: string | null;
  assignee_id: string | null;
  deleted_at: string | null;
  status: string;
  title: string;
};

async function loadTaskForAccess(
  sb: ReturnType<typeof createAdminClient>,
  auth: StudioProfile,
  id: string,
  opts?: { includeDeleted?: boolean },
): Promise<{ task: TaskAccessRow } | { error: NextResponse }> {
  let query = sb
    .from("tasks")
    .select("id,case_id,created_by,assignee_id,deleted_at,status,title")
    .eq("id", id);
  if (!opts?.includeDeleted) query = query.is("deleted_at", null);
  const { data: task, error: taskError } = await query.maybeSingle();
  if (taskError) return { error: NextResponse.json({ error: taskError.message }, { status: 400 }) };
  if (!task) return { error: NextResponse.json({ error: "Task not found" }, { status: 404 }) };
  if (task.case_id) {
    const denied = await requireCaseAccess(sb, auth, task.case_id, "Task");
    if (denied) return { error: denied };
  } else if (
    !hasGlobalCaseAccess(auth) &&
    task.created_by !== auth.id &&
    task.assignee_id !== auth.id
  ) {
    return { error: NextResponse.json({ error: "Task not found" }, { status: 404 }) };
  }
  return { task: task as TaskAccessRow };
}

export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireStudioUser({ capability: "tasks.manage" });
  if ("error" in auth) return auth.error;
  try {
    const { id } = await ctx.params;
    const sb = createAdminClient();
    const body = await readJsonObject(request);
    const action = typeof body.action === "string" ? body.action : "update";

    if (action === "restore") {
      const access = await loadTaskForAccess(sb, auth, id, { includeDeleted: true });
      if ("error" in access) return access.error;
      const task = access.task;
      if (!task.deleted_at) {
        return NextResponse.json({ error: "Task is not deleted" }, { status: 400 });
      }
      const { data, error } = await sb
        .from("tasks")
        .update({
          deleted_at: null,
          deleted_by: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select("*")
        .maybeSingle();
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      if (!data) return NextResponse.json({ error: "Task not found" }, { status: 404 });
      await recordStudioMutation(sb, {
        actorId: auth.id,
        action: "task.restore",
        entity: "tasks",
        entityId: id,
        ...(data.case_id
          ? {
              caseEvent: {
                caseId: data.case_id,
                eventType: "task.restored",
                entityType: "tasks",
                entityId: id,
              },
            }
          : {}),
      });
      return NextResponse.json(data);
    }

    const access = await loadTaskForAccess(sb, auth, id);
    if ("error" in access) return access.error;

    if (action === "comment") {
      const { data, error } = await sb
        .from("task_comments")
        .insert({ task_id: id, author_id: auth.id, body: requiredString(body.body, "body", 10000) })
        .select("*")
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data, { status: 201 });
    }
    if (action === "checklist") {
      const { data, error } = await sb
        .from("task_checklist_items")
        .insert({
          task_id: id,
          body: requiredString(body.body, "body", 1000),
          sort_order: typeof body.sortOrder === "number" ? body.sortOrder : 0,
        })
        .select("*")
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data, { status: 201 });
    }
    if (action === "checklist-update") {
      const itemId = optionalUuid(body.itemId, "itemId");
      if (!itemId) throw new ApiInputError("itemId is required");
      if (typeof body.isDone !== "boolean") throw new ApiInputError("isDone must be boolean");
      const { data, error } = await sb
        .from("task_checklist_items")
        .update({
          is_done: body.isDone,
          completed_by: body.isDone ? auth.id : null,
          completed_at: body.isDone ? new Date().toISOString() : null,
        })
        .eq("id", itemId)
        .eq("task_id", id)
        .select("*")
        .maybeSingle();
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      if (!data) return NextResponse.json({ error: "Checklist item not found" }, { status: 404 });
      return NextResponse.json(data);
    }
    if (action === "watch" || action === "unwatch") {
      const profileId = optionalUuid(body.profileId, "profileId") ?? auth.id;
      const result =
        action === "watch"
          ? await sb.from("task_watchers").upsert({ task_id: id, profile_id: profileId })
          : await sb.from("task_watchers").delete().eq("task_id", id).eq("profile_id", profileId);
      if (result.error) return NextResponse.json({ error: result.error.message }, { status: 400 });
      return NextResponse.json({ ok: true });
    }
    if (action !== "update") throw new ApiInputError("Unsupported action");

    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if ("title" in body) patch.title = requiredString(body.title, "title", 300);
    if ("description" in body) patch.description = optionalString(body.description, "description", 10000);
    if ("status" in body) {
      patch.status = oneOf(body.status, "status", statuses);
      patch.completed_at = body.status === "done" ? new Date().toISOString() : null;
    }
    if ("priority" in body) patch.priority = oneOf(body.priority, "priority", priorities);
    if ("assigneeId" in body) patch.assignee_id = optionalUuid(body.assigneeId, "assigneeId");
    if ("dueAt" in body) patch.due_at = optionalString(body.dueAt, "dueAt", 40);
    if ("caseId" in body) {
      const nextCaseId = optionalUuid(body.caseId, "caseId") ?? null;
      if (nextCaseId) {
        const denied = await requireCaseAccess(sb, auth, nextCaseId, "Task");
        if (denied) return denied;
      }
      patch.case_id = nextCaseId;
    }
    if (Object.keys(patch).length === 1) throw new ApiInputError("No supported fields supplied");
    const { data, error } = await sb
      .from("tasks")
      .update(patch)
      .eq("id", id)
      .is("deleted_at", null)
      .select("*")
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (!data) return NextResponse.json({ error: "Task not found" }, { status: 404 });
    await recordStudioMutation(sb, {
      actorId: auth.id,
      action: "task.update",
      entity: "tasks",
      entityId: id,
      ...(data.case_id
        ? {
            caseEvent: {
              caseId: data.case_id,
              eventType: data.status === "done" ? "task.completed" : "task.updated",
              entityType: "tasks",
              entityId: id,
            },
          }
        : {}),
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
  const auth = await requireStudioUser({ capability: "tasks.manage" });
  if ("error" in auth) return auth.error;
  try {
    const { id } = await ctx.params;
    const sb = createAdminClient();
    const access = await loadTaskForAccess(sb, auth, id);
    if ("error" in access) return access.error;
    const task = access.task;
    const now = new Date().toISOString();
    const { data, error } = await sb
      .from("tasks")
      .update({
        deleted_at: now,
        deleted_by: auth.id,
        updated_at: now,
      })
      .eq("id", id)
      .is("deleted_at", null)
      .select("*")
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (!data) return NextResponse.json({ error: "Task not found" }, { status: 404 });
    await recordStudioMutation(sb, {
      actorId: auth.id,
      action: "task.delete",
      entity: "tasks",
      entityId: id,
      ...(task.case_id
        ? {
            caseEvent: {
              caseId: task.case_id,
              eventType: "task.deleted",
              entityType: "tasks",
              entityId: id,
              payload: { title: task.title },
            },
          }
        : {}),
    });
    return NextResponse.json(data);
  } catch (error) {
    return apiError(error);
  }
}
