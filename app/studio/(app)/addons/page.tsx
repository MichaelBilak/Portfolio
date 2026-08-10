import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { studioPath } from "@/lib/studio/path";

export default async function AddonsAdminPage() {
  const sb = createAdminClient();
  const { data } = await sb
    .from("addon_categories")
    .select("id, category_id, sort_order")
    .order("sort_order");

  return (
    <>
      <h1 className="st-h1">Addons</h1>
      <p className="st-sub">Pricing addon categories and items.</p>
      <table className="st-table">
        <thead>
          <tr>
            <th>Category</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {(data || []).map((row) => (
            <tr key={row.id}>
              <td>{row.category_id}</td>
              <td>
                <Link href={studioPath(`/addons/${row.id}`)}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
