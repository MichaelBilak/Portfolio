import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStudioUser } from "@/lib/studio/auth";

export async function PUT(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireStudioUser({ content: true });
  if ("error" in auth) return auth.error;
  const { id } = await ctx.params;
  const body = await request.json();
  const sb = createAdminClient();
  const { before_after_i18n, id: _i, ...row } = body;
  await sb.from("before_after_cases").update(row).eq("id", id);
  if (Array.isArray(before_after_i18n)) {
    for (const r of before_after_i18n) {
      const { id: rid, ...rest } = r;
      if (rid) await sb.from("before_after_i18n").update(rest).eq("id", rid);
      else await sb.from("before_after_i18n").upsert({ ...rest, case_id: id }, { onConflict: "case_id,locale" });
    }
  }
  return NextResponse.json({ ok: true });
}
