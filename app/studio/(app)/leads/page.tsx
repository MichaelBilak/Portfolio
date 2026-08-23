import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { canManageLeads, getStudioSession } from "@/lib/studio/auth";
import { createStudioTranslator, resolveStudioLocale } from "@/lib/studio/i18n/messages";
import { LeadsWorkspace } from "@/components/studio/leads-workspace";
import { CreateLead } from "@/components/studio/workspaces/create-lead";

export default async function LeadsListPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; create?: string }>;
}) {
  const user = await getStudioSession();
  if (!user || !canManageLeads(user.role)) notFound();

  const locale = resolveStudioLocale(user.adminLocale);
  const t = createStudioTranslator(locale);
  const sp = await searchParams;
  const view = sp.view === "board" ? "board" : "list";

  const sb = createAdminClient();
  const { data: users } = await sb
    .from("profiles")
    .select("id, name")
    .in("role", ["owner", "editor", "manager", "sales"])
    .order("name", { ascending: true });

  return (
    <>
      <CreateLead autoOpen={sp.create === "1"} />
      <Suspense
      fallback={
        <div className="st-state">
          <strong>{t("common.loading")}</strong>
        </div>
      }
      >
        <LeadsWorkspace
        initialView={view}
        currentUserId={user.id}
        users={(users || []).map((profile) => ({
          id: profile.id,
          name: profile.name,
        }))}
        />
      </Suspense>
    </>
  );
}
