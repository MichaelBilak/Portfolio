import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStudioUser } from "@/lib/studio/auth";
import {
  apiError,
  optionalString,
  optionalUuid,
  pageParams,
  readJsonObject,
  requiredString,
} from "@/lib/studio/api";
import { appendCaseEvent, writeAuditLog } from "@/lib/studio/audit";
import { requireCaseAccess } from "@/lib/studio/access";

export async function GET(request: NextRequest) {
  const auth = await requireStudioUser({ capability: "cases.read" });
  if ("error" in auth) return auth.error;
  const caseId = request.nextUrl.searchParams.get("caseId");
  if (!caseId) return NextResponse.json({ error: "caseId is required" }, { status: 400 });
  const { limit, offset } = pageParams(request);
  const sb = createAdminClient();
  const denied = await requireCaseAccess(sb, auth, caseId);
  if (denied) return denied;
  const { data, error } = await sb
    .from("case_events")
    .select("*, profiles(id,name)")
    .eq("case_id", caseId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const auth = await requireStudioUser({ capability: "cases.update" });
  if ("error" in auth) return auth.error;
  try {
    const body = await readJsonObject(request);
    const caseId = optionalUuid(body.caseId, "caseId");
    if (!caseId) return NextResponse.json({ error: "caseId is required" }, { status: 400 });
    const eventType = requiredString(body.eventType, "eventType", 100);
    if (!eventType.startsWith("manual.")) {
      return NextResponse.json({ error: "Custom eventType must start with manual." }, { status: 400 });
    }
    const sb = createAdminClient();
    const denied = await requireCaseAccess(sb, auth, caseId);
    if (denied) return denied;
    await Promise.all([
      appendCaseEvent(sb, {
        caseId,
        actorId: auth.id,
        eventType,
        entityType: optionalString(body.entityType, "entityType", 100),
        entityId: optionalString(body.entityId, "entityId", 100),
        payload:
          body.payload && typeof body.payload === "object" && !Array.isArray(body.payload)
            ? (body.payload as Record<string, unknown>)
            : {},
      }),
      writeAuditLog(sb, {
        actorId: auth.id,
        action: "case.event.append",
        entity: "cases",
        entityId: caseId,
        meta: { eventType },
      }),
    ]);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
