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

const tables = [
  "pipeline_stages",
  "cases",
  "case_members",
  "tasks",
  "task_checklist_items",
  "case_events",
  "lead_events",
  "case_decisions",
  "case_questions",
  "case_requirements",
  "case_files",
  "case_documents",
  "document_versions",
  "automation_rules",
  "automation_runs",
  "notifications",
  "finance_milestones",
  "time_entries",
  "care_retainers",
] as const;

let failed = false;

for (const table of tables) {
  const { count, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });

  if (error) {
    failed = true;
    console.error(`✗ ${table}: ${error.message}`);
  } else {
    console.info(`✓ ${table}: ${count ?? 0} rows`);
  }
}

const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
if (bucketError) {
  failed = true;
  console.error(`✗ storage: ${bucketError.message}`);
} else {
  const crmBucket = buckets.find((bucket) => bucket.id === "crm-private");
  if (!crmBucket) {
    failed = true;
    console.error("✗ private storage bucket crm-private is missing");
  } else if (crmBucket.public) {
    failed = true;
    console.error("✗ crm-private must not be public");
  } else {
    console.info("✓ crm-private: private bucket");
  }
}

if (failed) {
  console.error(
    "\nCRM checks failed. Apply supabase/migrations/003_crm_backend.sql, 006_leads_workspace.sql, and 007_care_and_proof.sql and retry.",
  );
  process.exit(1);
}

console.info("\nCRM schema is ready.");
