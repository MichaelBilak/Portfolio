import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStudioUser } from "@/lib/studio/auth";

export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireStudioUser({ leads: true });
  if ("error" in auth) return auth.error;

  const { id } = await ctx.params;
  const body = (await request.json()) as {
    status?: string;
    priority?: string;
    note?: string;
  };

  const sb = createAdminClient();

  if (body.status || body.priority) {
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (body.status) patch.status = body.status;
    if (body.priority) patch.priority = body.priority;
    const { error } = await sb.from("leads").update(patch).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (body.note?.trim()) {
    const { error } = await sb.from("lead_notes").insert({
      lead_id: id,
      author_id: auth.id,
      body: body.note.trim(),
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
