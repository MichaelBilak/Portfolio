import { createAdminClient } from "@/lib/supabase/admin";
import { UsersManager } from "@/components/studio/users-manager";

export default async function UsersAdminPage() {
  const sb = createAdminClient();
  const { data: profiles } = await sb.from("profiles").select("id, name, role, created_at").order("created_at");

  // Enrich with emails via auth admin API
  const { data: list } = await sb.auth.admin.listUsers({ perPage: 200 });
  const emailById = new Map((list?.users || []).map((u) => [u.id, u.email || ""]));

  const rows = (profiles || []).map((p) => ({
    ...p,
    email: emailById.get(p.id) || "",
  }));

  return (
    <>
      <h1 className="st-h1">Команда</h1>
      <p className="st-sub">Кто может заходить в панель.</p>
      <UsersManager initial={rows} />
    </>
  );
}
