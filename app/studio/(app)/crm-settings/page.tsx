import { CrmSettingsPage } from "@/components/studio/crm-pages";
import { notFound } from "next/navigation";
import { getStudioSession, hasStudioCapability } from "@/lib/studio/auth";

export default async function StudioCrmSettingsPage() {
  const user = await getStudioSession();
  if (!user || !hasStudioCapability(user.role, "settings.manage")) notFound();
  return <CrmSettingsPage />;
}
