import { createAdminClient } from "@/lib/supabase/admin";
import { MediaUploader } from "@/components/studio/media-uploader";

export default async function MediaAdminPage() {
  const sb = createAdminClient();
  const { data } = await sb.from("media").select("*").order("created_at", { ascending: false }).limit(100);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  return (
    <>
      <h1 className="st-h1">Медиа</h1>
      <p className="st-sub">Загрузка картинок в облако Supabase (bucket media).</p>
      <MediaUploader />
      <table className="st-table" style={{ marginTop: "1.25rem" }}>
        <thead>
          <tr>
            <th>Path</th>
            <th>Alt</th>
            <th>Size</th>
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
