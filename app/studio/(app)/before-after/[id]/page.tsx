import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { JsonResourceEditor } from "@/components/studio/json-resource-editor";

export default async function BeforeAfterEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = createAdminClient();
  const { data } = await sb.from("before_after_cases").select("*, before_after_i18n(*)").eq("id", id).maybeSingle();
  if (!data) notFound();
  return (
    <>
      <h1 className="st-h1">Edit case · {data.case_id}</h1>
      <JsonResourceEditor endpoint={`/api/studio/before-after/${id}`} initial={data} />
    </>
  );
}
