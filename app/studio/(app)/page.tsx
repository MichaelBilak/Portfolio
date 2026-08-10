import Link from "next/link";
import { ArrowRight, Inbox, TrendingUp, Trophy, UsersRound } from "lucide-react";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
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

function titleCase(value: string) {
  const labels: Record<string, string> = {
    new: "Новые",
    in_progress: "В работе",
    won: "Выиграны",
    lost: "Отказ",
    spam: "Спам",
    unknown: "Не указано",
    it: "Итальянский",
    en: "Английский",
    fr: "Французский",
    ru: "Русский",
    de: "Немецкий",
    es: "Испанский",
  };
  return labels[value] || value.replace(/_/g, " ");
}

function countBy(rows: LeadRow[], key: "status" | "source" | "locale") {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const value = row[key] || "unknown";
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, value]) => ({ label: titleCase(label), value }))
    .sort((a, b) => b.value - a.value);
}

export default async function StudioDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const params = await searchParams;
  const requestedDays = Number(params.days);
  const days: TimelineDays = TIMELINES.includes(requestedDays as TimelineDays)
    ? (requestedDays as TimelineDays)
    : 14;

  if (!isSupabaseConfigured()) {
    return (
      <>
        <h1 className="st-h1">Dashboard</h1>
        <p className="st-sub">
          Supabase env vars are missing. Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
          and SUPABASE_SERVICE_ROLE_KEY, then apply <code>supabase/migrations/001_studio.sql</code>.
        </p>
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

  const trend = Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (days - 1 - index));
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    return {
      label: date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" }),
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

  return (
    <>
      <div className="st-page-header">
        <div>
          <p className="st-eyebrow">Обзор бизнеса</p>
          <h1 className="st-h1">Добрый день</h1>
          <p className="st-sub">Главные показатели за последние {days} дней.</p>
        </div>
        <Link className="st-btn primary" href={studioPath("/leads")}>
          <Inbox size={16} /> Открыть заявки
        </Link>
      </div>

      <div className="st-metrics">
        <div className="st-metric">
          <span className="st-metric-icon"><UsersRound size={18} /></span>
          <div>
            <small>Всего заявок</small>
            <strong>{leads.length}</strong>
            <em className={growth >= 0 ? "positive" : "negative"}>
              {growth >= 0 ? "+" : ""}{growth}% к прошлому периоду
            </em>
          </div>
        </div>
        <div className="st-metric">
          <span className="st-metric-icon"><Inbox size={18} /></span>
          <div>
            <small>Требуют внимания</small>
            <strong>{newCount}</strong>
            <em>{activeCount} сейчас в работе</em>
          </div>
        </div>
        <div className="st-metric">
          <span className="st-metric-icon"><Trophy size={18} /></span>
          <div>
            <small>Выиграны</small>
            <strong>{wonCount}</strong>
            <em>конверсия {conversion}%</em>
          </div>
        </div>
        <div className="st-metric">
          <span className="st-metric-icon"><TrendingUp size={18} /></span>
          <div>
            <small>Контент сайта</small>
            <strong>{(projectCount.count || 0) + (serviceCount.count || 0)}</strong>
            <em>{projectCount.count || 0} проектов · {serviceCount.count || 0} услуг</em>
          </div>
        </div>
      </div>

      <div className="st-dashboard-grid">
        <section className="st-panel st-panel-wide">
          <div className="st-panel-head">
            <div>
              <h2>Динамика заявок</h2>
              <p>Новые обращения за последние {days} дней</p>
            </div>
            <div className="st-panel-actions">
              <span className="st-panel-total">{recentCount} заявок</span>
              <nav className="st-timeline" aria-label="Период графика">
                {TIMELINES.map((value) => (
                  <Link
                    key={value}
                    href={`${studioPath()}?days=${value}`}
                    className={value === days ? "active" : undefined}
                    aria-current={value === days ? "page" : undefined}
                    scroll={false}
                  >
                    {value}д
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          <LeadsTrendChart points={trend} />
        </section>

        <section className="st-panel">
          <div className="st-panel-head">
            <div>
              <h2>Воронка продаж</h2>
              <p>Текущий статус всех возможностей</p>
            </div>
          </div>
          <BreakdownChart items={countBy(leads, "status")} emptyLabel="Заявок пока нет" />
        </section>

        <section className="st-panel">
          <div className="st-panel-head">
            <div>
              <h2>Источники заявок</h2>
              <p>Откуда клиенты узнают о студии</p>
            </div>
          </div>
          <BreakdownChart items={countBy(leads, "source")} emptyLabel="Данные об источниках появятся здесь" />
        </section>

        <section className="st-panel">
          <div className="st-panel-head">
            <div>
              <h2>Состояние сайта</h2>
              <p>Готовность переводов каталога</p>
            </div>
          </div>
          <ContentHealth value={contentHealth} label="Переводы" />
          <Link href={studioPath("/catalog")} className="st-panel-link">
            Проверить контент <ArrowRight size={15} />
          </Link>
        </section>

        <section className="st-panel">
          <div className="st-panel-head">
            <div>
              <h2>Языки аудитории</h2>
              <p>Язык входящих обращений</p>
            </div>
          </div>
          <BreakdownChart items={countBy(leads, "locale")} emptyLabel="Данные о языках появятся здесь" />
        </section>
      </div>
    </>
  );
}
