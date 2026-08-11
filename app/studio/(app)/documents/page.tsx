import { DocumentsPage } from "@/components/studio/crm-pages";
import { getStudioSession, hasStudioCapability } from "@/lib/studio/auth";

export default async function StudioDocumentsPage() {
  const user = await getStudioSession();
  return <DocumentsPage canCreate={Boolean(user && hasStudioCapability(user.role, "documents.manage"))} />;
}
