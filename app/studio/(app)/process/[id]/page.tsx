import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { JsonResourceEditor } from "@/components/studio/json-resource-editor";

export default async function ProcessEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = createAdminClient();
  const { data } = await sb.from("process_steps").select("*, process_step_i18n(*)").eq("id", id).maybeSingle();
  if (!data) notFound();
  return (
    <>
      <h1 className="st-h1">Edit process · {data.step_id}</h1>
      <JsonResourceEditor endpoint={`/api/studio/process/${id}`} initial={data} />
    </>
  );
}
