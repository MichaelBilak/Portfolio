import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStudioSession } from "@/lib/studio/auth";
import { createStudioTranslator, resolveStudioLocale } from "@/lib/studio/i18n/messages";
import { studioPath } from "@/lib/studio/path";

export default async function ProjectsAdminPage() {
  const user = await getStudioSession();
  const locale = resolveStudioLocale(user?.adminLocale);
  const t = createStudioTranslator(locale);

  const sb = createAdminClient();
  const { data } = await sb
    .from("projects")
    .select("id, project_id, slug, published, featured, sort_order")
    .order("sort_order");

  return (
    <>
      <h1 className="st-h1">{t("content.projectsTitle")}</h1>
      <p className="st-sub">{t("content.projectsSub")}</p>
      <table className="st-table">
        <thead>
          <tr>
            <th>{t("content.colId")}</th>
            <th>{t("content.colSlug")}</th>
            <th>{t("content.colPublished")}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {(data || []).map((row) => (
            <tr key={row.id}>
              <td>{row.project_id}</td>
              <td>{row.slug}</td>
              <td>{row.published ? t("common.yes") : t("common.no")}</td>
              <td>
                <Link href={studioPath(`/projects/${row.id}`)}>{t("common.edit")}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
