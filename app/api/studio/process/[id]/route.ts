import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStudioUser } from "@/lib/studio/auth";

export async function PUT(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireStudioUser({ content: true });
  if ("error" in auth) return auth.error;
  const { id } = await ctx.params;
  const body = await request.json();
  const sb = createAdminClient();
  const { process_step_i18n, id: _i, ...step } = body;
  await sb.from("process_steps").update(step).eq("id", id);
  if (Array.isArray(process_step_i18n)) {
    for (const row of process_step_i18n) {
      const { id: rid, ...rest } = row;
      if (rid) await sb.from("process_step_i18n").update(rest).eq("id", rid);
      else await sb.from("process_step_i18n").upsert({ ...rest, step_id: id }, { onConflict: "step_id,locale" });
    }
  }
  return NextResponse.json({ ok: true });
}
