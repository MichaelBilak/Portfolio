import { writeFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

async function main() {
  const lines: string[] = [];
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    writeFileSync("db-check.txt", "missing env");
    process.exit(1);
  }
  const sb = createClient(url, key, { auth: { persistSession: false } });
  const tables = [
    "profiles",
    "projects",
    "services",
    "leads",
    "site_copy",
    "redirects",
    "media",
    "seo_defaults",
  ];
  for (const t of tables) {
    const { error, count } = await sb.from(t).select("*", { count: "exact", head: true });
    lines.push(`${t}: ${error ? `ERR ${error.message}` : `ok ${count}`}`);
  }
  const { data: buckets } = await sb.storage.listBuckets();
  lines.push(`buckets: ${(buckets || []).map((b) => b.name).join(", ") || "none"}`);
  writeFileSync("db-check.txt", lines.join("\n"));
}

main().catch((e) => {
  writeFileSync("db-check.txt", String(e));
  process.exit(1);
});
