import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { JsonResourceEditor } from "@/components/studio/json-resource-editor";

export default async function AddonEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = createAdminClient();
  const { data } = await sb
    .from("addon_categories")
    .select("*, addon_category_i18n(*), addon_items(*, addon_item_i18n(*))")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  return (
    <>
      <h1 className="st-h1">Edit addon · {data.category_id}</h1>
      <JsonResourceEditor endpoint={`/api/studio/addons/${id}`} initial={data} />
    </>
  );
}
