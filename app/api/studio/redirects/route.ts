import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStudioUser } from "@/lib/studio/auth";

export async function PUT(request: NextRequest) {
  const auth = await requireStudioUser({ content: true });
  if ("error" in auth) return auth.error;

  const { rows } = (await request.json()) as {
    rows: Array<{
      id?: string;
      from_path: string;
      to_path: string;
      permanent: boolean;
      enabled: boolean;
    }>;
  };

  const sb = createAdminClient();
  const { data: existing } = await sb.from("redirects").select("id");
  const keepIds = new Set(rows.filter((r) => r.id).map((r) => r.id));
  for (const row of existing || []) {
    if (!keepIds.has(row.id)) await sb.from("redirects").delete().eq("id", row.id);
  }

  for (const row of rows) {
    if (row.id) {
      await sb
        .from("redirects")
        .update({
          from_path: row.from_path,
          to_path: row.to_path,
          permanent: row.permanent,
          enabled: row.enabled,
        })
        .eq("id", row.id);
    } else {
      await sb.from("redirects").insert({
        from_path: row.from_path,
        to_path: row.to_path,
        permanent: row.permanent,
        enabled: row.enabled,
      });
    }
  }

  return NextResponse.json({ ok: true });
}
