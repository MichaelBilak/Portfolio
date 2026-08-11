import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStudioUser } from "@/lib/studio/auth";
import { ApiInputError, apiError, pageParams, readJsonObject, requiredString } from "@/lib/studio/api";

export async function GET(request: NextRequest) {
  const auth = await requireStudioUser();
  if ("error" in auth) return auth.error;
  const { limit, offset } = pageParams(request);
  let query = createAdminClient()
    .from("notifications")
    .select("*")
    .eq("recipient_id", auth.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (request.nextUrl.searchParams.get("unread") === "true") query = query.is("read_at", null);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const auth = await requireStudioUser();
  if ("error" in auth) return auth.error;
  try {
    const body = await readJsonObject(request);
    const sb = createAdminClient();
    if (body.all === true) {
      const { error } = await sb
        .from("notifications")
        .update({ read_at: new Date().toISOString() })
        .eq("recipient_id", auth.id)
        .is("read_at", null);
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ ok: true });
    }
    const id = requiredString(body.id, "id", 36);
    if ("read" in body && typeof body.read !== "boolean") {
      throw new ApiInputError("read must be boolean");
    }
    const { data, error } = await sb
      .from("notifications")
      .update({ read_at: body.read === false ? null : new Date().toISOString() })
      .eq("id", id)
      .eq("recipient_id", auth.id)
      .select("*")
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (!data) return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    return NextResponse.json(data);
  } catch (error) {
    return apiError(error);
  }
}
