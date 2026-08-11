import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { LeadActions } from "@/components/studio/lead-actions";
import { canManageLeads, getStudioSession } from "@/lib/studio/auth";
import {
  createStudioTranslator,
  formatStudioDate,
  resolveStudioLocale,
} from "@/lib/studio/i18n/messages";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getStudioSession();
  if (!user || !canManageLeads(user.role)) notFound();

  const locale = resolveStudioLocale(user.adminLocale);
  const t = createStudioTranslator(locale);

  const { id } = await params;
  const sb = createAdminClient();
  const { data: lead } = await sb.from("leads").select("*").eq("id", id).maybeSingle();
  if (!lead) notFound();

  const [{ data: notes }, { data: linkedCase }] = await Promise.all([
    sb
      .from("lead_notes")
      .select("*")
      .eq("lead_id", id)
      .order("created_at", { ascending: false }),
    sb.from("cases").select("id").eq("lead_id", id).maybeSingle(),
  ]);

  return (
    <>
      <h1 className="st-h1">{lead.full_name || t("leads.fallbackTitle")}</h1>
      <p className="st-sub">
        {lead.email} · {lead.business_name} · {lead.intent}
      </p>
      <LeadActions
        leadId={lead.id}
        status={lead.status}
        priority={lead.priority}
        existingCaseId={linkedCase?.id}
      />
      <div className="st-card" style={{ marginTop: "1.25rem" }}>
        <p>
          <strong>{t("leads.brief")}</strong>
        </p>
        <p style={{ whiteSpace: "pre-wrap" }}>{lead.brief}</p>
        <p style={{ color: "var(--st-muted)", fontSize: "0.85rem" }}>
          {t("leads.services")}: {(lead.selected_services || []).join(", ") || "—"}
          <br />
          {t("leads.addons")}: {(lead.selected_addons || []).join(", ") || "—"}
          <br />
          {t("leads.source")}: {lead.source} · {t("leads.locale")}: {lead.locale}
          <br />
          {t("leads.site")}: {lead.site_url || "—"}
        </p>
      </div>
      <h2 style={{ marginTop: "1.5rem", fontSize: "1.1rem" }}>{t("leads.notes")}</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {(notes || []).map((n) => (
          <li key={n.id} className="st-card" style={{ marginBottom: "0.5rem" }}>
            <div style={{ color: "var(--st-muted)", fontSize: "0.8rem" }}>
              {formatStudioDate(n.created_at, locale, true)}
            </div>
            <div style={{ whiteSpace: "pre-wrap" }}>{n.body}</div>
          </li>
        ))}
      </ul>
    </>
  );
}
