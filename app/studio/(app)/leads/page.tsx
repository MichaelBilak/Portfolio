import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { studioPath } from "@/lib/studio/path";

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
      <h1 className="st-h1">Leads</h1>
      <p className="st-sub">CRM inbox from the contact form.</p>
      <form className="st-row" style={{ marginBottom: "1rem" }}>
        <select className="st-select" name="status" defaultValue={sp.status || ""} style={{ width: 160 }}>
          <option value="">All statuses</option>
          <option value="new">new</option>
          <option value="in_progress">in_progress</option>
          <option value="won">won</option>
          <option value="lost">lost</option>
          <option value="spam">spam</option>
        </select>
        <input className="st-input" name="q" placeholder="Search…" defaultValue={sp.q || ""} style={{ width: 220 }} />
        <button className="st-btn" type="submit">
          Filter
        </button>
      </form>
      <table className="st-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Business</th>
            <th>Status</th>
            <th>Locale</th>
          </tr>
        </thead>
        <tbody>
          {(leads || []).map((lead) => (
            <tr key={lead.id}>
              <td>{new Date(lead.created_at).toLocaleString()}</td>
              <td>
                <Link href={studioPath(`/leads/${lead.id}`)}>{lead.full_name || lead.email}</Link>
              </td>
              <td>{lead.business_name}</td>
              <td>
                <span className="st-badge">{lead.status}</span>
              </td>
              <td>{lead.locale}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
