import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { studioPath } from "@/lib/studio/path";

export default async function ProcessAdminPage() {
  const sb = createAdminClient();
  const { data } = await sb.from("process_steps").select("id, step_id, number_label, sort_order").order("sort_order");
  return (
    <>
      <h1 className="st-h1">Process</h1>
      <p className="st-sub">Homepage process steps.</p>
      <table className="st-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Step</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {(data || []).map((row) => (
            <tr key={row.id}>
              <td>{row.number_label}</td>
              <td>{row.step_id}</td>
              <td>
                <Link href={studioPath(`/process/${row.id}`)}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
