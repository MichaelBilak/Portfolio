import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Clock3, Inbox, Trophy, UsersRound } from "lucide-react";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { canManageLeads, getStudioSession } from "@/lib/studio/auth";
import {
  createStudioTranslator,
  labelLang,
  labelStatus,
  resolveStudioLocale,
  studioDateLocale,
} from "@/lib/studio/i18n/messages";
import { studioPath } from "@/lib/studio/path";
import { medianMs } from "@/lib/studio/leads";
import {
  BreakdownChart,
  ContentHealth,
  LeadsTrendChart,
} from "@/components/studio/analytics-charts";

type LeadRow = {
  id: string;
  status: string;
  source: string | null;
  locale: string | null;
  intent: string | null;
  assignee_id: string | null;
  first_responded_at: string | null;
  created_at: string;
};

const TIMELINES = [7, 14, 30, 90] as const;
type TimelineDays = (typeof TIMELINES)[number];

function countBy(
  rows: LeadRow[],
  key: "status" | "source" | "locale" | "intent",
  locale: ReturnType<typeof resolveStudioLocale>,
) {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const value = row[key] || "unknown";
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, value]) => ({
      label:
        key === "status"
          ? labelStatus(locale, label)
          : key === "locale"
            ? labelLang(locale, label)
            : label.replace(/_/g, " "),
      value,
    }))
    .sort((a, b) => b.value - a.value);
}

export default async function StudioDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string; from?: string; to?: string }>;
}) {
  const user = await getStudioSession();
  if (!user || !canManageLeads(user.role)) redirect(studioPath("/cases"));

  const locale = resolveStudioLocale(user.adminLocale);
  const t = createStudioTranslator(locale);

  const params = await searchParams;
  const customFrom = params.from ? new Date(params.from) : null;
  const customTo = params.to ? new Date(params.to) : null;
  const useCustom =
    customFrom &&
    !Number.isNaN(customFrom.getTime()) &&
    customTo &&
    !Number.isNaN(customTo.getTime());

  const requestedDays = Number(params.days);
  const days: TimelineDays = TIMELINES.includes(requestedDays as TimelineDays)
    ? (requestedDays as TimelineDays)
    : 14;

  const periodEnd = useCustom ? customTo! : new Date();
  const periodStart = useCustom
    ? customFrom!
    : new Date(Date.now() - days * 86_400_000);
  const periodDays = Math.max(
    1,
    Math.round((periodEnd.getTime() - periodStart.getTime()) / 86_400_000),
  );
  const lookbackStart = new Date(
    periodStart.getTime() - (periodEnd.getTime() - periodStart.getTime()),
  );

  if (!isSupabaseConfigured()) {
    return (
      <>
        <h1 className="st-h1">{t("dashboard.title")}</h1>
        <p className="st-sub">{t("dashboard.missingEnv")}</p>
      </>
    );
  }

  const sb = createAdminClient();
  const [
    leadsResult,
    casesResult,
    stagesResult,
    projectCount,
    serviceCount,
    projectTranslations,
    serviceTranslations,
  ] = await Promise.all([
    sb
      .from("leads")
      .select(
        "id, status, source, locale, intent, assignee_id, first_responded_at, created_at",
      )
      .gte("created_at", lookbackStart.toISOString())
      .lte("created_at", periodEnd.toISOString())
      .order("created_at", { ascending: true })
      .limit(5000),
    sb
      .from("cases")
      .select("id, lead_id, stage_id, estimated_value, currency, created_at")
      .not("lead_id", "is", null)
      .gte("created_at", periodStart.toISOString())
      .lte("created_at", periodEnd.toISOString())
      .limit(2000),
    sb.from("pipeline_stages").select("id, is_won"),
    sb.from("projects").select("*", { count: "exact", head: true }),
    sb.from("services").select("*", { count: "exact", head: true }),
    sb.from("project_i18n").select("*", { count: "exact", head: true }),
    sb.from("service_i18n").select("*", { count: "exact", head: true }),
  ]);
  const allLeads = (leadsResult.data || []) as LeadRow[];
  const leads = allLeads.filter((lead) => {
    const created = new Date(lead.created_at);
    return created >= periodStart && created <= periodEnd;
  });
  const previousLeads = allLeads.filter((lead) => {
    const created = new Date(lead.created_at);
    return created < periodStart && created >= lookbackStart;
  });
  const newCount = leads.filter((lead) => lead.status === "new").length;
  const activeCount = leads.filter((lead) => lead.status === "in_progress").length;
  const wonCount = leads.filter((lead) => lead.status === "won").length;
  const conversion = leads.length ? Math.round((wonCount / leads.length) * 100) : 0;
  const recentCount = leads.length;
  const priorCount = previousLeads.length;
  const growth = priorCount
    ? Math.round(((recentCount - priorCount) / priorCount) * 100)
    : recentCount
      ? 100
      : 0;

  const responseTimes = leads
    .filter((lead) => lead.first_responded_at)
    .map(
      (lead) =>
        new Date(lead.first_responded_at as string).getTime() -
        new Date(lead.created_at).getTime(),
    )
    .filter((value) => value >= 0);
  const medianResponseHours = medianMs(responseTimes);
  const medianHoursLabel =
    medianResponseHours == null
      ? "—"
      : t("dashboard.hoursShort", {
          hours: Math.round((medianResponseHours / 3_600_000) * 10) / 10,
        });

  const wonStages = new Set(
    (stagesResult.data || []).filter((stage) => stage.is_won).map((stage) => stage.id),
  );
  const convertedCases = casesResult.data || [];
  const caseWonCount = convertedCases.filter((item) =>
    item.stage_id ? wonStages.has(item.stage_id) : false,
  ).length;

  const dateLocale = studioDateLocale(locale);
  const trendDays = Math.min(periodDays, 90);
  const trend = Array.from({ length: trendDays }, (_, index) => {
    const date = new Date(periodEnd);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (trendDays - 1 - index));
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    return {
      label: date.toLocaleDateString(dateLocale, { day: "numeric", month: "short" }),
      value: leads.filter((lead) => {
        const created = new Date(lead.created_at);
        return created >= date && created < next;
      }).length,
    };
  });

  const expectedTranslations =
    ((projectCount.count || 0) + (serviceCount.count || 0)) * 6;
  const actualTranslations =
    (projectTranslations.count || 0) + (serviceTranslations.count || 0);
  const contentHealth = expectedTranslations
    ? (actualTranslations / expectedTranslations) * 100
    : 100;
  const healthHint =
    contentHealth >= 90
      ? t("dashboard.healthReady")
      : contentHealth >= 60
        ? t("dashboard.healthPartial")
        : t("dashboard.healthLow");

  const funnelItems = [
    { label: t("dashboard.funnelCreated"), value: leads.length },
    { label: t("dashboard.funnelQualified"), value: activeCount },
    { label: t("dashboard.funnelWon"), value: wonCount },
    { label: t("dashboard.funnelCases"), value: convertedCases.length },
  ];

  return (
    <>
      <div className="st-page-header">
        <div>
          <p className="st-eyebrow">{t("dashboard.eyebrow")}</p>
          <h1 className="st-h1">{t("dashboard.title")}</h1>
          <p className="st-sub">{t("dashboard.subtitle", { days: periodDays })}</p>
        </div>
        <Link className="st-btn primary" href={studioPath("/leads")}>
          <Inbox size={16} /> {t("dashboard.openLeads")}
        </Link>
      </div>

      <div className="st-metrics">
        <div className="st-metric">
          <span className="st-metric-icon"><UsersRound size={18} /></span>
          <div>
            <small>{t("dashboard.totalLeads")}</small>
            <strong>{leads.length}</strong>
            <em className={growth >= 0 ? "positive" : "negative"}>
              {growth >= 0 ? "+" : ""}
              {t("dashboard.vsPrevious", { value: growth })}
            </em>
          </div>
        </div>
        <div className="st-metric">
          <span className="st-metric-icon"><Inbox size={18} /></span>
          <div>
            <small>{t("dashboard.needsAttention")}</small>
            <strong>{newCount}</strong>
            <em>{t("dashboard.inProgressNow", { count: activeCount })}</em>
          </div>
        </div>
        <div className="st-metric">
          <span className="st-metric-icon"><Trophy size={18} /></span>
          <div>
            <small>{t("dashboard.won")}</small>
            <strong>{wonCount}</strong>
            <em>
              {t("dashboard.conversion", { value: conversion })} · {caseWonCount} case won
            </em>
          </div>
        </div>
        <div className="st-metric">
          <span className="st-metric-icon"><Clock3 size={18} /></span>
          <div>
            <small>{t("dashboard.medianResponse")}</small>
            <strong>{medianHoursLabel}</strong>
            <em>
              {t("dashboard.contentCounts", {
                projects: projectCount.count || 0,
                services: serviceCount.count || 0,
              })}
            </em>
          </div>
        </div>
      </div>

      <div className="st-dashboard-grid">
        <section className="st-panel st-panel-wide">
          <div className="st-panel-head">
            <div>
              <h2>{t("dashboard.trendTitle")}</h2>
              <p>{t("dashboard.trendSub", { days: periodDays })}</p>
            </div>
            <div className="st-panel-actions">
              <span className="st-panel-total">{t("dashboard.leadsCount", { count: recentCount })}</span>
              <nav className="st-timeline" aria-label={t("dashboard.timelineAria")}>
                {TIMELINES.map((value) => (
                  <Link
                    key={value}
                    href={`${studioPath()}?days=${value}`}
                    className={!useCustom && value === days ? "active" : undefined}
                    aria-current={!useCustom && value === days ? "page" : undefined}
                    scroll={false}
                  >
                    {t("dashboard.daysShort", { days: value })}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          <form className="st-row" style={{ marginBottom: "0.75rem", gap: "0.5rem" }}>
            <label className="st-label">
              {t("dashboard.customFrom")}
              <input
                className="st-input"
                type="date"
                name="from"
                defaultValue={useCustom ? periodStart.toISOString().slice(0, 10) : ""}
              />
            </label>
            <label className="st-label">
              {t("dashboard.customTo")}
              <input
                className="st-input"
                type="date"
                name="to"
                defaultValue={useCustom ? periodEnd.toISOString().slice(0, 10) : ""}
              />
            </label>
            <button className="st-btn" type="submit" style={{ alignSelf: "end" }}>
              {t("dashboard.applyPeriod")}
            </button>
          </form>
          <LeadsTrendChart
            points={trend}
            ariaLabel={t("dashboard.chartAria", { days: periodDays })}
          />
        </section>

        <section className="st-panel">
          <div className="st-panel-head">
            <div>
              <h2>{t("dashboard.funnelTitle")}</h2>
              <p>{t("dashboard.funnelSub")}</p>
            </div>
          </div>
          <BreakdownChart
            items={funnelItems}
            emptyLabel={t("dashboard.funnelEmpty")}
          />
        </section>

        <section className="st-panel">
          <div className="st-panel-head">
            <div>
              <h2>{t("dashboard.sourcesTitle")}</h2>
              <p>{t("dashboard.sourcesSub")}</p>
            </div>
          </div>
          <BreakdownChart
            items={countBy(leads, "source", locale)}
            emptyLabel={t("dashboard.sourcesEmpty")}
          />
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
            hint={healthHint}
          />
          <Link href={studioPath("/catalog")} className="st-panel-link">
            {t("dashboard.checkContent")} <ArrowRight size={15} />
          </Link>
        </section>

        <section className="st-panel">
          <div className="st-panel-head">
            <div>
              <h2>{t("dashboard.audienceTitle")}</h2>
              <p>{t("dashboard.audienceSub")}</p>
            </div>
          </div>
          <BreakdownChart
            items={countBy(leads, "locale", locale)}
            emptyLabel={t("dashboard.audienceEmpty")}
          />
        </section>

        <section className="st-panel">
          <div className="st-panel-head">
            <div>
              <h2>{t("leads.intent")}</h2>
              <p>{t("dashboard.sourcesSub")}</p>
            </div>
          </div>
          <BreakdownChart
            items={countBy(leads, "intent", locale)}
            emptyLabel={t("dashboard.sourcesEmpty")}
          />
        </section>
      </div>
    </>
  );
}
