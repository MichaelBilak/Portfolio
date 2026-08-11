import { ModulePage } from "@/components/studio/crm-pages";
import { notFound } from "next/navigation";
import { getStudioSession, hasStudioCapability } from "@/lib/studio/auth";

export default async function StudioAutomationsPage() {
  const user = await getStudioSession();
  if (!user || !hasStudioCapability(user.role, "automations.manage")) notFound();
  return <ModulePage kind="automations" />;
}
