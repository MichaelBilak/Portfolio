import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStudioUser } from "@/lib/studio/auth";
import {
  getAccessibleCaseIds,
  hasGlobalCaseAccess,
  taskAccessOrFilter,
} from "@/lib/studio/access";
import { medianMs, parsePeriodBounds } from "@/lib/studio/leads";

export async function GET(request: NextRequest) {
  const auth = await requireStudioUser({ capability: "reports.read" });
  if ("error" in auth) return auth.error;
  const { from, to, periodDays } = parsePeriodBounds(request);
  const sb = createAdminClient();
  const accessibleCaseIds = await getAccessibleCaseIds(sb, auth);
  const noCaseId = "00000000-0000-0000-0000-000000000000";
  let casesQuery = sb
    .from("cases")
    .select("id,stage_id,estimated_value,currency,lead_id,created_at")
    .is("archived_at", null);
  let tasksQuery = sb
    .from("tasks")
    .select("id,status,due_at")
    .is("deleted_at", null)
    .gte("created_at", from)
    .lte("created_at", to);
  let financeQuery = sb
    .from("finance_milestones")
    .select("status,amount,currency,case_id")
    .gte("created_at", from)
    .lte("created_at", to);
  let timeQuery = sb
    .from("time_entries")
    .select("minutes,billable")
    .gte("entry_date", from.slice(0, 10))
    .lte("entry_date", to.slice(0, 10));
  if (!hasGlobalCaseAccess(auth)) {
    casesQuery = casesQuery.in("id", accessibleCaseIds?.length ? accessibleCaseIds : [noCaseId]);
    financeQuery = financeQuery.in(
      "case_id",
      accessibleCaseIds?.length ? accessibleCaseIds : [noCaseId],
    );
    tasksQuery = tasksQuery.or(taskAccessOrFilter(auth.id, accessibleCaseIds));
    const timeFilter = accessibleCaseIds?.length
      ? `case_id.in.(${accessibleCaseIds.join(",")}),and(case_id.is.null,profile_id.eq.${auth.id})`
      : `and(case_id.is.null,profile_id.eq.${auth.id})`;
    timeQuery = timeQuery.or(timeFilter);
  }
  const [cases, tasks, finance, time, unread, leads, closedCases, stages] = await Promise.all([
    casesQuery,
    tasksQuery,
    financeQuery,
    timeQuery,
    sb
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("recipient_id", auth.id)
      .is("read_at", null),
    sb
      .from("leads")
      .select(
        "id, status, source, locale, intent, assignee_id, created_at, first_responded_at, closed_at",
      )
      .gte("created_at", from)
      .lte("created_at", to)
      .limit(5000),
    sb
      .from("cases")
      .select("id, stage_id, estimated_value, currency, lead_id")
      .not("lead_id", "is", null)
      .gte("created_at", from)
      .lte("created_at", to)
      .limit(5000),
    sb.from("pipeline_stages").select("id, key, is_won, is_closed"),
  ]);
  const error =
    cases.error ||
    tasks.error ||
    finance.error ||
    time.error ||
    unread.error ||
    leads.error ||
    closedCases.error ||
    stages.error;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const taskCounts: Record<string, number> = {};
  for (const task of tasks.data || []) taskCounts[task.status] = (taskCounts[task.status] || 0) + 1;
  taskCounts.overdue = (tasks.data || []).filter(
    (task) =>
      task.due_at &&
      new Date(task.due_at).getTime() < Date.now() &&
      !["done", "cancelled"].includes(task.status),
  ).length;
  const financeByCurrency: Record<string, { planned: number; paid: number; invoiced: number }> = {};
  for (const item of finance.data || []) {
    const totals = (financeByCurrency[item.currency] ||= { planned: 0, paid: 0, invoiced: 0 });
    const amount = Number(item.amount) || 0;
    if (item.status === "paid") totals.paid += amount;
    else if (item.status === "invoiced" || item.status === "overdue") totals.invoiced += amount;
    else if (item.status === "planned") totals.planned += amount;
  }
  const minutes = (time.data || []).reduce((sum, entry) => sum + Number(entry.minutes || 0), 0);
  const billableMinutes = (time.data || []).reduce(
    (entrySum, entry) => entrySum + (entry.billable ? Number(entry.minutes || 0) : 0),
    0,
  );

  const leadRows = leads.data || [];
  const created = leadRows.length;
  const inProgress = leadRows.filter((lead) => lead.status === "in_progress").length;
  const won = leadRows.filter((lead) => lead.status === "won").length;
  const lost = leadRows.filter((lead) => lead.status === "lost" || lead.status === "spam").length;
  const stageById = new Map((stages.data || []).map((stage) => [stage.id, stage]));
  const convertedCases = closedCases.data || [];
  const caseWon = convertedCases.filter((item) => {
    const stage = item.stage_id ? stageById.get(item.stage_id) : null;
    return Boolean(stage?.is_won);
  }).length;
  const revenueByCurrency: Record<string, number> = {};
  for (const item of convertedCases) {
    const stage = item.stage_id ? stageById.get(item.stage_id) : null;
    if (!stage?.is_won) continue;
    const currency = item.currency || "EUR";
    revenueByCurrency[currency] =
      (revenueByCurrency[currency] || 0) + Number(item.estimated_value || 0);
  }

  const responseTimes = leadRows
    .filter((lead) => lead.first_responded_at)
    .map(
      (lead) =>
        new Date(lead.first_responded_at as string).getTime() -
        new Date(lead.created_at).getTime(),
    )
    .filter((value) => value >= 0);

  const bySource: Record<string, number> = {};
  const byLocale: Record<string, number> = {};
  const byIntent: Record<string, number> = {};
  const byAssignee: Record<string, { total: number; won: number }> = {};
  for (const lead of leadRows) {
    const source = lead.source || "unknown";
    const locale = lead.locale || "unknown";
    const intent = lead.intent || "unknown";
    bySource[source] = (bySource[source] || 0) + 1;
    byLocale[locale] = (byLocale[locale] || 0) + 1;
    byIntent[intent] = (byIntent[intent] || 0) + 1;
    const assignee = lead.assignee_id || "unassigned";
    const bucket = (byAssignee[assignee] ||= { total: 0, won: 0 });
    bucket.total += 1;
    if (lead.status === "won") bucket.won += 1;
  }

  return NextResponse.json({
    periodDays,
    from,
    to,
    openCases: cases.data?.length || 0,
    tasks: taskCounts,
    finance: financeByCurrency,
    time: { minutes, billableMinutes },
    unreadNotifications: unread.count || 0,
    funnel: {
      created,
      inProgress,
      won,
      lost,
      convertedCases: convertedCases.length,
      caseWon,
      conversionRate: created ? Math.round((won / created) * 100) : 0,
      medianFirstResponseMs: medianMs(responseTimes),
      revenueByCurrency,
      bySource,
      byLocale,
      byIntent,
      byAssignee,
    },
  });
}
