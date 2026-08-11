import { CaseWorkspace } from "@/components/studio/crm-pages";
import { getStudioSession, hasStudioCapability } from "@/lib/studio/auth";

export default async function StudioCasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getStudioSession();
  const role = user?.role || "viewer";
  return <CaseWorkspace caseId={id} permissions={{
    cases: hasStudioCapability(role, "cases.update"),
    tasks: hasStudioCapability(role, "tasks.manage"),
    files: hasStudioCapability(role, "files.manage"),
    documents: hasStudioCapability(role, "documents.manage"),
    finance: hasStudioCapability(role, "finance.manage"),
    time: hasStudioCapability(role, "time.manage"),
  }} />;
}
