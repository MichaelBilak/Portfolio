import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { JsonResourceEditor } from "@/components/studio/json-resource-editor";

export default async function ProjectEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sb = createAdminClient();
  const { data } = await sb
    .from("projects")
    .select("*, project_i18n(*)")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  return (
    <>
      <h1 className="st-h1">Edit project · {data.project_id}</h1>
      <p className="st-sub">Update fields and nested project_i18n[].</p>
      <JsonResourceEditor endpoint={`/api/studio/projects/${id}`} initial={data} />
    </>
  );
}
