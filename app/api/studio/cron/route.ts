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
        .is("deleted_at", null)
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

  const staleNewBefore = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString();
  const [
    { data: slaLeads, error: slaLeadsError },
    { data: existingLeadNotifs, error: existingLeadError },
    { data: salesProfiles },
  ] = await Promise.all([
    sb
      .from("leads")
      .select(
        "id, full_name, email, business_name, status, assignee_id, next_action_at, first_responded_at, created_at",
      )
      .in("status", ["new", "in_progress"])
      .limit(500),
    sb
      .from("notifications")
      .select("type,payload,recipient_id")
      .in("type", ["lead.sla", "lead.stale"])
      .is("read_at", null)
      .limit(2000),
    sb.from("profiles").select("id").in("role", ["owner", "editor", "manager", "sales"]),
  ]);

  const existingLeadKeys = new Set(
    (existingLeadNotifs || []).flatMap((notification) => {
      const leadId = object(notification.payload).leadId;
      return typeof leadId === "string"
        ? [`${notification.type}:${notification.recipient_id}:${leadId}`]
        : [];
    }),
  );

  const defaultRecipients = (salesProfiles || []).map((profile) => profile.id);
  const leadSlaNotifications: Array<Record<string, unknown>> = [];
  for (const lead of slaLeads || []) {
    const overdueNext =
      Boolean(lead.next_action_at) &&
      new Date(lead.next_action_at as string).getTime() <= now.getTime();
    const staleNew =
      lead.status === "new" &&
      !lead.first_responded_at &&
      new Date(lead.created_at).getTime() <= new Date(staleNewBefore).getTime();
    if (!overdueNext && !staleNew) continue;

    const type = overdueNext ? "lead.sla" : "lead.stale";
    const title = overdueNext ? "SLA по лиду просрочен" : "Лид без ответа";
    const body =
      lead.business_name || lead.full_name || lead.email || lead.id.slice(0, 8);
    const recipients = lead.assignee_id ? [lead.assignee_id] : defaultRecipients;

    for (const recipientId of recipients) {
      const key = `${type}:${recipientId}:${lead.id}`;
      if (existingLeadKeys.has(key)) continue;
      existingLeadKeys.add(key);
      leadSlaNotifications.push({
        recipient_id: recipientId,
        case_id: null,
        type,
        title,
        body,
        link: `/leads/${lead.id}`,
        payload: {
          leadId: lead.id,
          nextActionAt: lead.next_action_at,
          createdAt: lead.created_at,
        },
      });
    }
  }

  const { error: leadSlaError } = leadSlaNotifications.length
    ? await sb.from("notifications").insert(leadSlaNotifications)
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
      .is("deleted_at", null)
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

  const [{ data: careDue, error: careDueError }, { data: existingCareNotifs }] =
    await Promise.all([
      sb
        .from("care_retainers")
        .select("id, company_name, client_name, next_review_at")
        .eq("status", "active")
        .lte("next_review_at", now.toISOString())
        .limit(200),
      sb
        .from("notifications")
        .select("type,payload,recipient_id")
        .eq("type", "care.review")
        .is("read_at", null)
        .limit(2000),
    ]);

  const careDueSafe = careDueError ? [] : careDue || [];
  const existingCareKeys = new Set(
    (existingCareNotifs || []).flatMap((notification) => {
      const careId = object(notification.payload).careId;
      return typeof careId === "string"
        ? [`${notification.recipient_id}:${careId}`]
        : [];
    }),
  );
  const careNotifications: Array<Record<string, unknown>> = [];
  for (const care of careDueSafe) {
    for (const recipientId of defaultRecipients) {
      const key = `${recipientId}:${care.id}`;
      if (existingCareKeys.has(key)) continue;
      existingCareKeys.add(key);
      careNotifications.push({
        recipient_id: recipientId,
        case_id: null,
        type: "care.review",
        title: "Care review due",
        body: care.company_name || care.client_name || care.id.slice(0, 8),
        link: "/care",
        payload: { careId: care.id, nextReviewAt: care.next_review_at },
      });
    }
  }
  const { error: careNotifyError } = careNotifications.length
    ? await sb.from("notifications").insert(careNotifications)
    : { error: null };

  return NextResponse.json({
    ok: true,
    scanned: dueTasks?.length || 0,
    notificationsCreated: notifications.length,
    leadSlaScanned: slaLeads?.length || 0,
    leadSlaNotificationsCreated: leadSlaNotifications.length,
    careReviewsScanned: careDueSafe.length,
    careNotificationsCreated: careNotifications.length,
    automationRulesRun: rules?.length || 0,
    automationNotificationsCreated: automationNotifications,
    warning:
      notificationError?.message ||
      leadSlaError?.message ||
      slaLeadsError?.message ||
      existingLeadError?.message ||
      careDueError?.message ||
      careNotifyError?.message ||
      null,
  });
}
