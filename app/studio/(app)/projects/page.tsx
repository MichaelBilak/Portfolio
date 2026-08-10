import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { studioPath } from "@/lib/studio/path";

export default async function ProjectsAdminPage() {
  const sb = createAdminClient();
  const { data } = await sb
    .from("projects")
    .select("id, project_id, slug, published, featured, sort_order")
    .order("sort_order");

  return (
    <>
      <h1 className="st-h1">Портфолио</h1>
      <p className="st-sub">Проекты на сайте.</p>
      <table className="st-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Slug</th>
            <th>Published</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {(data || []).map((row) => (
            <tr key={row.id}>
              <td>{row.project_id}</td>
              <td>{row.slug}</td>
              <td>{row.published ? "yes" : "no"}</td>
              <td>
                <Link href={studioPath(`/projects/${row.id}`)}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
