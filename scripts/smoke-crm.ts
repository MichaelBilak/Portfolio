import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const marker = `[CRM smoke] ${new Date().toISOString()}`;
const storagePath = `smoke/${randomUUID()}.txt`;
let caseId: string | null = null;
let leadId: string | null = null;
let hqCompanyId: string | null = null;
let hqDealId: string | null = null;
let hqProjectId: string | null = null;
let hqInvoiceId: string | null = null;
let hqPaymentId: string | null = null;
let hqSubscriptionId: string | null = null;

function check(error: { message: string } | null, step: string) {
  if (error) throw new Error(`${step}: ${error.message}`);
  console.info(`✓ ${step}`);
}

try {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "owner")
    .limit(1)
    .maybeSingle();
  check(profileError, "owner lookup");
  if (!profile) throw new Error("Create an owner profile before running the smoke test.");

  const { data: stage, error: stageError } = await supabase
    .from("pipeline_stages")
    .select("id")
    .eq("key", "intake")
    .maybeSingle();
  check(stageError, "pipeline lookup");
  if (!stage) throw new Error("The intake pipeline stage is missing.");

  const { data: createdLead, error: leadError } = await supabase
    .from("leads")
    .insert({
      status: "new",
      priority: "normal",
      full_name: "Smoke Lead",
      email: `smoke-${randomUUID().slice(0, 8)}@example.com`,
      business_name: marker,
      source: "smoke",
      intent: "contact",
      locale: "en",
      assignee_id: profile.id,
    })
    .select("id")
    .single();
  check(leadError, "lead create");
  if (!createdLead) throw new Error("Lead create did not return a record.");
  leadId = createdLead.id;

  const { error: leadEventError } = await supabase.from("lead_events").insert({
    lead_id: leadId,
    actor_id: profile.id,
    event_type: "created",
    payload: { smoke: true },
  });
  check(leadEventError, "lead event");

  const { error: leadNotificationError } = await supabase.from("notifications").insert({
    recipient_id: profile.id,
    type: "lead_created",
    title: "Smoke lead",
    body: marker,
    link: `/leads/${leadId}`,
    payload: { leadId },
  });
  check(leadNotificationError, "lead notification");

  const { data: createdCase, error: caseError } = await supabase
    .from("cases")
    .insert({
      title: marker,
      stage_id: stage.id,
      owner_id: profile.id,
      created_by: profile.id,
      client_name: "Smoke Test",
      lead_id: leadId,
    })
    .select("id")
    .single();
  check(caseError, "case create");
  if (!createdCase) throw new Error("Case create did not return a record.");
  caseId = createdCase.id;

  const { error: memberError } = await supabase.from("case_members").insert({
    case_id: caseId,
    profile_id: profile.id,
    member_role: "owner",
    added_by: profile.id,
  });
  check(memberError, "case membership");

  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .insert({
      case_id: caseId,
      title: `${marker} task`,
      assignee_id: profile.id,
      created_by: profile.id,
    })
    .select("id")
    .single();
  check(taskError, "task create");
  if (!task) throw new Error("Task create did not return a record.");

  const { data: document, error: documentError } = await supabase
    .from("case_documents")
    .insert({
      case_id: caseId,
      title: `${marker} specification`,
      document_type: "specification",
      current_version: 1,
      created_by: profile.id,
    })
    .select("id")
    .single();
  check(documentError, "document create");
  if (!document) throw new Error("Document create did not return a record.");

  const { error: versionError } = await supabase.from("document_versions").insert({
    document_id: document.id,
    version: 1,
    body: JSON.stringify({ items: [{ section: "Smoke", item: "Verify", acceptance: "Pass" }] }),
    created_by: profile.id,
  });
  check(versionError, "document version");

  const { error: financeError } = await supabase.from("finance_milestones").insert({
    case_id: caseId,
    title: `${marker} milestone`,
    amount: 1,
    currency: "EUR",
    created_by: profile.id,
  });
  check(financeError, "finance milestone");

  const { error: timeError } = await supabase.from("time_entries").insert({
    case_id: caseId,
    task_id: task.id,
    profile_id: profile.id,
    minutes: 1,
    description: marker,
  });
  check(timeError, "time entry");

  const fileBody = Buffer.from("DormUp CRM smoke test");
  const { error: uploadError } = await supabase.storage
    .from("crm-private")
    .upload(storagePath, fileBody, { contentType: "text/plain", upsert: false });
  check(uploadError, "private file upload");

  const { data: file, error: fileError } = await supabase
    .from("case_files")
    .insert({
      case_id: caseId,
      bucket: "crm-private",
      path: storagePath,
      file_name: "smoke.txt",
      mime_type: "text/plain",
      size_bytes: fileBody.byteLength,
      uploaded_by: profile.id,
    })
    .select("id")
    .single();
  check(fileError, "file metadata");
  if (!file) throw new Error("File metadata create did not return a record.");

  const { data: signed, error: signedError } = await supabase.storage
    .from("crm-private")
    .createSignedUrl(storagePath, 60);
  check(signedError, "signed download");
  if (!signed?.signedUrl) throw new Error("Signed URL was not returned.");

  const { count, error: relationError } = await supabase
    .from("tasks")
    .select("id", { count: "exact", head: true })
    .eq("case_id", caseId);
  check(relationError, "case relations read");
  if (count !== 1 || !file.id) throw new Error("Created CRM relations are incomplete.");

  const { data: hqCompany, error: hqCompanyError } = await supabase
    .from("companies")
    .insert({ name: marker, status: "prospect", owner_id: profile.id, created_by: profile.id })
    .select("id")
    .single();
  check(hqCompanyError, "HQ company create");
  hqCompanyId = hqCompany?.id || null;
  if (!hqCompanyId) throw new Error("HQ company create did not return an id.");

  const { data: hqDeal, error: hqDealError } = await supabase
    .from("deals")
    .insert({ company_id: hqCompanyId, title: `${marker} deal`, stage: "qualified", status: "open", value: 100, probability: 50, owner_id: profile.id, created_by: profile.id })
    .select("id")
    .single();
  check(hqDealError, "HQ deal create");
  hqDealId = hqDeal?.id || null;

  const { data: hqProject, error: hqProjectError } = await supabase
    .from("client_projects")
    .insert({ company_id: hqCompanyId, name: `${marker} project`, status: "planned", health: "green", sold_price: 100, owner_id: profile.id, created_by: profile.id })
    .select("id")
    .single();
  check(hqProjectError, "HQ project create");
  hqProjectId = hqProject?.id || null;

  const { data: hqInvoice, error: hqInvoiceError } = await supabase
    .from("invoices")
    .insert({ invoice_number: `SMOKE-${randomUUID()}`, company_id: hqCompanyId, project_id: hqProjectId, issue_date: new Date().toISOString().slice(0, 10), total: 100, subtotal: 100, created_by: profile.id })
    .select("id")
    .single();
  check(hqInvoiceError, "HQ invoice create");
  hqInvoiceId = hqInvoice?.id || null;

  const { data: hqPayment, error: hqPaymentError } = await supabase
    .from("payments")
    .insert({ invoice_id: hqInvoiceId, company_id: hqCompanyId, amount: 10, currency: "EUR", status: "pending", created_by: profile.id })
    .select("id")
    .single();
  check(hqPaymentError, "HQ payment create");
  hqPaymentId = hqPayment?.id || null;

  const { data: hqSubscription, error: hqSubscriptionError } = await supabase
    .from("subscriptions")
    .insert({ company_id: hqCompanyId, name: `${marker} support`, amount: 25, currency: "EUR", interval: "month", status: "active", started_on: new Date().toISOString().slice(0, 10), created_by: profile.id })
    .select("id")
    .single();
  check(hqSubscriptionError, "HQ subscription create");
  hqSubscriptionId = hqSubscription?.id || null;

  const { error: hqTaskError } = await supabase.from("tasks").insert({
    client_project_id: hqProjectId,
    company_id: hqCompanyId,
    title: `${marker} HQ task`,
    status: "waiting",
    assignee_id: profile.id,
    created_by: profile.id,
  });
  check(hqTaskError, "HQ related task");

  console.info("\nDormUp HQ write/read/storage smoke test passed.");
} finally {
  if (caseId) {
    const { error } = await supabase.from("cases").delete().eq("id", caseId);
    if (error) console.error(`Cleanup case failed: ${error.message}`);
  }
  if (leadId) {
    const { error } = await supabase.from("leads").delete().eq("id", leadId);
    if (error) console.error(`Cleanup lead failed: ${error.message}`);
  }
  if (hqPaymentId) await supabase.from("payments").delete().eq("id", hqPaymentId);
  if (hqInvoiceId) await supabase.from("invoices").delete().eq("id", hqInvoiceId);
  if (hqSubscriptionId) await supabase.from("subscriptions").delete().eq("id", hqSubscriptionId);
  if (hqProjectId) await supabase.from("client_projects").delete().eq("id", hqProjectId);
  if (hqDealId) await supabase.from("deals").delete().eq("id", hqDealId);
  if (hqCompanyId) await supabase.from("companies").delete().eq("id", hqCompanyId);
  const { error: storageCleanupError } = await supabase.storage
    .from("crm-private")
    .remove([storagePath]);
  if (storageCleanupError) console.error(`Cleanup file failed: ${storageCleanupError.message}`);
}
