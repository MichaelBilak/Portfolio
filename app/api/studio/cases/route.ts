import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStudioUser } from "@/lib/studio/auth";
import {
  apiError,
  oneOf,
  optionalString,
  optionalUuid,
  pageParams,
  readJsonObject,
  requiredString,
} from "@/lib/studio/api";
import { recordStudioMutation } from "@/lib/studio/audit";
import { getAccessibleCaseIds } from "@/lib/studio/access";

const priorities = ["low", "normal", "high", "urgent"] as const;

export async function GET(request: NextRequest) {
  const auth = await requireStudioUser({ capability: "cases.read" });
  if ("error" in auth) return auth.error;

  const { limit, offset } = pageParams(request);
  const sb = createAdminClient();
  const accessibleCaseIds = await getAccessibleCaseIds(sb, auth);
  if (accessibleCaseIds?.length === 0) return NextResponse.json([]);
  let query = sb
    .from("cases")
    .select("*, pipeline_stages(id,key,name,color), profiles!cases_owner_id_fkey(id,name)")
    .is("archived_at", null)
    .order("updated_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (accessibleCaseIds) query = query.in("id", accessibleCaseIds);

  const stageId = request.nextUrl.searchParams.get("stageId");
  const ownerId = request.nextUrl.searchParams.get("ownerId");
  const search = request.nextUrl.searchParams.get("q")?.trim();
  if (stageId) query = query.eq("stage_id", stageId);
  if (ownerId) query = query.eq("owner_id", ownerId);
  if (search) {
    const safe = search.replace(/[%_,()]/g, " ").slice(0, 100);
    query = query.or(`title.ilike.%${safe}%,client_name.ilike.%${safe}%,company_name.ilike.%${safe}%`);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const auth = await requireStudioUser({ capability: "cases.create" });
  if ("error" in auth) return auth.error;

  try {
    const body = await readJsonObject(request);
    const sb = createAdminClient();
    let stageId = optionalUuid(body.stageId, "stageId");
    if (!stageId) {
      const { data: defaultStage } = await sb
        .from("pipeline_stages")
        .select("id")
        .eq("key", "intake")
        .maybeSingle();
      stageId = defaultStage?.id;
    }
    const ownerId = optionalUuid(body.ownerId, "ownerId") ?? auth.id;
    const insert = {
      title: requiredString(body.title, "title", 300),
      description: optionalString(body.description, "description", 20000),
      stage_id: stageId ?? null,
      owner_id: ownerId,
      client_name: optionalString(body.clientName, "clientName", 300),
      client_email: optionalString(body.clientEmail, "clientEmail", 320),
      company_name: optionalString(body.companyName, "companyName", 300),
      priority: oneOf(body.priority, "priority", priorities, "normal"),
      estimated_value:
        typeof body.estimatedValue === "number" && Number.isFinite(body.estimatedValue)
          ? body.estimatedValue
          : null,
      due_date: optionalString(body.dueDate, "dueDate", 10),
      tags: Array.isArray(body.tags)
        ? body.tags.filter((tag): tag is string => typeof tag === "string").slice(0, 30)
        : [],
      created_by: auth.id,
    };
    const { data, error } = await sb.from("cases").insert(insert).select("*").single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const members = Array.from(new Set([auth.id, ownerId])).map((profileId) => ({
      case_id: data.id,
      profile_id: profileId,
      member_role: profileId === auth.id ? "creator" : "owner",
      added_by: auth.id,
    }));
    const { error: membershipError } = await sb.from("case_members").upsert(members);
    if (membershipError) {
      await sb.from("cases").delete().eq("id", data.id);
      return NextResponse.json({ error: membershipError.message }, { status: 400 });
    }
    await recordStudioMutation(sb, {
      actorId: auth.id,
      action: "case.create",
      entity: "cases",
      entityId: data.id,
      caseEvent: { caseId: data.id, eventType: "case.created", payload: { title: data.title } },
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
