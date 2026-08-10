import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { JsonResourceEditor } from "@/components/studio/json-resource-editor";

export default async function ServiceEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sb = createAdminClient();
  const { data } = await sb
    .from("services")
    .select("*, service_i18n(*), service_tiers(*, service_tier_i18n(*))")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  return (
    <>
      <h1 className="st-h1">Edit service · {data.service_id}</h1>
      <p className="st-sub">Includes service_i18n and service_tiers (+ tier i18n).</p>
      <JsonResourceEditor endpoint={`/api/studio/services/${id}`} initial={data} />
    </>
  );
}
