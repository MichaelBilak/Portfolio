import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  BriefcaseBusiness,
  Clock3,
  HeartHandshake,
  Inbox,
  WalletCards,
} from "lucide-react";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import {
  canManageLeads,
  getStudioSession,
  hasStudioCapability,
} from "@/lib/studio/auth";
import {
  createStudioTranslator,
  formatStudioDate,
  resolveStudioLocale,
} from "@/lib/studio/i18n/messages";
import { studioPath } from "@/lib/studio/path";
import { ContentHealth } from "@/components/studio/analytics-charts";

export default async function StudioDashboardPage() {
  const user = await getStudioSession();
  if (!user) redirect(studioPath("/login"));
  if (
    !canManageLeads(user.role) &&
    !hasStudioCapability(user.role, "cases.read") &&
    !hasStudioCapability(user.role, "reports.read")
  ) {
    redirect(studioPath("/cases"));
  }

  const locale = resolveStudioLocale(user.adminLocale);
  const t = createStudioTranslator(locale);

  if (!isSupabaseConfigured()) {
    return (
      <>
        <h1 className="st-h1">{t("dashboard.title")}</h1>
        <p className="st-sub">{t("dashboard.missingEnv")}</p>
      </>
    );
  }

  const sb = createAdminClient();
  const nowIso = new Date().toISOString();
  const staleLeadBefore = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

  const [
    newLeads,
    slaLeads,
    overdueTasks,
    unpaidFinance,
    openCases,
    careActiveResult,
    careDueResult,
    periodLeads,
    wonLeads,
    completedCases,
    projectCount,
    serviceCount,
    projectTranslations,
    serviceTranslations,
    stages,
  ] = await Promise.all([
    sb
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
    sb
      .from("leads")
      .select("id, full_name, business_name, email, next_action_at, created_at, status")
      .in("status", ["new", "in_progress"])
      .or(
        `next_action_at.lte.${nowIso},and(status.eq.new,first_responded_at.is.null,created_at.lte.${staleLeadBefore})`,
      )
      .order("created_at", { ascending: false })
      .limit(8),
    sb
      .from("tasks")
      .select("id, title, due_at, case_id, status")
      .in("status", ["todo", "in_progress", "blocked"])
      .is("deleted_at", null)
      .lt("due_at", nowIso)
      .order("due_at", { ascending: true })
      .limit(8),
    sb
      .from("finance_milestones")
      .select("id, title, amount, currency, status, due_date, case_id")
      .in("status", ["planned", "invoiced", "overdue"])
      .order("due_date", { ascending: true })
      .limit(12),
    sb
      .from("cases")
      .select("id, stage_id", { count: "exact" })
      .is("archived_at", null),
    sb
      .from("care_retainers")
      .select("id, monthly_amount, currency", { count: "exact" })
      .eq("status", "active"),
    sb
      .from("care_retainers")
      .select("id, company_name, client_name, next_review_at, monthly_amount, currency")
      .eq("status", "active")
      .lte("next_review_at", nowIso)
      .order("next_review_at", { ascending: true })
      .limit(6),
    sb
      .from("leads")
      .select("id, status", { count: "exact" })
      .gte("created_at", new Date(Date.now() - 30 * 86_400_000).toISOString()),
    sb
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("status", "won")
      .gte("created_at", new Date(Date.now() - 30 * 86_400_000).toISOString()),
    sb
      .from("cases")
      .select("id, stage_id")
      .gte("updated_at", new Date(Date.now() - 30 * 86_400_000).toISOString())
      .limit(500),
    sb.from("projects").select("*", { count: "exact", head: true }),
    sb.from("services").select("*", { count: "exact", head: true }),
    sb.from("project_i18n").select("*", { count: "exact", head: true }),
    sb.from("service_i18n").select("*", { count: "exact", head: true }),
    sb.from("pipeline_stages").select("id, key, is_won, is_closed"),
  ]);

  // Soft-fail Care until migration 007 is applied.
  const activeCare = careActiveResult.error
    ? { data: [] as Array<{ monthly_amount: number; currency: string }>, count: 0 }
    : careActiveResult;
  const careDue = careDueResult.error
    ? {
        data: [] as Array<{
          id: string;
          company_name: string | null;
          client_name: string | null;
          next_review_at: string | null;
        }>,
      }
    : careDueResult;

  const stageById = new Map((stages.data || []).map((s) => [s.id, s]));
  const openStageIds = new Set(
    (stages.data || []).filter((s) => !s.is_closed).map((s) => s.id),
  );
  const activeDelivery = (openCases.data || []).filter(
    (row) => row.stage_id && openStageIds.has(row.stage_id),
  ).length;
  const completedCount = (completedCases.data || []).filter((row) => {
    const stage = row.stage_id ? stageById.get(row.stage_id) : null;
    return Boolean(stage?.key === "completed" || stage?.is_won);
  }).length;

  const unpaidRows = unpaidFinance.data || [];
  const unpaidTotalByCurrency: Record<string, number> = {};
  for (const row of unpaidRows) {
    const currency = row.currency || "EUR";
    unpaidTotalByCurrency[currency] =
      (unpaidTotalByCurrency[currency] || 0) + Number(row.amount || 0);
  }
  const unpaidTotalLabel =
    Object.entries(unpaidTotalByCurrency)
      .map(([currency, amount]) => `${amount.toLocaleString()} ${currency}`)
      .join(" · ") || "0";

  const careMrrByCurrency: Record<string, number> = {};
  for (const row of activeCare.data || []) {
    const currency = row.currency || "EUR";
    careMrrByCurrency[currency] =
      (careMrrByCurrency[currency] || 0) + Number(row.monthly_amount || 0);
  }
  const careMrrLabel =
    Object.entries(careMrrByCurrency)
      .map(([currency, amount]) => `${amount.toLocaleString()} ${currency}`)
      .join(" · ") || "0";

  const leadsCreated = periodLeads.count || 0;
  const leadsWon = wonLeads.count || 0;
  const conversion = leadsCreated ? Math.round((leadsWon / leadsCreated) * 100) : 0;

  const expectedTranslations =
    ((projectCount.count || 0) + (serviceCount.count || 0)) * 6;
  const actualTranslations =
    (projectTranslations.count || 0) + (serviceTranslations.count || 0);
  const contentHealth = expectedTranslations
    ? (actualTranslations / expectedTranslations) * 100
    : 100;

  const attentionLeads = slaLeads.data || [];
  const attentionTasks = overdueTasks.data || [];
  const attentionCare = careDue.data || [];

  return (
    <div className="st-pulse">
      <div className="st-page-header">
        <div>
          <p className="st-eyebrow">{t("dashboard.eyebrow")}</p>
          <h1 className="st-h1">{t("dashboard.title")}</h1>
          <p className="st-sub">{t("dashboard.pulseSub")}</p>
        </div>
        <div className="st-row" style={{ gap: "0.5rem", flexWrap: "wrap" }}>
          <Link className="st-btn primary" href={studioPath("/inbox")}>
            <Inbox size={16} /> {t("nav.inbox")}
          </Link>
          <Link className="st-btn" href={studioPath("/leads")}>
            {t("dashboard.openLeads")}
          </Link>
        </div>
      </div>

      <div className="st-metrics">
        <div className="st-metric">
          <span className="st-metric-icon">
            <AlertCircle size={18} />
          </span>
          <div>
            <small>{t("dashboard.needsAttention")}</small>
            <strong>
              {(newLeads.count || 0) + attentionLeads.length + attentionTasks.length}
            </strong>
            <em>
              {t("dashboard.attentionDetail", {
                leads: newLeads.count || 0,
                tasks: attentionTasks.length,
              })}
            </em>
          </div>
        </div>
        <div className="st-metric">
          <span className="st-metric-icon">
            <WalletCards size={18} />
          </span>
          <div>
            <small>{t("dashboard.unpaidMoney")}</small>
            <strong>{unpaidRows.length}</strong>
            <em>{unpaidTotalLabel}</em>
          </div>
        </div>
        <div className="st-metric">
          <span className="st-metric-icon">
            <BriefcaseBusiness size={18} />
          </span>
          <div>
            <small>{t("dashboard.activeDelivery")}</small>
            <strong>{activeDelivery}</strong>
            <em>
              {t("dashboard.careActive", { count: activeCare.count || 0 })} · MRR {careMrrLabel}
            </em>
          </div>
        </div>
        <div className="st-metric">
          <span className="st-metric-icon">
            <Clock3 size={18} />
          </span>
          <div>
            <small>{t("dashboard.funnel30")}</small>
            <strong>
              {leadsCreated}→{leadsWon}
            </strong>
            <em>
              {t("dashboard.conversion", { value: conversion })} · {completedCount}{" "}
              {t("dashboard.casesCompleted")}
            </em>
          </div>
        </div>
      </div>

      <div className="st-dashboard-grid">
        <section className="st-panel st-panel-wide">
          <div className="st-panel-head">
            <div>
              <h2>{t("dashboard.attentionTitle")}</h2>
              <p>{t("dashboard.attentionSub")}</p>
            </div>
          </div>
          <div className="st-pulse-lists">
            <div>
              <h3>
                <Inbox size={14} /> {t("nav.leads")}
              </h3>
              {!attentionLeads.length ? (
                <p className="st-empty-inline">{t("dashboard.attentionClear")}</p>
              ) : (
                <ul className="st-pulse-list">
                  {attentionLeads.map((lead) => (
                    <li key={lead.id}>
                      <Link href={studioPath(`/leads/${lead.id}`)}>
                        {lead.business_name || lead.full_name || lead.email || lead.id.slice(0, 8)}
                      </Link>
                      <span>
                        {lead.next_action_at
                          ? formatStudioDate(lead.next_action_at, locale, true)
                          : t("leads.slaBreached")}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h3>
                <AlertCircle size={14} /> {t("nav.tasks")}
              </h3>
              {!attentionTasks.length ? (
                <p className="st-empty-inline">{t("dashboard.attentionClear")}</p>
              ) : (
                <ul className="st-pulse-list">
                  {attentionTasks.map((task) => (
                    <li key={task.id}>
                      <Link
                        href={
                          task.case_id
                            ? studioPath(`/cases/${task.case_id}`)
                            : studioPath("/tasks")
                        }
                      >
                        {task.title}
                      </Link>
                      <span>
                        {task.due_at ? formatStudioDate(task.due_at, locale, true) : "—"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h3>
                <WalletCards size={14} /> {t("dashboard.unpaidMoney")}
              </h3>
              {!unpaidRows.length ? (
                <p className="st-empty-inline">{t("dashboard.attentionClear")}</p>
              ) : (
                <ul className="st-pulse-list">
                  {unpaidRows.slice(0, 6).map((row) => (
                    <li key={row.id}>
                      <Link
                        href={
                          row.case_id
                            ? studioPath(`/cases/${row.case_id}`)
                            : studioPath("/reports")
                        }
                      >
                        {row.title} · {Number(row.amount || 0).toLocaleString()} {row.currency}
                      </Link>
                      <span>{row.status}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h3>
                <HeartHandshake size={14} /> {t("nav.care")}
              </h3>
              {!attentionCare.length ? (
                <p className="st-empty-inline">{t("dashboard.attentionClear")}</p>
              ) : (
                <ul className="st-pulse-list">
                  {attentionCare.map((row) => (
                    <li key={row.id}>
                      <Link href={studioPath("/care")}>
                        {row.company_name || row.client_name || row.id.slice(0, 8)}
                      </Link>
                      <span>
                        {row.next_review_at
                          ? formatStudioDate(row.next_review_at, locale, true)
                          : "—"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        <section className="st-panel">
          <div className="st-panel-head">
            <div>
              <h2>{t("dashboard.siteHealthTitle")}</h2>
              <p>{t("dashboard.siteHealthSub")}</p>
            </div>
          </div>
          <ContentHealth
            value={contentHealth}
            label={t("dashboard.translations")}
            hint={
              contentHealth >= 90
                ? t("dashboard.healthReady")
                : contentHealth >= 60
                  ? t("dashboard.healthPartial")
                  : t("dashboard.healthLow")
            }
          />
          <Link href={studioPath("/projects")} className="st-panel-link">
            {t("dashboard.checkContent")} <ArrowRight size={15} />
          </Link>
        </section>

        <section className="st-panel">
          <div className="st-panel-head">
            <div>
              <h2>{t("dashboard.loopTitle")}</h2>
              <p>{t("dashboard.loopSub")}</p>
            </div>
          </div>
          <ol className="st-pulse-loop">
            <li>
              <Link href={studioPath("/leads")}>{t("nav.leads")}</Link>
              <span>{newLeads.count || 0} new</span>
            </li>
            <li>
              <Link href={studioPath("/cases")}>{t("nav.cases")}</Link>
              <span>{activeDelivery} active</span>
            </li>
            <li>
              <Link href={studioPath("/care")}>{t("nav.care")}</Link>
              <span>{activeCare.count || 0} active</span>
            </li>
            <li>
              <Link href={studioPath("/projects")}>{t("nav.portfolio")}</Link>
              <span>{projectCount.count || 0}</span>
            </li>
          </ol>
          <Link href={studioPath("/reports")} className="st-panel-link">
            {t("nav.reports")} <ArrowRight size={15} />
          </Link>
        </section>
      </div>
    </div>
  );
}
