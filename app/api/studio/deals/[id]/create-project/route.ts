import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStudioUser } from "@/lib/studio/auth";
import { apiError, optionalString, readJsonObject } from "@/lib/studio/api";
import { recordStudioMutation } from "@/lib/studio/audit";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireStudioUser({
    capabilities: ["deals.read", "projects.manage"],
  });
  if ("error" in auth) return auth.error;

  try {
    const { id } = await context.params;
    const body = await readJsonObject(request);
    const unknown = Object.keys(body).filter((key) => key !== "name");
    if (unknown.length) {
      return NextResponse.json(
        { error: `Unknown fields: ${unknown.join(", ")}` },
        { status: 400 },
      );
    }

    const name = optionalString(body.name, "name", 300) ?? null;
    const sb = createAdminClient();
    const { data: projectId, error: conversionError } = await sb.rpc(
      "convert_won_deal_to_project",
      { p_deal_id: id, p_actor_id: auth.id, p_name: name },
    );
    if (conversionError) {
      const status = conversionError.code === "P0002" ? 404 : 400;
      return NextResponse.json({ error: conversionError.message }, { status });
    }

    const { data: project, error } = await sb
      .from("client_projects")
      .select("*")
      .eq("id", projectId)
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    await recordStudioMutation(sb, {
      actorId: auth.id,
      action: "client_project.create",
      entity: "client_projects",
      entityId: project.id,
      meta: { dealId: id },
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
