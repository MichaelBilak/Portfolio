import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStudioUser } from "@/lib/studio/auth";

export async function PUT(request: NextRequest) {
  const auth = await requireStudioUser({ content: true });
  if ("error" in auth) return auth.error;
  const locale = request.nextUrl.searchParams.get("locale");
  if (!locale) return NextResponse.json({ error: "locale required" }, { status: 400 });
  const body = await request.json();
  const sb = createAdminClient();
  const { id: _id, ...rest } = body;
  const { error } = await sb.from("seo_defaults").upsert(
    { ...rest, locale, updated_at: new Date().toISOString() },
    { onConflict: "locale" },
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
