import { createAdminClient } from "@/lib/supabase/admin";
import { MediaUploader } from "@/components/studio/media-uploader";
import { getStudioSession } from "@/lib/studio/auth";
import { createStudioTranslator, resolveStudioLocale } from "@/lib/studio/i18n/messages";

export default async function MediaAdminPage() {
  const user = await getStudioSession();
  const locale = resolveStudioLocale(user?.adminLocale);
  const t = createStudioTranslator(locale);

  const sb = createAdminClient();
  const { data } = await sb.from("media").select("*").order("created_at", { ascending: false }).limit(100);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  return (
    <>
      <h1 className="st-h1">{t("content.mediaTitle")}</h1>
      <p className="st-sub">{t("content.mediaSub")}</p>
      <MediaUploader />
      <table className="st-table" style={{ marginTop: "1.25rem" }}>
        <thead>
          <tr>
            <th>{t("content.colPath")}</th>
            <th>{t("content.colAlt")}</th>
            <th>{t("content.colSize")}</th>
          </tr>
        </thead>
        <tbody>
          {(data || []).map((row) => (
            <tr key={row.id}>
              <td>
                <a
                  href={`${url}/storage/v1/object/public/${row.bucket}/${row.path}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {row.path}
                </a>
              </td>
              <td>{row.alt || "—"}</td>
              <td>{row.size_bytes ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
