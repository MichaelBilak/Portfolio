import { createAdminClient } from "@/lib/supabase/admin";
import { JsonResourceEditor } from "@/components/studio/json-resource-editor";
import { getStudioSession } from "@/lib/studio/auth";
import { createStudioTranslator, resolveStudioLocale } from "@/lib/studio/i18n/messages";

export default async function SettingsAdminPage() {
  const user = await getStudioSession();
  const locale = resolveStudioLocale(user?.adminLocale);
  const t = createStudioTranslator(locale);

  const sb = createAdminClient();
  const { data } = await sb.from("site_settings").select("*").eq("id", 1).maybeSingle();
  return (
    <>
      <h1 className="st-h1">{t("content.settingsTitle")}</h1>
      <p className="st-sub">{t("content.settingsSub")}</p>
      <JsonResourceEditor
        endpoint="/api/studio/settings"
        initial={
          data || {
            id: 1,
            brand_name: "DormUp Studio",
            brand_tagline: "digital studio",
            site_url: "",
            contact_email: "",
            instagram_url: "",
            instagram_bio_link: "",
          }
        }
      />
    </>
  );
}
