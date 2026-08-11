import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStudioSession } from "@/lib/studio/auth";
import { createStudioTranslator, resolveStudioLocale } from "@/lib/studio/i18n/messages";
import { studioPath } from "@/lib/studio/path";

export default async function ProcessAdminPage() {
  const user = await getStudioSession();
  const locale = resolveStudioLocale(user?.adminLocale);
  const t = createStudioTranslator(locale);

  const sb = createAdminClient();
  const { data } = await sb.from("process_steps").select("id, step_id, number_label, sort_order").order("sort_order");
  return (
    <>
      <h1 className="st-h1">{t("content.processTitle")}</h1>
      <p className="st-sub">{t("content.processSub")}</p>
      <table className="st-table">
        <thead>
          <tr>
            <th>#</th>
            <th>{t("content.colStep")}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {(data || []).map((row) => (
            <tr key={row.id}>
              <td>{row.number_label}</td>
              <td>{row.step_id}</td>
              <td>
                <Link href={studioPath(`/process/${row.id}`)}>{t("common.edit")}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
