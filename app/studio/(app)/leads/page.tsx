import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { studioPath } from "@/lib/studio/path";

const STATUS_LABEL: Record<string, string> = {
  new: "Новая",
  in_progress: "В работе",
  won: "Выиграна",
  lost: "Отказ",
  spam: "Спам",
};

export default async function LeadsListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const sb = createAdminClient();
  let query = sb
    .from("leads")
    .select("id, full_name, email, business_name, status, priority, locale, intent, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (sp.status) query = query.eq("status", sp.status);
  if (sp.q) query = query.or(`email.ilike.%${sp.q}%,full_name.ilike.%${sp.q}%,business_name.ilike.%${sp.q}%`);

  const { data: leads } = await query;

  return (
    <>
      <h1 className="st-h1">Заявки</h1>
      <p className="st-sub">Входящие обращения с формы на сайте.</p>
      <form className="st-row" style={{ marginBottom: "1rem" }}>
        <select className="st-select" name="status" defaultValue={sp.status || ""} style={{ width: 160 }}>
          <option value="">Все статусы</option>
          <option value="new">Новые</option>
          <option value="in_progress">В работе</option>
          <option value="won">Выиграны</option>
          <option value="lost">Отказ</option>
          <option value="spam">Спам</option>
        </select>
        <input className="st-input" name="q" placeholder="Поиск по имени или email…" defaultValue={sp.q || ""} style={{ width: 240 }} />
        <button className="st-btn" type="submit">
          Найти
        </button>
      </form>
      <table className="st-table">
        <thead>
          <tr>
            <th>Дата</th>
            <th>Клиент</th>
            <th>Бизнес</th>
            <th>Статус</th>
            <th>Язык</th>
          </tr>
        </thead>
        <tbody>
          {(leads || []).map((lead) => (
            <tr key={lead.id}>
              <td>{new Date(lead.created_at).toLocaleString("ru-RU")}</td>
              <td>
                <Link href={studioPath(`/leads/${lead.id}`)}>{lead.full_name || lead.email}</Link>
              </td>
              <td>{lead.business_name}</td>
              <td>
                <span className="st-badge">{STATUS_LABEL[lead.status] || lead.status}</span>
              </td>
              <td>{lead.locale}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
