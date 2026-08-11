import { createAdminClient } from "@/lib/supabase/admin";
import { RedirectsManager } from "@/components/studio/redirects-manager";
import { getStudioSession } from "@/lib/studio/auth";
import { createStudioTranslator, resolveStudioLocale } from "@/lib/studio/i18n/messages";

export default async function RedirectsAdminPage() {
  const user = await getStudioSession();
  const locale = resolveStudioLocale(user?.adminLocale);
  const t = createStudioTranslator(locale);

  const sb = createAdminClient();
  const { data } = await sb.from("redirects").select("*").order("from_path");
  return (
    <>
      <h1 className="st-h1">{t("content.redirectsTitle")}</h1>
      <p className="st-sub">{t("content.redirectsSub")}</p>
      <RedirectsManager initial={data || []} />
    </>
  );
}
