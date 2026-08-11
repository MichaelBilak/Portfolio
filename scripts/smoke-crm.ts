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

  const { data: createdCase, error: caseError } = await supabase
    .from("cases")
    .insert({
      title: marker,
      stage_id: stage.id,
      owner_id: profile.id,
      created_by: profile.id,
      client_name: "Smoke Test",
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

  console.info("\nCRM write/read/storage smoke test passed.");
} finally {
  if (caseId) {
    const { error } = await supabase.from("cases").delete().eq("id", caseId);
    if (error) console.error(`Cleanup case failed: ${error.message}`);
  }
  const { error: storageCleanupError } = await supabase.storage
    .from("crm-private")
    .remove([storagePath]);
  if (storageCleanupError) console.error(`Cleanup file failed: ${storageCleanupError.message}`);
}
