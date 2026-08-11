import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

type JsonObject = Record<string, unknown>;

function object(value: unknown): JsonObject {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonObject)
    : {};
}

function stringArray(value: unknown, fallback: string[]) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : fallback;
}

/**
 * Optional lightweight CRM cron endpoint.
 * Protect with CRM_CRON_SECRET. Disabled when the secret is empty.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.CRM_CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRM cron is disabled" }, { status: 503 });
  }
  const provided =
    request.headers.get("x-crm-cron-secret") ||
    request.nextUrl.searchParams.get("secret");
  if (provided !== secret) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const sb = createAdminClient();
  const now = new Date();
  const soon = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

  const [{ data: dueTasks, error: tasksError }, { data: existing, error: existingError }] =
    await Promise.all([
      sb
        .from("tasks")
        .select("id, title, assignee_id, case_id, due_at, status, priority")
        .in("status", ["todo", "in_progress", "blocked"])
        .lte("due_at", soon)
        .not("due_at", "is", null)
        .not("assignee_id", "is", null)
        .limit(500),
      sb
        .from("notifications")
        .select("type,payload")
        .in("type", ["task.overdue", "task.due_soon"])
        .is("read_at", null)
        .limit(2000),
    ]);

  if (tasksError || existingError) {
    return NextResponse.json(
      { error: (tasksError || existingError)?.message || "Could not scan tasks" },
      { status: 500 },
    );
  }

  const existingKeys = new Set(
    (existing || []).flatMap((notification) => {
      const taskId = object(notification.payload).taskId;
      return typeof taskId === "string" ? [`${notification.type}:${taskId}`] : [];
    }),
  );
  const notifications = (dueTasks || []).flatMap((task) => {
    if (!task.assignee_id || !task.due_at) return [];
    const overdue = new Date(task.due_at) < now;
    const type = overdue ? "task.overdue" : "task.due_soon";
    if (existingKeys.has(`${type}:${task.id}`)) return [];
    return [{
      recipient_id: task.assignee_id,
      case_id: task.case_id,
      type,
      title: overdue ? "Просроченная задача" : "Срок задачи скоро",
      body: task.title,
      link: task.case_id ? `/cases/${task.case_id}` : "/tasks",
      payload: { taskId: task.id, dueAt: task.due_at },
    }];
  });
  const { error: notificationError } = notifications.length
    ? await sb.from("notifications").insert(notifications)
    : { error: null };

  const { data: rules, error: rulesError } = await sb
    .from("automation_rules")
    .select("id,trigger_type,conditions,actions")
    .eq("enabled", true)
    .eq("trigger_type", "task_due");
  if (rulesError) {
    return NextResponse.json({ error: rulesError.message }, { status: 500 });
  }

  let automationNotifications = 0;
  for (const rule of rules || []) {
    const conditions = object(rule.conditions);
    const statuses = stringArray(conditions.statuses, ["todo", "in_progress", "blocked"]);
    const priorities = stringArray(conditions.priorities, []);
    const dueWithinHours = Math.min(
      Math.max(Number(conditions.dueWithinHours) || 24, 1),
      720,
    );
    let query = sb
      .from("tasks")
      .select("id,title,assignee_id,case_id,due_at,status,priority")
      .in("status", statuses)
      .lte("due_at", new Date(now.getTime() + dueWithinHours * 3_600_000).toISOString())
      .not("due_at", "is", null)
      .not("assignee_id", "is", null)
      .limit(500);
    if (priorities.length) query = query.in("priority", priorities);
    const { data: matchingTasks, error: matchingError } = await query;
    const runStartedAt = new Date().toISOString();
    if (matchingError) {
      await sb.from("automation_runs").insert({
        rule_id: rule.id,
        status: "failed",
        input: conditions,
        error: matchingError.message,
        started_at: runStartedAt,
        finished_at: new Date().toISOString(),
      });
      continue;
    }

    const actions = Array.isArray(rule.actions) ? rule.actions.map(object) : [];
    let createdForRule = 0;
    for (const action of actions) {
      if (action.type !== "notification") continue;
      for (const task of matchingTasks || []) {
        if (!task.assignee_id) continue;
        const { count } = await sb
          .from("notifications")
          .select("id", { count: "exact", head: true })
          .eq("recipient_id", task.assignee_id)
          .eq("type", "automation.task_due")
          .contains("payload", { ruleId: rule.id, taskId: task.id })
          .is("read_at", null);
        if (count) continue;
        const { error } = await sb.from("notifications").insert({
          recipient_id: task.assignee_id,
          case_id: task.case_id,
          type: "automation.task_due",
          title:
            typeof action.title === "string" && action.title.trim()
              ? action.title.trim().slice(0, 300)
              : "Напоминание о задаче",
          body: task.title,
          link: task.case_id ? `/cases/${task.case_id}` : "/tasks",
          payload: { ruleId: rule.id, taskId: task.id, dueAt: task.due_at },
        });
        if (!error) {
          createdForRule += 1;
          automationNotifications += 1;
        }
      }
    }
    await sb.from("automation_runs").insert({
      rule_id: rule.id,
      status: "succeeded",
      input: conditions,
      output: { matched: matchingTasks?.length || 0, notificationsCreated: createdForRule },
      started_at: runStartedAt,
      finished_at: new Date().toISOString(),
    });
  }

  return NextResponse.json({
    ok: true,
    scanned: dueTasks?.length || 0,
    notificationsCreated: notifications.length,
    automationRulesRun: rules?.length || 0,
    automationNotificationsCreated: automationNotifications,
    warning: notificationError?.message || null,
  });
}
