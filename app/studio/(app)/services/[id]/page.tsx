import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { JsonResourceEditor } from "@/components/studio/json-resource-editor";
import { getStudioSession } from "@/lib/studio/auth";
import { createStudioTranslator, resolveStudioLocale } from "@/lib/studio/i18n/messages";

export default async function ServiceEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getStudioSession();
  const locale = resolveStudioLocale(user?.adminLocale);
  const t = createStudioTranslator(locale);

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
      <h1 className="st-h1">{t("content.editService", { id: data.service_id })}</h1>
      <p className="st-sub">{t("content.editServiceSub")}</p>
      <JsonResourceEditor endpoint={`/api/studio/services/${id}`} initial={data} />
    </>
  );
}
