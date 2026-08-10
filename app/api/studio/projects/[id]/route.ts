import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStudioUser } from "@/lib/studio/auth";

export async function PUT(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireStudioUser({ content: true });
  if ("error" in auth) return auth.error;

  const { id } = await ctx.params;
  const body = await request.json();
  const sb = createAdminClient();

  const {
    project_i18n,
    id: _id,
    created_at: _c,
    ...project
  } = body as Record<string, unknown> & { project_i18n?: Array<Record<string, unknown>> };

  const { error } = await sb
    .from("projects")
    .update({ ...project, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (Array.isArray(project_i18n)) {
    for (const row of project_i18n) {
      const { id: i18nId, ...rest } = row;
      if (i18nId) {
        await sb.from("project_i18n").update(rest).eq("id", i18nId);
      } else {
        await sb.from("project_i18n").upsert(
          { ...rest, project_id: id },
          { onConflict: "project_id,locale" },
        );
      }
    }
  }

  return NextResponse.json({ ok: true });
}
