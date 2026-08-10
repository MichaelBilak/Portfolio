import { writeFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const res = await fetch(`${url}/rest/v1/`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  const json = (await res.json()) as { definitions?: Record<string, unknown> };
  const names = Object.keys(json.definitions || {}).sort();
  writeFileSync("db-check.txt", names.join("\n") || `status=${res.status} empty`);

  // Probe our expected tables
  const sb = createClient(url, key, { auth: { persistSession: false } });
  const expected = [
    "service_tiers",
    "services_tiers",
    "service_i18n",
    "services_locales",
    "project_i18n",
    "projects_locales",
    "addon_categories",
    "process_steps",
    "before_after_cases",
    "site_copy",
    "site_settings",
  ];
  const lines = ["--- probe ---"];
  for (const t of expected) {
    const { error } = await sb.from(t).select("*", { head: true, count: "exact" });
    lines.push(`${t}: ${error ? error.message : "EXISTS"}`);
  }
  writeFileSync("db-check.txt", names.join("\n") + "\n" + lines.join("\n"));
}

main().catch((e) => {
  writeFileSync("db-check.txt", String(e));
  process.exit(1);
});
