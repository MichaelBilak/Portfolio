import Link from "next/link";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { studioPath } from "@/lib/studio/path";
import { BarChart, DonutChart, Sparkline } from "@/components/studio/charts";

const STATUS_LABEL: Record<string, string> = {
  new: "Новые",
  in_progress: "В работе",
  won: "Выиграны",
  lost: "Отказ",
  spam: "Спам",
};

const STATUS_COLOR: Record<string, string> = {
  new: "#d4af37",
  in_progress: "#6b9fd4",
  won: "#6cbc7a",
  lost: "#e05a5a",
  spam: "#7a7368",
};

function lastNDays(n: number) {
  const days: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export default async function StudioDashboardPage() {
  if (!isSupabaseConfigured()) {
    return (
      <>
        <h1 className="st-h1">Обзор</h1>
        <p className="st-sub">Подключите Supabase в переменных окружения, чтобы увидеть аналитику.</p>
      </>
    );
  }

  const sb = createAdminClient();
  const since = new Date();
  since.setDate(since.getDate() - 29);
  since.setHours(0, 0, 0, 0);

  const [{ data: leads }, { data: recent }, projects, services] = await Promise.all([
    sb
      .from("leads")
      .select("id, status, intent, locale, created_at, full_name, business_name, email")
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: true }),
    sb
      .from("leads")
      .select("id, status, full_name, business_name, email, intent, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
    sb.from("projects").select("*", { count: "exact", head: true }),
    sb.from("services").select("*", { count: "exact", head: true }),
  ]);

  const all = leads || [];
  const byStatus: Record<string, number> = {
    new: 0,
    in_progress: 0,
    won: 0,
    lost: 0,
    spam: 0,
  };
  const byIntent: Record<string, number> = { audit: 0, contact: 0, other: 0 };
  const byLocale: Record<string, number> = {};
  const dayKeys = lastNDays(14);
  const byDay: Record<string, number> = Object.fromEntries(dayKeys.map((d) => [d, 0]));

  for (const lead of all) {
    const st = lead.status || "new";
    byStatus[st] = (byStatus[st] || 0) + 1;
    const intent = lead.intent === "audit" || lead.intent === "contact" ? lead.intent : "other";
    byIntent[intent] += 1;
    const loc = (lead.locale || "?").toUpperCase();
    byLocale[loc] = (byLocale[loc] || 0) + 1;
    const day = String(lead.created_at).slice(0, 10);
    if (day in byDay) byDay[day] += 1;
  }

  // Also count totals beyond 30d window for KPI cards
  const [{ count: totalLeads }, { count: newCount }, { count: wonCount }] = await Promise.all([
    sb.from("leads").select("*", { count: "exact", head: true }),
    sb.from("leads").select("*", { count: "exact", head: true }).eq("status", "new"),
    sb.from("leads").select("*", { count: "exact", head: true }).eq("status", "won"),
  ]);

  const closed = (byStatus.won || 0) + (byStatus.lost || 0);
  const winRate = closed > 0 ? Math.round(((byStatus.won || 0) / closed) * 100) : 0;
  const sparkValues = dayKeys.map((d) => byDay[d] || 0);
  const statusItems = Object.entries(byStatus)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({
      label: STATUS_LABEL[k] || k,
      value: v,
      color: STATUS_COLOR[k] || "#d4af37",
    }));

  const localeItems = Object.entries(byLocale)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, value]) => ({ label, value }));

  const intentItems = [
    { label: "Аудит", value: byIntent.audit, color: "#d4af37" },
    { label: "Контакт", value: byIntent.contact, color: "#6b9fd4" },
    { label: "Другое", value: byIntent.other, color: "#7a7368" },
  ].filter((i) => i.value > 0);

  return (
    <>
      <div className="st-page-head">
        <div>
          <h1 className="st-h1">Обзор</h1>
          <p className="st-sub">Заявки, конверсия и активность за последние 30 дней.</p>
        </div>
        <Link className="st-btn primary" href={studioPath("/leads")}>
          Открыть заявки
        </Link>
      </div>

      <div className="st-cards st-cards-kpi">
        <div className="st-card">
          <span>Новые заявки</span>
          <strong>{newCount ?? 0}</strong>
        </div>
        <div className="st-card">
          <span>Всего заявок</span>
          <strong>{totalLeads ?? 0}</strong>
        </div>
        <div className="st-card">
          <span>Win rate (30д)</span>
          <strong>{winRate}%</strong>
        </div>
        <div className="st-card">
          <span>Услуг / проектов</span>
          <strong>
            {services.count ?? 0} / {projects.count ?? 0}
          </strong>
        </div>
      </div>

      <div className="st-grid-2">
        <section className="st-panel">
          <h2 className="st-h2">Заявки за 14 дней</h2>
          <Sparkline values={sparkValues} />
          <div className="st-muted-row">
            {dayKeys.filter((_, i) => i % 3 === 0 || i === dayKeys.length - 1).map((d) => (
              <span key={d}>{d.slice(5)}</span>
            ))}
          </div>
        </section>

        <section className="st-panel">
          <h2 className="st-h2">Статусы (30 дней)</h2>
          {statusItems.length ? (
            <DonutChart items={statusItems} />
          ) : (
            <p className="st-empty">Пока нет заявок за период.</p>
          )}
        </section>
      </div>

      <div className="st-grid-2" style={{ marginTop: "1rem" }}>
        <section className="st-panel">
          <h2 className="st-h2">Тип запроса</h2>
          {intentItems.length ? (
            <BarChart items={intentItems} />
          ) : (
            <p className="st-empty">Нет данных.</p>
          )}
        </section>
        <section className="st-panel">
          <h2 className="st-h2">Язык формы</h2>
          {localeItems.length ? (
            <BarChart
              items={localeItems.map((i, idx) => ({
                ...i,
                color: ["#d4af37", "#c4a35a", "#8f7a3a", "#6b9fd4", "#6cbc7a", "#a8892a"][idx % 6],
              }))}
            />
          ) : (
            <p className="st-empty">Нет данных.</p>
          )}
        </section>
      </div>

      <section className="st-panel" style={{ marginTop: "1rem" }}>
        <div className="st-page-head" style={{ marginBottom: "0.75rem" }}>
          <h2 className="st-h2" style={{ margin: 0 }}>
            Последние заявки
          </h2>
          <Link href={studioPath("/leads")}>Все →</Link>
        </div>
        {(recent || []).length === 0 ? (
          <p className="st-empty">Заявок ещё нет — они появятся из формы на сайте.</p>
        ) : (
          <table className="st-table">
            <thead>
              <tr>
                <th>Когда</th>
                <th>Клиент</th>
                <th>Тип</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {(recent || []).map((lead) => (
                <tr key={lead.id}>
                  <td>{new Date(lead.created_at).toLocaleString("ru-RU")}</td>
                  <td>
                    <Link href={studioPath(`/leads/${lead.id}`)}>
                      {lead.full_name || lead.email || "Без имени"}
                    </Link>
                    <div className="st-table-sub">{lead.business_name}</div>
                  </td>
                  <td>{lead.intent === "audit" ? "Аудит" : "Контакт"}</td>
                  <td>
                    <span className="st-badge">{STATUS_LABEL[lead.status] || lead.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="st-quick" style={{ marginTop: "1.25rem" }}>
        <Link href={studioPath("/content")} className="st-quick-card">
          <strong>Контент сайта</strong>
          <span>Услуги, портфолио, тексты</span>
        </Link>
        <Link href={studioPath("/media")} className="st-quick-card">
          <strong>Медиа</strong>
          <span>Картинки и файлы</span>
        </Link>
        <Link href={studioPath("/settings")} className="st-quick-card">
          <strong>Настройки</strong>
          <span>Бренд, SEO, доступы</span>
        </Link>
      </section>
    </>
  );
}
