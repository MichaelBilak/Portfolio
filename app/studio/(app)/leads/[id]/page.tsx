import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { LeadActions } from "@/components/studio/lead-actions";
import { canManageLeads, getStudioSession } from "@/lib/studio/auth";
import {
  createStudioTranslator,
  formatStudioDate,
  labelPriority,
  labelStatus,
  resolveStudioLocale,
  type StudioMessageKey,
} from "@/lib/studio/i18n/messages";
import { studioPath } from "@/lib/studio/path";

type TimelineItem = {
  id: string;
  kind: "event" | "note";
  at: string;
  title: string;
  body?: string;
};

function eventLabel(
  t: ReturnType<typeof createStudioTranslator>,
  eventType: string,
) {
  const map: Record<string, StudioMessageKey> = {
    created: "leads.event.created",
    status_changed: "leads.event.status_changed",
    priority_changed: "leads.event.priority_changed",
    assigned: "leads.event.assigned",
    note_added: "leads.event.note_added",
    imported: "leads.event.imported",
    converted: "leads.event.converted",
    gdpr_export: "leads.event.gdpr_export",
    gdpr_delete: "leads.event.gdpr_delete",
    next_action_set: "leads.event.next_action_set",
  };
  const key = map[eventType];
  return key ? t(key) : eventType.replaceAll("_", " ");
}

function formatEventBody(payload: unknown) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return "";
  const row = payload as Record<string, unknown>;
  const parts: string[] = [];
  if (row.from != null || row.to != null) {
    parts.push(`${String(row.from ?? "—")} → ${String(row.to ?? "—")}`);
  }
  if (typeof row.preview === "string") parts.push(row.preview);
  if (typeof row.nextActionAt === "string") parts.push(row.nextActionAt);
  if (typeof row.caseId === "string") parts.push(`case ${row.caseId.slice(0, 8)}`);
  return parts.join(" · ");
}

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
    { data: assignee },
    { data: activities },
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
    lead.assignee_id
      ? sb.from("profiles").select("id, name").eq("id", lead.assignee_id).maybeSingle()
      : Promise.resolve({ data: null }),
    sb.from("activities").select("*").eq("lead_id", id).order("occurred_at", { ascending: false }),
  ]);

  const slaBreached =
    lead.next_action_at && new Date(lead.next_action_at).getTime() < Date.now();

  const timeline: TimelineItem[] = [
    ...(events || []).map((event) => ({
      id: `e-${event.id}`,
      kind: "event" as const,
      at: event.created_at as string,
      title: eventLabel(t, String(event.event_type)),
      body: formatEventBody(event.payload),
    })),
    ...(notes || []).map((note) => ({
      id: `n-${note.id}`,
      kind: "note" as const,
      at: note.created_at as string,
      title: t("leads.notes"),
      body: note.body as string,
    })),
    ...(activities || []).map((activity) => ({
      id: `a-${activity.id}`,
      kind: "event" as const,
      at: activity.occurred_at as string,
      title: `${activity.channel || activity.activity_type}: ${activity.subject}`,
      body: activity.body || "",
    })),
  ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  const metaRows = [
    { label: t("leads.email"), value: lead.email },
    { label: t("leads.business"), value: lead.business_name },
    { label: t("leads.source"), value: lead.source },
    { label: t("leads.intent"), value: lead.intent },
    { label: t("leads.locale"), value: lead.locale },
    {
      label: t("leads.site"),
      value: lead.site_url,
      href: lead.site_url || undefined,
    },
    {
      label: t("crm.assignee"),
      value: assignee?.name || t("leads.unassigned"),
    },
    {
      label: t("leads.firstResponse"),
      value: lead.first_responded_at
        ? formatStudioDate(lead.first_responded_at, locale, true)
        : "—",
    },
    {
      label: t("leads.nextAction"),
      value: lead.next_action_at
        ? formatStudioDate(lead.next_action_at, locale, true)
        : "—",
    },
    {
      label: t("leads.services"),
      value: (lead.selected_services || []).join(", ") || "—",
    },
    {
      label: t("leads.addons"),
      value: (lead.selected_addons || []).join(", ") || "—",
    },
  ];
  const analysisRows = [
    { label: "Lead score", value: lead.lead_score != null ? `${lead.lead_score}/10` : "—" },
    { label: "Pain", value: lead.pain_score != null ? `${lead.pain_score}/10` : "—" },
    { label: "Ability to pay", value: lead.ability_to_pay != null ? `${lead.ability_to_pay}/10` : "—" },
    { label: "Willingness to pay", value: lead.willingness_to_pay != null ? `${lead.willingness_to_pay}/10` : "—" },
    { label: "Urgency", value: lead.urgency_score != null ? `${lead.urgency_score}/10` : "—" },
    { label: "Reachability", value: lead.reachability_score != null ? `${lead.reachability_score}/10` : "—" },
    { label: "Digital maturity", value: lead.digital_maturity != null ? `${lead.digital_maturity}/10` : "—" },
    { label: "Estimated size", value: lead.estimated_employees || "—" },
    { label: "Estimated revenue", value: lead.estimated_revenue ? `€${Number(lead.estimated_revenue).toLocaleString()}` : "—" },
    { label: "Potential value", value: lead.estimated_deal_value ? `€${Number(lead.estimated_deal_value).toLocaleString()}` : "—" },
    { label: "Recommended offer", value: lead.recommended_offer || "—" },
    { label: "Possible pain", value: lead.possible_pain || "—" },
  ];

  return (
    <div className="st-lead-detail">
      <div className="st-lead-detail-top">
        <Link href={studioPath("/leads")} className="st-lead-back">
          <ArrowLeft size={16} /> {t("leads.title")}
        </Link>
        <div className="st-lead-detail-heading">
          <div>
            <h1 className="st-h1">{lead.business_name || lead.full_name || t("leads.fallbackTitle")}</h1>
            <p className="st-sub">
              {lead.business_name || lead.email || "—"}
              {lead.created_at
                ? ` · ${formatStudioDate(lead.created_at, locale, true)}`
                : ""}
            </p>
          </div>
          <div className="st-lead-detail-badges">
            <span className={`st-status st-status-${lead.status.replaceAll("_", "-")}`}>
              {labelStatus(locale, lead.status)}
            </span>
            <span className={`st-status st-status-${lead.priority}`}>
              {labelPriority(locale, lead.priority)}
            </span>
            <span className="st-badge">Score {lead.lead_score ?? "—"}/10</span>
            {slaBreached ? (
              <span className="st-badge st-badge-danger">{t("leads.slaBreached")}</span>
            ) : null}
            {lead.converted_deal_id ? (
              <Link className="st-btn primary" href={studioPath(`/deals/${lead.converted_deal_id}`)}>
                {t("leads.openDeal")}
              </Link>
            ) : linkedCase ? (
              <Link className="st-btn" href={studioPath(`/cases/${linkedCase.id}`)}>
                {t("leads.openCase")}
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      <div className="st-lead-detail-grid">
        <div className="st-lead-detail-main">
          <section className="st-panel st-lead-brief">
            <h2>{t("leads.brief")}</h2>
            <p className="st-lead-brief-body">{lead.brief || "—"}</p>
          </section>

          <section className="st-panel">
            <h2>{t("leads.details")}</h2>
            <dl className="st-lead-meta-grid">
              {metaRows.map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>
                    {row.href && row.value ? (
                      <a href={row.href} target="_blank" rel="noreferrer">
                        {row.value}
                      </a>
                    ) : (
                      row.value || "—"
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="st-panel">
            <h2>Business analysis</h2>
            <dl className="st-lead-meta-grid">
              {analysisRows.map((row) => <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}
            </dl>
          </section>

          <section className="st-panel">
            <h2>{t("leads.timeline")}</h2>
            {!timeline.length ? (
              <p className="st-muted">{t("leads.timelineEmpty")}</p>
            ) : (
              <ol className="st-lead-timeline">
                {timeline.map((item) => (
                  <li key={item.id} className={item.kind}>
                    <div className="st-lead-timeline-dot" aria-hidden />
                    <div>
                      <div className="st-lead-timeline-head">
                        <strong>{item.title}</strong>
                        <time>{formatStudioDate(item.at, locale, true)}</time>
                      </div>
                      {item.body ? <p>{item.body}</p> : null}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        <aside className="st-lead-detail-side">
          <section className="st-panel st-lead-actions-panel">
            <h2>{t("leads.actionsTitle")}</h2>
            <LeadActions
              leadId={lead.id}
              status={lead.status}
              priority={lead.priority}
              assigneeId={lead.assignee_id}
              nextActionAt={lead.next_follow_up_at || lead.next_action_at}
              lostReason={lead.lost_reason}
              existingDealId={lead.converted_deal_id}
              currentUserId={user.id}
              users={(users || []).map((profile) => ({
                id: profile.id,
                name: profile.name,
              }))}
            />
          </section>
        </aside>
      </div>
    </div>
  );
}
