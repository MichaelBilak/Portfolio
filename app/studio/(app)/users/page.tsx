import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { UsersManager } from "@/components/studio/users-manager";
import { canManageUsers, getStudioSession } from "@/lib/studio/auth";
import { createStudioTranslator, resolveStudioLocale } from "@/lib/studio/i18n/messages";

export default async function UsersAdminPage() {
  const user = await getStudioSession();
  if (!user || !canManageUsers(user.role)) notFound();

  const locale = resolveStudioLocale(user.adminLocale);
  const t = createStudioTranslator(locale);

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
      <h1 className="st-h1">{t("users.title")}</h1>
      <p className="st-sub">{t("users.subtitle")}</p>
      <UsersManager initial={rows} />
    </>
  );
}
