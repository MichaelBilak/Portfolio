import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Inbox, TrendingUp, Trophy, UsersRound } from "lucide-react";
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
import {
  BreakdownChart,
  ContentHealth,
  LeadsTrendChart,
} from "@/components/studio/analytics-charts";

type LeadRow = {
  status: string;
  source: string | null;
  locale: string | null;
  created_at: string;
};

const TIMELINES = [7, 14, 30, 90] as const;
type TimelineDays = (typeof TIMELINES)[number];

function countBy(
  rows: LeadRow[],
  key: "status" | "source" | "locale",
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
  searchParams: Promise<{ days?: string }>;
}) {
  const user = await getStudioSession();
  if (!user || !canManageLeads(user.role)) redirect(studioPath("/cases"));

  const locale = resolveStudioLocale(user.adminLocale);
  const t = createStudioTranslator(locale);

  const params = await searchParams;
  const requestedDays = Number(params.days);
  const days: TimelineDays = TIMELINES.includes(requestedDays as TimelineDays)
    ? (requestedDays as TimelineDays)
    : 14;

  if (!isSupabaseConfigured()) {
    return (
      <>
        <h1 className="st-h1">{t("dashboard.title")}</h1>
        <p className="st-sub">{t("dashboard.missingEnv")}</p>
      </>
    );
  }

  const sb = createAdminClient();
  const since = new Date();
  since.setDate(since.getDate() - days * 2);
  const [
    leadsResult,
    projectCount,
    serviceCount,
    projectTranslations,
    serviceTranslations,
  ] = await Promise.all([
    sb
      .from("leads")
      .select("status, source, locale, created_at")
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: true })
      .limit(1000),
    sb.from("projects").select("*", { count: "exact", head: true }),
    sb.from("services").select("*", { count: "exact", head: true }),
    sb.from("project_i18n").select("*", { count: "exact", head: true }),
    sb.from("service_i18n").select("*", { count: "exact", head: true }),
  ]);
  const allLeads = (leadsResult.data || []) as LeadRow[];
  const periodBoundary = new Date();
  periodBoundary.setDate(periodBoundary.getDate() - days);
  const leads = allLeads.filter(
    (lead) => new Date(lead.created_at) >= periodBoundary,
  );
  const previousLeads = allLeads.filter((lead) => {
    const created = new Date(lead.created_at);
    return created < periodBoundary && created >= since;
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

  const dateLocale = studioDateLocale(locale);
  const trend = Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (days - 1 - index));
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

  return (
    <>
      <div className="st-page-header">
        <div>
          <p className="st-eyebrow">{t("dashboard.eyebrow")}</p>
          <h1 className="st-h1">{t("dashboard.title")}</h1>
          <p className="st-sub">{t("dashboard.subtitle", { days })}</p>
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
            <em>{t("dashboard.conversion", { value: conversion })}</em>
          </div>
        </div>
        <div className="st-metric">
          <span className="st-metric-icon"><TrendingUp size={18} /></span>
          <div>
            <small>{t("dashboard.siteContent")}</small>
            <strong>{(projectCount.count || 0) + (serviceCount.count || 0)}</strong>
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
              <p>{t("dashboard.trendSub", { days })}</p>
            </div>
            <div className="st-panel-actions">
              <span className="st-panel-total">{t("dashboard.leadsCount", { count: recentCount })}</span>
              <nav className="st-timeline" aria-label={t("dashboard.timelineAria")}>
                {TIMELINES.map((value) => (
                  <Link
                    key={value}
                    href={`${studioPath()}?days=${value}`}
                    className={value === days ? "active" : undefined}
                    aria-current={value === days ? "page" : undefined}
                    scroll={false}
                  >
                    {t("dashboard.daysShort", { days: value })}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          <LeadsTrendChart
            points={trend}
            ariaLabel={t("dashboard.chartAria", { days })}
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
            items={countBy(leads, "status", locale)}
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
      </div>
    </>
  );
}
