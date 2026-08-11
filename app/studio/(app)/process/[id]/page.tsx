import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { JsonResourceEditor } from "@/components/studio/json-resource-editor";
import { getStudioSession } from "@/lib/studio/auth";
import { createStudioTranslator, resolveStudioLocale } from "@/lib/studio/i18n/messages";

export default async function ProcessEditPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getStudioSession();
  const locale = resolveStudioLocale(user?.adminLocale);
  const t = createStudioTranslator(locale);

  const { id } = await params;
  const sb = createAdminClient();
  const { data } = await sb.from("process_steps").select("*, process_step_i18n(*)").eq("id", id).maybeSingle();
  if (!data) notFound();
  return (
    <>
      <h1 className="st-h1">{t("content.editProcess", { id: data.step_id })}</h1>
      <p className="st-sub">{t("content.editProcessSub")}</p>
      <JsonResourceEditor endpoint={`/api/studio/process/${id}`} initial={data} />
    </>
  );
}
