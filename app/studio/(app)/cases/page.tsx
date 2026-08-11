import { CasesPage } from "@/components/studio/crm-pages";
import { getStudioSession, hasStudioCapability } from "@/lib/studio/auth";

export default async function StudioCasesPage() {
  const user = await getStudioSession();
  return <CasesPage canCreate={Boolean(user && hasStudioCapability(user.role, "cases.create"))} />;
}
