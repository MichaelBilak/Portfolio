import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function BeforeAfterAdminPage() {
  const sb = createAdminClient();
  const { data } = await sb
    .from("before_after_cases")
    .select("id, case_id, published, sort_order")
    .order("sort_order");
  return (
    <>
      <h1 className="st-h1">Before / After</h1>
      <table className="st-table">
        <thead>
          <tr>
            <th>Case</th>
            <th>Published</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {(data || []).map((row) => (
            <tr key={row.id}>
              <td>{row.case_id}</td>
              <td>{row.published ? "yes" : "no"}</td>
              <td>
                <Link href={`/studio/before-after/${row.id}`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
