import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStudioUser } from "@/lib/studio/auth";
import { getAccessibleCaseIds, hasGlobalCaseAccess } from "@/lib/studio/access";

export async function GET(request: NextRequest) {
  const auth = await requireStudioUser({ capability: "reports.read" });
  if ("error" in auth) return auth.error;
  const days = Math.min(Math.max(Number(request.nextUrl.searchParams.get("days") || 30), 1), 365);
  const since = new Date(Date.now() - days * 86_400_000).toISOString();
  const sb = createAdminClient();
  const accessibleCaseIds = await getAccessibleCaseIds(sb, auth);
  const noCaseId = "00000000-0000-0000-0000-000000000000";
  let casesQuery = sb
    .from("cases")
    .select("id,stage_id,estimated_value,currency")
    .is("archived_at", null);
  let tasksQuery = sb.from("tasks").select("id,status,due_at").gte("created_at", since);
  let financeQuery = sb
    .from("finance_milestones")
    .select("status,amount,currency")
    .gte("created_at", since);
  let timeQuery = sb
    .from("time_entries")
    .select("minutes,billable")
    .gte("entry_date", since.slice(0, 10));
  if (!hasGlobalCaseAccess(auth)) {
    casesQuery = casesQuery.in("id", accessibleCaseIds?.length ? accessibleCaseIds : [noCaseId]);
    financeQuery = financeQuery.in(
      "case_id",
      accessibleCaseIds?.length ? accessibleCaseIds : [noCaseId],
    );
    const taskFilter = accessibleCaseIds?.length
      ? `case_id.in.(${accessibleCaseIds.join(",")}),and(case_id.is.null,or(created_by.eq.${auth.id},assignee_id.eq.${auth.id}))`
      : `and(case_id.is.null,or(created_by.eq.${auth.id},assignee_id.eq.${auth.id}))`;
    tasksQuery = tasksQuery.or(taskFilter);
    const timeFilter = accessibleCaseIds?.length
      ? `case_id.in.(${accessibleCaseIds.join(",")}),and(case_id.is.null,profile_id.eq.${auth.id})`
      : `and(case_id.is.null,profile_id.eq.${auth.id})`;
    timeQuery = timeQuery.or(timeFilter);
  }
  const [cases, tasks, finance, time, unread] = await Promise.all([
    casesQuery,
    tasksQuery,
    financeQuery,
    timeQuery,
    sb
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("recipient_id", auth.id)
      .is("read_at", null),
  ]);
  const error = cases.error || tasks.error || finance.error || time.error || unread.error;
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
    (sum, entry) => sum + (entry.billable ? Number(entry.minutes || 0) : 0),
    0,
  );
  return NextResponse.json({
    periodDays: days,
    openCases: cases.data?.length || 0,
    tasks: taskCounts,
    finance: financeByCurrency,
    time: { minutes, billableMinutes },
    unreadNotifications: unread.count || 0,
  });
}
