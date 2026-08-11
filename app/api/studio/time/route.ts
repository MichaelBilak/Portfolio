import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStudioUser, hasStudioCapability } from "@/lib/studio/auth";
import {
  ApiInputError,
  apiError,
  optionalString,
  optionalUuid,
  pageParams,
  positiveInteger,
  readJsonObject,
} from "@/lib/studio/api";
import { recordStudioMutation } from "@/lib/studio/audit";
import { getAccessibleCaseIds, requireCaseAccess } from "@/lib/studio/access";

export async function GET(request: NextRequest) {
  const auth = await requireStudioUser({ capability: "cases.read" });
  if ("error" in auth) return auth.error;
  const { limit, offset } = pageParams(request);
  const sb = createAdminClient();
  const caseId = request.nextUrl.searchParams.get("caseId");
  if (caseId) {
    const denied = await requireCaseAccess(sb, auth, caseId);
    if (denied) return denied;
  }
  const accessibleCaseIds = await getAccessibleCaseIds(sb, auth);
  if (!caseId && accessibleCaseIds?.length === 0) return NextResponse.json([]);
  let query = sb
    .from("time_entries")
    .select("*, profiles(id,name), cases(id,case_number,title), tasks(id,title)")
    .order("entry_date", { ascending: false })
    .range(offset, offset + limit - 1);
  const profileId = request.nextUrl.searchParams.get("profileId");
  if (caseId) query = query.eq("case_id", caseId);
  else if (accessibleCaseIds) query = query.in("case_id", accessibleCaseIds);
  if (profileId && hasStudioCapability(auth.role, "reports.read")) query = query.eq("profile_id", profileId);
  else if (!hasStudioCapability(auth.role, "reports.read")) query = query.eq("profile_id", auth.id);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const auth = await requireStudioUser({ capability: "time.manage" });
  if ("error" in auth) return auth.error;
  try {
    const body = await readJsonObject(request);
    const caseId = optionalUuid(body.caseId, "caseId");
    if (!caseId) throw new ApiInputError("caseId is required");
    const profileId = optionalUuid(body.profileId, "profileId");
    if (profileId && profileId !== auth.id && !hasStudioCapability(auth.role, "finance.manage")) {
      return NextResponse.json({ error: "Cannot create time for another user" }, { status: 403 });
    }
    const sb = createAdminClient();
    const denied = await requireCaseAccess(sb, auth, caseId);
    if (denied) return denied;
    const { data, error } = await sb
      .from("time_entries")
      .insert({
        case_id: caseId,
        task_id: optionalUuid(body.taskId, "taskId") ?? null,
        profile_id: profileId ?? auth.id,
        entry_date: optionalString(body.entryDate, "entryDate", 10) || new Date().toISOString().slice(0, 10),
        minutes: positiveInteger(body.minutes, "minutes", 1440),
        description: optionalString(body.description, "description", 2000),
        billable: typeof body.billable === "boolean" ? body.billable : true,
        hourly_rate:
          typeof body.hourlyRate === "number" && Number.isFinite(body.hourlyRate)
            ? body.hourlyRate
            : null,
      })
      .select("*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    await recordStudioMutation(sb, {
      actorId: auth.id,
      action: "time.create",
      entity: "time_entries",
      entityId: data.id,
      caseEvent: {
        caseId,
        eventType: "time.logged",
        entityType: "time_entries",
        entityId: data.id,
        payload: { minutes: data.minutes },
      },
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
