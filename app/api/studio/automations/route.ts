import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStudioUser } from "@/lib/studio/auth";
import {
  ApiInputError,
  apiError,
  oneOf,
  optionalString,
  readJsonObject,
  requiredString,
} from "@/lib/studio/api";
import { writeAuditLog } from "@/lib/studio/audit";

const triggerTypes = ["task_due"] as const;

function jsonObject(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function automationConditions(value: unknown) {
  const source = jsonObject(value);
  const dueWithinHours = Number(source.dueWithinHours ?? 24);
  if (!Number.isFinite(dueWithinHours) || dueWithinHours < 1 || dueWithinHours > 720) {
    throw new ApiInputError("conditions.dueWithinHours must be between 1 and 720");
  }
  const statuses = Array.isArray(source.statuses)
    ? source.statuses.filter((item): item is string =>
        ["todo", "in_progress", "blocked"].includes(String(item)),
      )
    : ["todo", "in_progress", "blocked"];
  const priorities = Array.isArray(source.priorities)
    ? source.priorities.filter((item): item is string =>
        ["low", "normal", "high", "urgent"].includes(String(item)),
      )
    : [];
  return { dueWithinHours, statuses, priorities };
}

function automationActions(value: unknown) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new ApiInputError("actions must be a non-empty array");
  }
  return value.slice(0, 20).map((rawAction, index) => {
    const action = jsonObject(rawAction);
    if (action.type !== "notification") {
      throw new ApiInputError(`actions[${index}].type must be notification`);
    }
    return {
      type: "notification",
      recipient: "assignee",
      title: optionalString(action.title, `actions[${index}].title`, 300) || null,
    };
  });
}

export async function GET() {
  const auth = await requireStudioUser({ capability: "automations.manage" });
  if ("error" in auth) return auth.error;
  const { data, error } = await createAdminClient()
    .from("automation_rules")
    .select("*, automation_runs(id,status,error,created_at,finished_at)")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const auth = await requireStudioUser({ capability: "automations.manage" });
  if ("error" in auth) return auth.error;
  try {
    const body = await readJsonObject(request);
    const sb = createAdminClient();
    const { data, error } = await sb
      .from("automation_rules")
      .insert({
        name: requiredString(body.name, "name", 200),
        trigger_type: oneOf(body.triggerType, "triggerType", triggerTypes, "task_due"),
        conditions: automationConditions(body.conditions),
        actions: automationActions(body.actions),
        enabled: typeof body.enabled === "boolean" ? body.enabled : true,
        created_by: auth.id,
      })
      .select("*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    await writeAuditLog(sb, {
      actorId: auth.id,
      action: "automation.create",
      entity: "automation_rules",
      entityId: data.id,
      meta: { triggerType: data.trigger_type },
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireStudioUser({ capability: "automations.manage" });
  if ("error" in auth) return auth.error;
  try {
    const body = await readJsonObject(request);
    const id = requiredString(body.id, "id", 36);
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if ("name" in body) patch.name = requiredString(body.name, "name", 200);
    if ("enabled" in body) {
      if (typeof body.enabled !== "boolean") throw new ApiInputError("enabled must be boolean");
      patch.enabled = body.enabled;
    }
    if ("conditions" in body) patch.conditions = automationConditions(body.conditions);
    if ("actions" in body) patch.actions = automationActions(body.actions);
    if ("triggerType" in body) {
      patch.trigger_type = oneOf(body.triggerType, "triggerType", triggerTypes);
    }
    if (Object.keys(patch).length === 1) throw new ApiInputError("No supported fields supplied");
    const sb = createAdminClient();
    const { data, error } = await sb
      .from("automation_rules")
      .update(patch)
      .eq("id", id)
      .select("*")
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (!data) return NextResponse.json({ error: "Rule not found" }, { status: 404 });
    await writeAuditLog(sb, {
      actorId: auth.id,
      action: "automation.update",
      entity: "automation_rules",
      entityId: id,
    });
    return NextResponse.json(data);
  } catch (error) {
    return apiError(error);
  }
}
