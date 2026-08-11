import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { canManageLeads, requireStudioUser } from "@/lib/studio/auth";
import { getAccessibleCaseIds, hasGlobalCaseAccess } from "@/lib/studio/access";

export async function GET(request: NextRequest) {
  const auth = await requireStudioUser({ capability: "cases.read" });
  if ("error" in auth) return auth.error;
  const raw = request.nextUrl.searchParams.get("q")?.trim();
  if (!raw || raw.length < 2) {
    return NextResponse.json({ error: "q must contain at least 2 characters" }, { status: 400 });
  }
  const term = raw.replace(/[%_,()]/g, " ").slice(0, 100);
  const sb = createAdminClient();
  const accessibleCaseIds = await getAccessibleCaseIds(sb, auth);
  const noCaseId = "00000000-0000-0000-0000-000000000000";
  let casesQuery = sb
    .from("cases")
    .select("id,case_number,title,client_name,company_name,updated_at")
    .is("archived_at", null)
    .or(`title.ilike.%${term}%,client_name.ilike.%${term}%,company_name.ilike.%${term}%`)
    .limit(20);
  let tasksQuery = sb
    .from("tasks")
    .select("id,case_id,title,status,due_at")
    .ilike("title", `%${term}%`)
    .limit(20);
  let documentsQuery = sb
    .from("case_documents")
    .select("id,case_id,title,status,updated_at")
    .ilike("title", `%${term}%`)
    .limit(20);
  if (!hasGlobalCaseAccess(auth)) {
    const ids = accessibleCaseIds?.length ? accessibleCaseIds : [noCaseId];
    casesQuery = casesQuery.in("id", ids);
    documentsQuery = documentsQuery.in("case_id", ids);
    const taskFilter = accessibleCaseIds?.length
      ? `case_id.in.(${accessibleCaseIds.join(",")}),and(case_id.is.null,or(created_by.eq.${auth.id},assignee_id.eq.${auth.id}))`
      : `and(case_id.is.null,or(created_by.eq.${auth.id},assignee_id.eq.${auth.id}))`;
    tasksQuery = tasksQuery.or(taskFilter);
  }
  const requests = [
    casesQuery,
    tasksQuery,
    documentsQuery,
  ];
  const [cases, tasks, documents] = await Promise.all(requests);
  const leads = canManageLeads(auth.role)
    ? await sb
        .from("leads")
        .select("id,full_name,email,business_name,status,created_at")
        .or(`full_name.ilike.%${term}%,email.ilike.%${term}%,business_name.ilike.%${term}%`)
        .limit(20)
    : { data: [] as unknown[], error: null };
  const error = cases.error || tasks.error || documents.error || leads.error;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({
    cases: cases.data,
    tasks: tasks.data,
    documents: documents.data,
    leads: leads.data,
  });
}
