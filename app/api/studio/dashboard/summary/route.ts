import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStudioUser } from "@/lib/studio/auth";
import { addDecimals, subtractDecimals } from "@/lib/studio/hq/money";
import {
  monthlyRecurringRevenue,
  openPipelineValue,
  weightedPipelineValue,
  type PipelineDeal,
  type RecurringAmount,
} from "@/lib/studio/hq/dashboard";
import type { BillingInterval } from "@/lib/studio/hq/enums";
import type { DecimalString } from "@/lib/studio/hq/types";

const MAX_ROWS = 2000;

function dateParam(request: NextRequest, name: string, fallback: string) {
  const value = request.nextUrl.searchParams.get(name);
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : fallback;
}

export async function GET(request: NextRequest) {
  const auth = await requireStudioUser({ capability: "reports.read" });
  if ("error" in auth) return auth.error;
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const monthStart = `${today.slice(0, 7)}-01`;
  const from = dateParam(request, "from", monthStart);
  const to = dateParam(request, "to", today);
  if (from > to) return NextResponse.json({ error: "from must not be after to" }, { status: 400 });

  const sb = createAdminClient();
  const rpc = await sb.rpc("hq_dashboard_summary", { p_from: from, p_to: to });
  if (!rpc.error) return NextResponse.json(rpc.data);
  const missingRpc =
    rpc.error.code === "PGRST202" ||
    /hq_dashboard_summary|function.*not found|schema cache/i.test(rpc.error.message);
  if (!missingRpc) return NextResponse.json({ error: rpc.error.message }, { status: 400 });

  const [deals, projects, invoices, payments, subscriptions] = await Promise.all([
    sb.from("deals").select("status,value,probability,closed_at").limit(MAX_ROWS),
    sb.from("client_projects").select("status,health,target_date").limit(MAX_ROWS),
    sb
      .from("invoices")
      .select("status,total,amount_paid,issue_date")
      .gte("issue_date", from)
      .lte("issue_date", to)
      .limit(MAX_ROWS),
    sb
      .from("payments")
      .select("status,amount,paid_at")
      .eq("status", "succeeded")
      .gte("paid_at", `${from}T00:00:00.000Z`)
      .lte("paid_at", `${to}T23:59:59.999Z`)
      .limit(MAX_ROWS),
    sb.from("subscriptions").select("status,amount,interval,interval_count").limit(MAX_ROWS),
  ]);
  const error = deals.error || projects.error || invoices.error || payments.error || subscriptions.error;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const dealRows: PipelineDeal[] = (deals.data || []).map((row) => ({
    status: row.status as PipelineDeal["status"],
    value: String(row.value) as DecimalString,
    probability: Number(row.probability),
  }));
  const subscriptionRows: RecurringAmount[] = (subscriptions.data || []).map((row) => ({
    status: row.status as RecurringAmount["status"],
    amount: String(row.amount) as DecimalString,
    interval: row.interval as BillingInterval,
    intervalCount: Number(row.interval_count),
  }));
  const invoiceRows = invoices.data || [];
  const projectRows = projects.data || [];
  const wonValues = (deals.data || [])
    .filter((row) => row.status === "won" && row.closed_at?.slice(0, 10) >= from && row.closed_at?.slice(0, 10) <= to)
    .map((row) => String(row.value) as DecimalString);
  const receivables = invoiceRows
    .filter((row) => ["sent", "partially_paid", "overdue"].includes(row.status))
    .map((row) => subtractDecimals(String(row.total) as DecimalString, String(row.amount_paid) as DecimalString));

  return NextResponse.json({
    from,
    to,
    openDeals: dealRows.filter((row) => row.status === "open").length,
    pipelineValue: openPipelineValue(dealRows),
    weightedPipeline: weightedPipelineValue(dealRows),
    wonValue: addDecimals(wonValues),
    openProjects: projectRows.filter((row) =>
      ["planned", "discovery", "design", "development", "testing", "waiting_client", "launch", "paused"].includes(
        row.status,
      ),
    ).length,
    unhealthyProjects: projectRows.filter((row) => ["yellow", "red"].includes(row.health)).length,
    overdueProjects: projectRows.filter(
      (row) => row.target_date && row.target_date < today && !["completed", "cancelled"].includes(row.status),
    ).length,
    invoicedValue: addDecimals(invoiceRows.map((row) => String(row.total) as DecimalString)),
    invoicePaidValue: addDecimals(invoiceRows.map((row) => String(row.amount_paid) as DecimalString)),
    receivables: addDecimals(receivables),
    cashCollected: addDecimals((payments.data || []).map((row) => String(row.amount) as DecimalString)),
    mrr: monthlyRecurringRevenue(subscriptionRows),
    boundedFallback: { maxRowsPerEntity: MAX_ROWS },
  });
}
