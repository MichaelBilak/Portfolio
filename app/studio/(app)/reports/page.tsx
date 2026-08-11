import { ReportsPage } from "@/components/studio/crm-pages";
import { notFound } from "next/navigation";
import { getStudioSession, hasStudioCapability } from "@/lib/studio/auth";

export default async function StudioReportsPage() {
  const user = await getStudioSession();
  if (!user || !hasStudioCapability(user.role, "reports.read")) notFound();
  return <ReportsPage />;
}
