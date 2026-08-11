import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { canManageLeads, getStudioSession } from "@/lib/studio/auth";
import {
  createStudioTranslator,
  formatStudioDate,
  labelStatus,
  resolveStudioLocale,
} from "@/lib/studio/i18n/messages";
import { studioPath } from "@/lib/studio/path";

export default async function LeadsListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const user = await getStudioSession();
  if (!user || !canManageLeads(user.role)) notFound();

  const locale = resolveStudioLocale(user.adminLocale);
  const t = createStudioTranslator(locale);

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
      <h1 className="st-h1">{t("leads.title")}</h1>
      <p className="st-sub">{t("leads.subtitle")}</p>
      <form className="st-row" style={{ marginBottom: "1rem" }}>
        <select className="st-select" name="status" defaultValue={sp.status || ""} style={{ width: 160 }}>
          <option value="">{t("leads.allStatuses")}</option>
          <option value="new">{labelStatus(locale, "new")}</option>
          <option value="in_progress">{labelStatus(locale, "in_progress")}</option>
          <option value="won">{labelStatus(locale, "won")}</option>
          <option value="lost">{labelStatus(locale, "lost")}</option>
          <option value="spam">{labelStatus(locale, "spam")}</option>
        </select>
        <input
          className="st-input"
          name="q"
          placeholder={t("leads.searchPlaceholder")}
          defaultValue={sp.q || ""}
          style={{ width: 240 }}
        />
        <button className="st-btn" type="submit">
          {t("leads.find")}
        </button>
      </form>
      <table className="st-table">
        <thead>
          <tr>
            <th>{t("leads.date")}</th>
            <th>{t("leads.client")}</th>
            <th>{t("leads.email")}</th>
            <th>{t("leads.business")}</th>
            <th>{t("leads.status")}</th>
            <th>{t("leads.locale")}</th>
            <th aria-label={t("leads.actions")} />
          </tr>
        </thead>
        <tbody>
          {(leads || []).map((lead) => (
            <tr key={lead.id}>
              <td>{formatStudioDate(lead.created_at, locale, true)}</td>
              <td>
                <Link href={studioPath(`/leads/${lead.id}`)}>{lead.full_name || lead.email}</Link>
              </td>
              <td>
                <a href={`mailto:${lead.email}`}>{lead.email}</a>
              </td>
              <td>{lead.business_name}</td>
              <td>
                <span className="st-badge">{labelStatus(locale, lead.status)}</span>
              </td>
              <td>{lead.locale}</td>
              <td>
                <Link
                  className="st-btn subtle"
                  href={studioPath(`/leads/${lead.id}`)}
                >
                  {t("leads.openCase")}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
