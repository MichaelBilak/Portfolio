import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { JsonResourceEditor } from "@/components/studio/json-resource-editor";
import { getStudioSession } from "@/lib/studio/auth";
import { createStudioTranslator, resolveStudioLocale } from "@/lib/studio/i18n/messages";
import { studioPath } from "@/lib/studio/path";

const LOCALES = ["it", "en", "fr", "ru", "de", "es"] as const;

export default async function SiteCopySectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ locale?: string }>;
}) {
  const user = await getStudioSession();
  const adminLocale = resolveStudioLocale(user?.adminLocale);
  const t = createStudioTranslator(adminLocale);

  const { section } = await params;
  const sp = await searchParams;
  const locale = LOCALES.includes(sp.locale as (typeof LOCALES)[number])
    ? (sp.locale as string)
    : "it";

  const sb = createAdminClient();
  const { data } = await sb
    .from("site_copy")
    .select("*")
    .eq("locale", locale)
    .eq("section", section)
    .maybeSingle();

  const initial = data?.data ?? null;

  return (
    <>
      <h1 className="st-h1">
        {t("copy.sectionTitle", { section, locale })}
      </h1>
      <div className="st-tabs">
        {LOCALES.map((l) => (
          <Link
            key={l}
            href={`${studioPath(`/copy/${section}`)}?locale=${l}`}
            className={`st-tab${l === locale ? " active" : ""}`}
          >
            {l.toUpperCase()}
          </Link>
        ))}
      </div>
      <JsonResourceEditor
        endpoint={`/api/studio/copy?locale=${locale}&section=${encodeURIComponent(section)}`}
        initial={initial}
      />
    </>
  );
}
