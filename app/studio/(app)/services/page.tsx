import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStudioSession } from "@/lib/studio/auth";
import { createStudioTranslator, resolveStudioLocale } from "@/lib/studio/i18n/messages";
import { studioPath } from "@/lib/studio/path";

export default async function ServicesAdminPage() {
  const user = await getStudioSession();
  const locale = resolveStudioLocale(user?.adminLocale);
  const t = createStudioTranslator(locale);

  const sb = createAdminClient();
  const { data } = await sb
    .from("services")
    .select("id, service_id, slug, base_price, published, sort_order")
    .order("sort_order");

  return (
    <>
      <h1 className="st-h1">{t("content.servicesTitle")}</h1>
      <p className="st-sub">{t("content.servicesSub")}</p>
      <table className="st-table">
        <thead>
          <tr>
            <th>{t("content.colId")}</th>
            <th>{t("content.colSlug")}</th>
            <th>{t("content.colBase")}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {(data || []).map((row) => (
            <tr key={row.id}>
              <td>{row.service_id}</td>
              <td>{row.slug}</td>
              <td>{row.base_price}</td>
              <td>
                <Link href={studioPath(`/services/${row.id}`)}>{t("common.edit")}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
