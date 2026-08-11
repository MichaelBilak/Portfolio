import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { LeadActions } from "@/components/studio/lead-actions";
import { canManageLeads, getStudioSession } from "@/lib/studio/auth";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getStudioSession();
  if (!user || !canManageLeads(user.role)) notFound();

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
      <h1 className="st-h1">{lead.full_name || "Lead"}</h1>
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
          <strong>Brief</strong>
        </p>
        <p style={{ whiteSpace: "pre-wrap" }}>{lead.brief}</p>
        <p style={{ color: "var(--st-muted)", fontSize: "0.85rem" }}>
          Services: {(lead.selected_services || []).join(", ") || "—"}
          <br />
          Addons: {(lead.selected_addons || []).join(", ") || "—"}
          <br />
          Source: {lead.source} · Locale: {lead.locale}
          <br />
          Site: {lead.site_url || "—"}
        </p>
      </div>
      <h2 style={{ marginTop: "1.5rem", fontSize: "1.1rem" }}>Notes</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {(notes || []).map((n) => (
          <li key={n.id} className="st-card" style={{ marginBottom: "0.5rem" }}>
            <div style={{ color: "var(--st-muted)", fontSize: "0.8rem" }}>
              {new Date(n.created_at).toLocaleString()}
            </div>
            <div style={{ whiteSpace: "pre-wrap" }}>{n.body}</div>
          </li>
        ))}
      </ul>
    </>
  );
}
