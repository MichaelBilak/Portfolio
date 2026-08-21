import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { LeadActions } from "@/components/studio/lead-actions";
import { canManageLeads, getStudioSession } from "@/lib/studio/auth";
import {
  createStudioTranslator,
  formatStudioDate,
  labelStatus,
  resolveStudioLocale,
} from "@/lib/studio/i18n/messages";
import { studioPath } from "@/lib/studio/path";

type TimelineItem = {
  id: string;
  kind: "event" | "note";
  at: string;
  title: string;
  body?: string;
};

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

  const [
    { data: notes },
    { data: events },
    { data: linkedCase },
    { data: users },
    { data: stages },
  ] = await Promise.all([
    sb
      .from("lead_notes")
      .select("*")
      .eq("lead_id", id)
      .order("created_at", { ascending: false }),
    sb
      .from("lead_events")
      .select("*")
      .eq("lead_id", id)
      .order("created_at", { ascending: false }),
    sb.from("cases").select("id, title").eq("lead_id", id).maybeSingle(),
    sb
      .from("profiles")
      .select("id, name")
      .in("role", ["owner", "editor", "manager", "sales"])
      .order("name", { ascending: true }),
    sb
      .from("pipeline_stages")
      .select("id, name, key")
      .order("sort_order", { ascending: true }),
  ]);

  const slaBreached =
    lead.next_action_at && new Date(lead.next_action_at).getTime() < Date.now();

  const timeline: TimelineItem[] = [
    ...(events || []).map((event) => ({
      id: `e-${event.id}`,
      kind: "event" as const,
      at: event.created_at as string,
      title: String(event.event_type),
      body: JSON.stringify(event.payload || {}),
    })),
    ...(notes || []).map((note) => ({
      id: `n-${note.id}`,
      kind: "note" as const,
      at: note.created_at as string,
      title: t("leads.notes"),
      body: note.body as string,
    })),
  ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  return (
    <>
      <div className="st-page-header">
        <div>
          <p className="st-eyebrow">
            <Link href={studioPath("/leads")}>{t("leads.title")}</Link>
          </p>
          <h1 className="st-h1">{lead.full_name || t("leads.fallbackTitle")}</h1>
          <p className="st-sub">
            {lead.email} · {lead.business_name} · {lead.intent}
          </p>
        </div>
        <div className="st-row" style={{ gap: "0.5rem", flexWrap: "wrap" }}>
          <span className="st-badge">{labelStatus(locale, lead.status)}</span>
          {slaBreached ? <span className="st-badge st-badge-danger">{t("leads.slaBreached")}</span> : null}
          {linkedCase ? (
            <Link className="st-btn primary" href={studioPath(`/cases/${linkedCase.id}`)}>
              {t("leads.openCase")}
            </Link>
          ) : null}
        </div>
      </div>

      <LeadActions
        leadId={lead.id}
        status={lead.status}
        priority={lead.priority}
        assigneeId={lead.assignee_id}
        nextActionAt={lead.next_action_at}
        lostReason={lead.lost_reason}
        existingCaseId={linkedCase?.id}
        currentUserId={user.id}
        users={(users || []).map((profile) => ({ id: profile.id, name: profile.name }))}
        stages={(stages || []).map((stage) => ({
          id: stage.id,
          name: stage.name,
          key: stage.key,
        }))}
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
          <br />
          {t("leads.firstResponse")}:{" "}
          {lead.first_responded_at
            ? formatStudioDate(lead.first_responded_at, locale, true)
            : "—"}
          <br />
          {t("leads.nextAction")}:{" "}
          {lead.next_action_at
            ? formatStudioDate(lead.next_action_at, locale, true)
            : "—"}
        </p>
      </div>

      <h2 style={{ marginTop: "1.5rem", fontSize: "1.1rem" }}>{t("leads.timeline")}</h2>
      <ul className="st-lead-timeline">
        {timeline.map((item) => (
          <li key={item.id} className="st-card">
            <div style={{ color: "var(--st-muted)", fontSize: "0.8rem" }}>
              {formatStudioDate(item.at, locale, true)} · {item.title}
            </div>
            {item.body ? (
              <div style={{ whiteSpace: "pre-wrap", marginTop: "0.35rem" }}>{item.body}</div>
            ) : null}
          </li>
        ))}
        {!timeline.length ? <li className="st-muted">{t("leads.timelineEmpty")}</li> : null}
      </ul>
    </>
  );
}
