import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStudioUser } from "@/lib/studio/auth";
import {
  ApiInputError,
  apiError,
  optionalString,
  optionalUuid,
  readJsonObject,
  requiredString,
} from "@/lib/studio/api";
import { recordStudioMutation } from "@/lib/studio/audit";
import { requireCaseAccess } from "@/lib/studio/access";

export async function GET(request: NextRequest) {
  const auth = await requireStudioUser({ capability: "cases.read" });
  if ("error" in auth) return auth.error;
  const caseId = request.nextUrl.searchParams.get("caseId");
  if (!caseId) return NextResponse.json({ error: "caseId is required" }, { status: 400 });
  const sb = createAdminClient();
  const denied = await requireCaseAccess(sb, auth, caseId);
  if (denied) return denied;
  const { data, error } = await sb
    .from("case_documents")
    .select("*, document_versions(*)")
    .eq("case_id", caseId)
    .order("updated_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const auth = await requireStudioUser({ capability: "documents.manage" });
  if ("error" in auth) return auth.error;
  try {
    const body = await readJsonObject(request);
    const caseId = optionalUuid(body.caseId, "caseId");
    if (!caseId) throw new ApiInputError("caseId is required");
    const sb = createAdminClient();
    const denied = await requireCaseAccess(sb, auth, caseId);
    if (denied) return denied;
    const { data: document, error } = await sb
      .from("case_documents")
      .insert({
        case_id: caseId,
        title: requiredString(body.title, "title", 300),
        document_type: optionalString(body.documentType, "documentType", 100) || "document",
        current_version: 1,
        created_by: auth.id,
      })
      .select("*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const { data: version, error: versionError } = await sb
      .from("document_versions")
      .insert({
        document_id: document.id,
        version: 1,
        body: optionalString(body.body, "body", 1000000),
        file_id: optionalUuid(body.fileId, "fileId") ?? null,
        change_summary: "Initial version",
        created_by: auth.id,
      })
      .select("*")
      .single();
    if (versionError) {
      await sb.from("case_documents").delete().eq("id", document.id);
      return NextResponse.json({ error: versionError.message }, { status: 400 });
    }
    await recordStudioMutation(sb, {
      actorId: auth.id,
      action: "document.create",
      entity: "case_documents",
      entityId: document.id,
      caseEvent: {
        caseId,
        eventType: "document.created",
        entityType: "case_documents",
        entityId: document.id,
        payload: { title: document.title },
      },
    });
    return NextResponse.json({ ...document, versions: [version] }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
