import { createAdminClient } from "@/lib/supabase/admin";
import { JsonResourceEditor } from "@/components/studio/json-resource-editor";
import { studioPath } from "@/lib/studio/path";

const LOCALES = ["it", "en", "fr", "ru", "de", "es"] as const;

export default async function SeoAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string }>;
}) {
  const sp = await searchParams;
  const locale = LOCALES.includes(sp.locale as (typeof LOCALES)[number])
    ? (sp.locale as string)
    : "it";
  const sb = createAdminClient();
  const { data } = await sb.from("seo_defaults").select("*").eq("locale", locale).maybeSingle();

  return (
    <>
      <h1 className="st-h1">SEO defaults · {locale}</h1>
      <p className="st-sub">Default title/description, OG, analytics IDs.</p>
      <div className="st-tabs">
        {LOCALES.map((l) => (
          <a key={l} href={`${studioPath("/seo")}?locale=${l}`} className={`st-tab${l === locale ? " active" : ""}`}>
            {l.toUpperCase()}
          </a>
        ))}
      </div>
      <JsonResourceEditor
        endpoint={`/api/studio/seo?locale=${locale}`}
        initial={
          data || {
            locale,
            default_title: "",
            default_description: "",
            og_image_path: "/images/og-cover.svg",
            ga_measurement_id: "",
            plausible_domain: "",
          }
        }
      />
    </>
  );
}
