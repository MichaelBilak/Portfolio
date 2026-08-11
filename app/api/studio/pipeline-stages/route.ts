import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStudioUser } from "@/lib/studio/auth";
import {
  ApiInputError,
  apiError,
  optionalString,
  readJsonObject,
  requiredString,
} from "@/lib/studio/api";
import { writeAuditLog } from "@/lib/studio/audit";

export async function GET() {
  const auth = await requireStudioUser({ capability: "cases.read" });
  if ("error" in auth) return auth.error;
  const { data, error } = await createAdminClient()
    .from("pipeline_stages")
    .select("*")
    .order("sort_order");
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const auth = await requireStudioUser({ capability: "settings.manage" });
  if ("error" in auth) return auth.error;
  try {
    const body = await readJsonObject(request);
    const key = requiredString(body.key, "key", 60).toLowerCase();
    if (!/^[a-z0-9][a-z0-9_-]*$/.test(key)) throw new ApiInputError("key is invalid");
    const sb = createAdminClient();
    const { data, error } = await sb
      .from("pipeline_stages")
      .insert({
        key,
        name: requiredString(body.name, "name", 100),
        color: optionalString(body.color, "color", 30) || "#64748b",
        sort_order: typeof body.sortOrder === "number" ? body.sortOrder : 0,
        is_closed: body.isClosed === true,
        is_won: body.isWon === true,
      })
      .select("*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    await writeAuditLog(sb, {
      actorId: auth.id,
      action: "pipeline_stage.create",
      entity: "pipeline_stages",
      entityId: data.id,
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireStudioUser({ capability: "settings.manage" });
  if ("error" in auth) return auth.error;
  try {
    const body = await readJsonObject(request);
    const id = requiredString(body.id, "id", 36);
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if ("name" in body) patch.name = requiredString(body.name, "name", 100);
    if ("color" in body) patch.color = requiredString(body.color, "color", 30);
    if ("sortOrder" in body) {
      if (typeof body.sortOrder !== "number") throw new ApiInputError("sortOrder must be a number");
      patch.sort_order = body.sortOrder;
    }
    if ("isClosed" in body) {
      if (typeof body.isClosed !== "boolean") throw new ApiInputError("isClosed must be boolean");
      patch.is_closed = body.isClosed;
    }
    if ("isWon" in body) {
      if (typeof body.isWon !== "boolean") throw new ApiInputError("isWon must be boolean");
      patch.is_won = body.isWon;
    }
    if (Object.keys(patch).length === 1) throw new ApiInputError("No supported fields supplied");
    const sb = createAdminClient();
    const { data, error } = await sb
      .from("pipeline_stages")
      .update(patch)
      .eq("id", id)
      .select("*")
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (!data) return NextResponse.json({ error: "Stage not found" }, { status: 404 });
    await writeAuditLog(sb, {
      actorId: auth.id,
      action: "pipeline_stage.update",
      entity: "pipeline_stages",
      entityId: id,
    });
    return NextResponse.json(data);
  } catch (error) {
    return apiError(error);
  }
}
