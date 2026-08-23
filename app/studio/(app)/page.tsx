import Link from "next/link";
import { AlertTriangle, ArrowRight, BriefcaseBusiness, CheckSquare2, CircleDollarSign, Clock3, Handshake, Receipt } from "lucide-react";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { studioPath } from "@/lib/studio/path";

type Deal = { id: string; title: string; value: number | string | null; probability: number | null; stage: string; expected_close_date: string | null; next_action: string | null; next_action_date: string | null };
type Task = { id: string; title: string; due_at: string | null; priority: string; status: string };
type Project = { id: string; name: string; status: string; health: string; progress: number; target_date: string | null; sold_price: number | string | null; actual_hours: number | string | null; internal_hourly_cost: number | string | null };
type Invoice = { id: string; invoice_number: string; status: string; due_date: string; remaining_amount: number | string | null; currency: string };
type Payment = { amount: number | string; currency: string; paid_at: string };
type Subscription = { amount: number | string; currency: string; interval: string; status: string };
type Lead = { id: string; business_name: string | null; full_name: string | null; status: string; next_follow_up_at?: string | null; next_action_at: string | null };

const activeDealStages = ["discovery", "qualified", "proposal", "negotiation"];
const activeProjectStatuses = ["planned", "discovery", "design", "development", "testing", "waiting_client", "launch"];

function money(amount: number, currency = "EUR") {
  return new Intl.NumberFormat("en-IE", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

function number(value: number | string | null | undefined) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function sum<T>(rows: T[], selector: (row: T) => number) {
  return rows.reduce((total, row) => total + selector(row), 0);
}

export default async function StudioDashboardPage() {
  if (!isSupabaseConfigured()) {
    return <div className="st-state st-state-error"><strong>Supabase is not configured</strong><span>Add the Studio environment variables before opening DormUp HQ.</span></div>;
  }

  const sb = createAdminClient();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(todayStart.getTime() + 86_400_000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const inThirtyDays = new Date(now.getTime() + 30 * 86_400_000);

  const [tasksResult, leadsResult, dealsResult, projectsResult, invoicesResult, paymentsResult, previousPaymentsResult, subscriptionsResult] = await Promise.all([
    sb.from("tasks").select("id,title,due_at,priority,status").in("status", ["todo", "in_progress", "blocked", "waiting"]).is("deleted_at", null).order("due_at").limit(200),
    sb.from("leads").select("id,business_name,full_name,status,next_follow_up_at,next_action_at").limit(500),
    sb.from("deals").select("id,title,value,probability,stage,expected_close_date,next_action,next_action_date").limit(500),
    sb.from("client_projects").select("id,name,status,health,progress,target_date,sold_price,actual_hours,internal_hourly_cost").in("status", activeProjectStatuses).order("target_date").limit(100),
    sb.from("invoices").select("id,invoice_number,status,due_date,remaining_amount,currency").not("status", "in", '("paid","cancelled","void")').limit(200),
    sb.from("payments").select("amount,currency,paid_at").eq("status", "succeeded").gte("paid_at", monthStart.toISOString()),
    sb.from("payments").select("amount,currency,paid_at").eq("status", "succeeded").gte("paid_at", previousMonthStart.toISOString()).lt("paid_at", monthStart.toISOString()),
    sb.from("subscriptions").select("amount,currency,interval,status").eq("status", "active"),
  ]);

  const tasks = (tasksResult.data || []) as unknown as Task[];
  const leads = (leadsResult.data || []) as unknown as Lead[];
  const deals = (dealsResult.data || []) as unknown as Deal[];
  const projects = (projectsResult.data || []) as unknown as Project[];
  const invoices = (invoicesResult.data || []) as unknown as Invoice[];
  const payments = (paymentsResult.data || []) as unknown as Payment[];
  const previousPayments = (previousPaymentsResult.data || []) as unknown as Payment[];
  const subscriptions = (subscriptionsResult.data || []) as unknown as Subscription[];

  const tasksToday = tasks.filter((task) => task.due_at && new Date(task.due_at) >= todayStart && new Date(task.due_at) < tomorrow);
  const overdueTasks = tasks.filter((task) => task.due_at && new Date(task.due_at) < todayStart);
  const clientsWaiting = projects.filter((project) => project.status === "waiting_client");
  const projectsAtRisk = projects.filter((project) => project.health === "red" || project.health === "critical");
  const activeDeals = deals.filter((deal) => activeDealStages.includes(deal.stage));
  const pipeline = sum(activeDeals, (deal) => number(deal.value));
  const weightedPipeline = sum(activeDeals, (deal) => number(deal.value) * number(deal.probability) / 100);
  const revenue = sum(payments, (payment) => number(payment.amount));
  const previousRevenue = sum(previousPayments, (payment) => number(payment.amount));
  const revenueDelta = previousRevenue ? Math.round(((revenue - previousRevenue) / previousRevenue) * 100) : null;
  const outstanding = sum(invoices, (invoice) => number(invoice.remaining_amount));
  const mrr = sum(subscriptions, (subscription) => {
    const amount = number(subscription.amount);
    return subscription.interval === "year" ? amount / 12 : subscription.interval === "quarter" ? amount / 3 : subscription.interval === "week" ? amount * 52 / 12 : amount;
  });
  const expectedDeals = sum(activeDeals.filter((deal) => deal.expected_close_date && new Date(deal.expected_close_date) <= inThirtyDays), (deal) => number(deal.value) * number(deal.probability) / 100);
  const expectedInvoices = sum(invoices.filter((invoice) => new Date(invoice.due_date) <= inThirtyDays), (invoice) => number(invoice.remaining_amount));
  const expectedThirty = expectedDeals + expectedInvoices;
  const estimatedProfit = sum(projects, (project) => number(project.sold_price) - number(project.actual_hours) * number(project.internal_hourly_cost));

  const stages = ["discovery", "qualified", "proposal", "negotiation"];
  const nextActions = [
    ...overdueTasks.map((task) => ({ key: `task-${task.id}`, title: task.title, detail: "Overdue task", href: "/tasks", rank: 0 })),
    ...deals.filter((deal) => deal.next_action).map((deal) => ({ key: `deal-${deal.id}`, title: deal.next_action || deal.title, detail: deal.title, href: `/deals/${deal.id}`, rank: deal.next_action_date && new Date(deal.next_action_date) < now ? 1 : 3 })),
    ...leads.filter((lead) => lead.next_follow_up_at || lead.next_action_at).map((lead) => ({ key: `lead-${lead.id}`, title: `Follow up with ${lead.business_name || lead.full_name || "lead"}`, detail: "Lead follow-up", href: `/leads/${lead.id}`, rank: 2 })),
    ...invoices.filter((invoice) => invoice.status === "overdue" || new Date(invoice.due_date) < todayStart).map((invoice) => ({ key: `invoice-${invoice.id}`, title: `Collect invoice ${invoice.invoice_number}`, detail: money(number(invoice.remaining_amount), invoice.currency), href: `/invoices/${invoice.id}`, rank: 1 })),
  ].sort((a, b) => a.rank - b.rank).slice(0, 8);

  return <div className="st-hq-dashboard">
    <div className="st-page-header"><div><p className="st-eyebrow">DormUp HQ</p><h1 className="st-h1">Business control center</h1><p className="st-sub">What is happening, what is at risk, and what to do next.</p></div><Link className="st-btn primary" href={studioPath("/tasks")}><CheckSquare2 size={15} /> Open today</Link></div>

    <section><div className="st-section-title"><h2>Today</h2></div><div className="st-hq-metrics st-hq-metrics-four">
      <Link href={studioPath("/tasks")} className="st-metric-card"><CheckSquare2 /><small>Tasks today</small><strong>{tasksToday.length}</strong><span>Due before tomorrow</span></Link>
      <Link href={studioPath("/tasks")} className="st-metric-card danger"><Clock3 /><small>Overdue tasks</small><strong>{overdueTasks.length}</strong><span>Needs immediate action</span></Link>
      <Link href={studioPath("/projects")} className="st-metric-card"><Handshake /><small>Clients waiting</small><strong>{clientsWaiting.length}</strong><span>Waiting on client input</span></Link>
      <Link href={studioPath("/projects")} className="st-metric-card warning"><AlertTriangle /><small>Projects at risk</small><strong>{projectsAtRisk.length}</strong><span>Blocked or deadline risk</span></Link>
    </div></section>

    <div className="st-dashboard-grid">
      <section className="st-panel st-panel-wide"><div className="st-panel-head"><div><h2>Sales</h2><p>Live opportunity value, not vanity analytics.</p></div><Link href={studioPath("/deals")}>Open pipeline <ArrowRight size={14} /></Link></div>
        <div className="st-hq-metrics"><div className="st-metric-card"><BriefcaseBusiness /><small>Active leads</small><strong>{leads.filter((lead) => !["converted", "lost"].includes(lead.status)).length}</strong></div><div className="st-metric-card"><Handshake /><small>Proposals</small><strong>{deals.filter((deal) => deal.stage === "proposal").length}</strong></div><div className="st-metric-card"><CircleDollarSign /><small>Pipeline</small><strong>{money(pipeline)}</strong></div><div className="st-metric-card"><CircleDollarSign /><small>Weighted</small><strong>{money(weightedPipeline)}</strong></div></div>
        <div className="st-pipeline-strip">{stages.map((stage) => { const rows = activeDeals.filter((deal) => deal.stage === stage); return <div key={stage}><span>{stage}</span><strong>{rows.length}</strong><small>{money(sum(rows, (deal) => number(deal.value)))}</small></div>; })}</div>
      </section>

      <section className="st-panel"><div className="st-panel-head"><div><h2>Money</h2><p>Collected, recurring and expected.</p></div><Link href={studioPath("/payments")}>Finance <ArrowRight size={14} /></Link></div><dl className="st-money-list"><div><dt>Revenue this month</dt><dd>{money(revenue)} {revenueDelta !== null ? <small>{revenueDelta >= 0 ? "+" : ""}{revenueDelta}%</small> : null}</dd></div><div><dt>MRR</dt><dd>{money(mrr)}</dd></div><div><dt>Outstanding</dt><dd>{money(outstanding)}</dd></div><div><dt>Expected 30 days</dt><dd>{money(expectedThirty)}</dd></div><div><dt>Estimated project profit</dt><dd>{money(estimatedProfit)}</dd></div></dl></section>
    </div>

    <div className="st-dashboard-grid">
      <section className="st-panel st-panel-wide"><div className="st-panel-head"><div><h2>Active projects</h2><p>Delivery health and next deadlines.</p></div><Link href={studioPath("/projects")}>All projects <ArrowRight size={14} /></Link></div>
        {!projects.length ? <p className="st-empty-inline">No active projects. Convert a won deal to begin delivery.</p> : <div className="st-table-wrap"><table className="st-table"><thead><tr><th>Project</th><th>Status</th><th>Progress</th><th>Health</th><th>Deadline</th></tr></thead><tbody>{projects.slice(0, 8).map((project) => <tr key={project.id}><td><Link href={studioPath(`/projects/${project.id}`)}>{project.name}</Link></td><td><span className={`st-status st-status-${project.status}`}>{project.status.replaceAll("_", " ")}</span></td><td>{project.progress || 0}%</td><td><span className={`st-health st-health-${project.health}`}>{project.health}</span></td><td>{project.target_date ? new Date(project.target_date).toLocaleDateString() : "—"}</td></tr>)}</tbody></table></div>}
      </section>
      <section className="st-panel"><div className="st-panel-head"><div><h2>Next actions</h2><p>Overdue first, then priority and deadline.</p></div><Receipt size={17} /></div>{nextActions.length ? <ol className="st-next-actions">{nextActions.map((action, index) => <li key={action.key}><span>{index + 1}</span><Link href={studioPath(action.href)}><strong>{action.title}</strong><small>{action.detail}</small></Link></li>)}</ol> : <p className="st-empty-inline">Nothing urgent. Add next actions to active deals and leads.</p>}</section>
    </div>
  </div>;
}
