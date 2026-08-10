import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { studioPath } from "@/lib/studio/path";

export default async function ServicesAdminPage() {
  const sb = createAdminClient();
  const { data } = await sb
    .from("services")
    .select("id, service_id, slug, base_price, published, sort_order")
    .order("sort_order");

  return (
    <>
      <h1 className="st-h1">Услуги и цены</h1>
      <p className="st-sub">Каталог услуг на сайте.</p>
      <table className="st-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Slug</th>
            <th>Base €</th>
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
                <Link href={studioPath(`/services/${row.id}`)}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
