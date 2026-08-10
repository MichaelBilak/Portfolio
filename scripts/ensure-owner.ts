import { writeFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

async function main() {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );

  const lines: string[] = [];
  const { data: list, error } = await sb.auth.admin.listUsers({ perPage: 50 });
  if (error) {
    writeFileSync("db-check.txt", "auth error: " + error.message);
    process.exit(1);
  }

  for (const u of list.users) {
    const { data: profile } = await sb
      .from("profiles")
      .select("id, role, name")
      .eq("id", u.id)
      .maybeSingle();

    if (!profile) {
      await sb.from("profiles").upsert({
        id: u.id,
        name: u.email?.split("@")[0] || "owner",
        role: "owner",
      });
      lines.push(`created profile owner for ${u.email} (${u.id})`);
    } else if (profile.role !== "owner") {
      await sb.from("profiles").update({ role: "owner" }).eq("id", u.id);
      lines.push(`updated ${u.email} → owner (was ${profile.role})`);
    } else {
      lines.push(`ok ${u.email} already owner`);
    }
  }

  if (!list.users.length) lines.push("no auth users found");
  writeFileSync("db-check.txt", lines.join("\n"));
}

main().catch((e) => {
  writeFileSync("db-check.txt", String(e));
  process.exit(1);
});
