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
  "companies",
  "contacts",
  "products",
  "deals",
  "client_projects",
  "project_milestones",
  "invoices",
  "invoice_items",
  "payments",
  "subscriptions",
  "activities",
  "notes",
  "attachments",
] as const;

let failed = false;

for (const table of tables) {
  const { data, error } = await supabase.from(table).select("*").limit(1);

  if (error) {
    failed = true;
    console.error(`✗ ${table}: ${error.message}`);
  } else {
    console.info(`✓ ${table}: readable (${data?.length ? "has rows" : "empty"})`);
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
    "\nCRM checks failed. Apply migrations 003 through 008 in order and retry. Never rerun the destructive greenfield SETUP.sql on an existing database.",
  );
  process.exit(1);
}

console.info("\nDormUp HQ schema is ready.");
