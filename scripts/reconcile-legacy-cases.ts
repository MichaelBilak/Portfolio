import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(url, key, { auth: { persistSession: false } });
const [{ data: cases, error: casesError }, { data: projects, error: projectsError }] = await Promise.all([
  supabase.from("cases").select("id,case_number,title,company_name,client_name,estimated_value,stage_id,updated_at,pipeline_stages(key,name,is_closed,is_won)").is("archived_at", null).order("updated_at", { ascending: false }),
  supabase.from("client_projects").select("case_id").not("case_id", "is", null),
]);

if (casesError) throw casesError;
if (projectsError) {
  console.error("HQ schema is not applied yet. Run supabase/migrations/008_hq_phase1.sql in the Supabase SQL Editor, then retry.");
  throw projectsError;
}

const linked = new Set((projects || []).map((row) => row.case_id));
const unresolved = (cases || []).filter((row) => !linked.has(row.id));

console.info(`Legacy cases: ${(cases || []).length}`);
console.info(`Already linked to HQ projects: ${linked.size}`);
console.info(`Require explicit review: ${unresolved.length}\n`);

for (const row of unresolved) {
  const stage = Array.isArray(row.pipeline_stages) ? row.pipeline_stages[0] : row.pipeline_stages;
  console.info([
    `#${row.case_number}`,
    row.title,
    row.company_name || row.client_name || "unknown client",
    stage && typeof stage === "object" && "key" in stage ? String(stage.key) : "unknown stage",
    row.estimated_value ? `${row.estimated_value} EUR` : "no value",
    `id=${row.id}`,
  ].join(" | "));
}

console.info("\nThis command is read-only. Reconcile each ambiguous case from the HQ UI; no automatic conversion was performed.");
