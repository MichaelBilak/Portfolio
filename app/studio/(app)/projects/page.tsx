import { createAdminClient } from "@/lib/supabase/admin";
import { ProjectsManager } from "@/components/studio/projects-manager";
import { getStudioSession } from "@/lib/studio/auth";
import { createStudioTranslator, resolveStudioLocale } from "@/lib/studio/i18n/messages";

export default async function ProjectsAdminPage() {
  const user = await getStudioSession();
  const locale = resolveStudioLocale(user?.adminLocale);
  const t = createStudioTranslator(locale);

  const sb = createAdminClient();
  const { data } = await sb
    .from("projects")
    .select(
      "id, project_id, slug, index_label, tag, sort_order, published, featured, is_live, url, display_url, project_i18n(id, locale, name, name_tagline, subtitle)",
    )
    .order("sort_order", { ascending: true });

  return (
    <>
      <div className="st-page-header">
        <div>
          <h1 className="st-h1">{t("content.projectsTitle")}</h1>
          <p className="st-sub">{t("content.projectsSub")}</p>
        </div>
      </div>
      <ProjectsManager initial={data || []} adminLocale={locale} />
    </>
  );
}
