import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStudioUser } from "@/lib/studio/auth";

export async function PUT(request: NextRequest) {
  const auth = await requireStudioUser({ content: true });
  if ("error" in auth) return auth.error;

  const locale = request.nextUrl.searchParams.get("locale");
  const section = request.nextUrl.searchParams.get("section");
  if (!locale || !section) {
    return NextResponse.json({ error: "locale and section required" }, { status: 400 });
  }

  const data = await request.json();
  const sb = createAdminClient();
  const { error } = await sb.from("site_copy").upsert(
    {
      locale,
      section,
      data,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "locale,section" },
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
