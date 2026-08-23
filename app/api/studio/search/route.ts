import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  canManageLeads,
  hasStudioCapability,
  requireStudioUser,
} from "@/lib/studio/auth";
import {
  getAccessibleCaseIds,
  hasGlobalCaseAccess,
  taskAccessOrFilter,
} from "@/lib/studio/access";

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
    .select("id,case_id,deal_id,client_project_id,title,status,due_at")
    .is("deleted_at", null)
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
    tasksQuery = tasksQuery.or(taskAccessOrFilter(auth.id, accessibleCaseIds));
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
  const salesRequests = await Promise.all([
    hasStudioCapability(auth.role, "companies.read")
      ? sb
          .from("companies")
          .select("id,name,legal_name,email,phone,status,updated_at")
          .or(`name.ilike.%${term}%,legal_name.ilike.%${term}%,email.ilike.%${term}%`)
          .limit(20)
      : { data: [] as unknown[], error: null },
    hasStudioCapability(auth.role, "companies.read")
      ? sb
          .from("contacts")
          .select("id,company_id,first_name,last_name,email,phone,status,updated_at")
          .or(
            `first_name.ilike.%${term}%,last_name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`,
          )
          .limit(20)
      : { data: [] as unknown[], error: null },
    hasStudioCapability(auth.role, "deals.read")
      ? sb
          .from("deals")
          .select("id,company_id,title,stage,status,value,currency,updated_at")
          .or(`title.ilike.%${term}%,notes.ilike.%${term}%`)
          .limit(20)
      : { data: [] as unknown[], error: null },
    hasStudioCapability(auth.role, "projects.read")
      ? sb
          .from("client_projects")
          .select("id,project_number,company_id,deal_id,name,status,health,updated_at")
          .ilike("name", `%${term}%`)
          .limit(20)
      : { data: [] as unknown[], error: null },
    hasStudioCapability(auth.role, "deals.read")
      ? sb
          .from("products")
          .select("id,sku,name,kind,unit_price,currency,active,updated_at")
          .or(`sku.ilike.%${term}%,name.ilike.%${term}%,description.ilike.%${term}%`)
          .limit(20)
      : { data: [] as unknown[], error: null },
  ]);
  const [companies, contacts, deals, clientProjects, products] = salesRequests;
  const error =
    cases.error ||
    tasks.error ||
    documents.error ||
    leads.error ||
    companies.error ||
    contacts.error ||
    deals.error ||
    clientProjects.error ||
    products.error;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({
    cases: cases.data,
    tasks: tasks.data,
    documents: documents.data,
    leads: leads.data,
    companies: companies.data,
    contacts: contacts.data,
    deals: deals.data,
    clientProjects: clientProjects.data,
    products: products.data,
  });
}
