import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStudioSession } from "@/lib/studio/auth";
import { createStudioTranslator, resolveStudioLocale } from "@/lib/studio/i18n/messages";
import { studioPath } from "@/lib/studio/path";

export default async function AddonsAdminPage() {
  const user = await getStudioSession();
  const locale = resolveStudioLocale(user?.adminLocale);
  const t = createStudioTranslator(locale);

  const sb = createAdminClient();
  const { data } = await sb
    .from("addon_categories")
    .select("id, category_id, sort_order")
    .order("sort_order");

  return (
    <>
      <h1 className="st-h1">{t("content.addonsTitle")}</h1>
      <p className="st-sub">{t("content.addonsSub")}</p>
      <table className="st-table">
        <thead>
          <tr>
            <th>{t("content.colCategory")}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {(data || []).map((row) => (
            <tr key={row.id}>
              <td>{row.category_id}</td>
              <td>
                <Link href={studioPath(`/addons/${row.id}`)}>{t("common.edit")}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
