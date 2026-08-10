import { createAdminClient } from "@/lib/supabase/admin";
import { JsonResourceEditor } from "@/components/studio/json-resource-editor";

export default async function SettingsAdminPage() {
  const sb = createAdminClient();
  const { data } = await sb.from("site_settings").select("*").eq("id", 1).maybeSingle();
  return (
    <>
      <h1 className="st-h1">Settings</h1>
      <p className="st-sub">Brand name, contact, social links.</p>
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
