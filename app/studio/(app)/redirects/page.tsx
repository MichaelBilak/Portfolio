import { createAdminClient } from "@/lib/supabase/admin";
import { RedirectsManager } from "@/components/studio/redirects-manager";

export default async function RedirectsAdminPage() {
  const sb = createAdminClient();
  const { data } = await sb.from("redirects").select("*").order("from_path");
  return (
    <>
      <h1 className="st-h1">Редиректы</h1>
      <p className="st-sub">Перенаправление старых адресов на новые.</p>
      <RedirectsManager initial={data || []} />
    </>
  );
}
