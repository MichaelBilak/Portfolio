import { ModulePage } from "@/components/studio/crm-pages";
import { getStudioSession, hasStudioCapability } from "@/lib/studio/auth";

export default async function StudioTasksPage() {
  const user = await getStudioSession();
  return <ModulePage kind="tasks" canCreate={Boolean(user && hasStudioCapability(user.role, "tasks.manage"))} />;
}
