import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { JsonResourceEditor } from "@/components/studio/json-resource-editor";
import { getStudioSession } from "@/lib/studio/auth";
import { createStudioTranslator, resolveStudioLocale } from "@/lib/studio/i18n/messages";
import { studioPath } from "@/lib/studio/path";

export default async function PortfolioProjectEditPage({
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
    .from("projects")
    .select("*, project_i18n(*)")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  return (
    <>
      <Link href={studioPath("/content/projects")} className="st-back-link">
        <ArrowLeft size={14} />
        {t("projects.backToList")}
      </Link>
      <h1 className="st-h1">{t("content.editProject", { id: data.project_id })}</h1>
      <p className="st-sub">{t("content.editProjectSub")}</p>
      <JsonResourceEditor endpoint={`/api/studio/projects/${id}`} initial={data} />
    </>
  );
}
