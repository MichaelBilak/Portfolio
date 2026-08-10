import Link from "next/link";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { studioPath } from "@/lib/studio/path";

export default async function StudioDashboardPage() {
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
  const [newLeads, progressLeads, projects, services, media] = await Promise.all([
    sb.from("leads").select("*", { count: "exact", head: true }).eq("status", "new"),
    sb.from("leads").select("*", { count: "exact", head: true }).eq("status", "in_progress"),
    sb.from("projects").select("*", { count: "exact", head: true }),
    sb.from("services").select("*", { count: "exact", head: true }),
    sb.from("media").select("*", { count: "exact", head: true }),
  ]);

  return (
    <>
      <h1 className="st-h1">Dashboard</h1>
      <p className="st-sub">Overview of leads and catalog.</p>
      <div className="st-cards">
        <div className="st-card">
          <strong>{newLeads.count ?? 0}</strong>
          <span>New leads</span>
        </div>
        <div className="st-card">
          <strong>{progressLeads.count ?? 0}</strong>
          <span>In progress</span>
        </div>
        <div className="st-card">
          <strong>{projects.count ?? 0}</strong>
          <span>Projects</span>
        </div>
        <div className="st-card">
          <strong>{services.count ?? 0}</strong>
          <span>Services</span>
        </div>
        <div className="st-card">
          <strong>{media.count ?? 0}</strong>
          <span>Media files</span>
        </div>
      </div>
      <div className="st-row">
        <Link className="st-btn primary" href={studioPath("/leads")}>
          Open leads
        </Link>
        <Link className="st-btn" href={studioPath("/copy")}>
          Edit site copy
        </Link>
        <Link className="st-btn" href={studioPath("/services")}>
          Edit services
        </Link>
      </div>
    </>
  );
}
