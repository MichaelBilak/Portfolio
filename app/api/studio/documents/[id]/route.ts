import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStudioUser } from "@/lib/studio/auth";
import {
  ApiInputError,
  apiError,
  oneOf,
  optionalString,
  optionalUuid,
  readJsonObject,
  requiredString,
} from "@/lib/studio/api";
import { recordStudioMutation } from "@/lib/studio/audit";
import { requireCaseAccess } from "@/lib/studio/access";

const statuses = ["draft", "review", "approved", "archived"] as const;

export async function GET(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireStudioUser({ capability: "cases.read" });
  if ("error" in auth) return auth.error;
  const { id } = await ctx.params;
  const sb = createAdminClient();
  const { data: document, error: documentError } = await sb
    .from("case_documents")
    .select("case_id")
    .eq("id", id)
    .maybeSingle();
  if (documentError) return NextResponse.json({ error: documentError.message }, { status: 400 });
  if (!document) return NextResponse.json({ error: "Document not found" }, { status: 404 });
  const denied = await requireCaseAccess(sb, auth, document.case_id, "Document");
  if (denied) return denied;
  const { data, error } = await sb
    .from("case_documents")
    .select("*, document_versions(*), document_comments(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (!data) return NextResponse.json({ error: "Document not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireStudioUser({ capability: "documents.manage" });
  if ("error" in auth) return auth.error;
  try {
    const { id } = await ctx.params;
    const body = await readJsonObject(request);
    const action = typeof body.action === "string" ? body.action : "update";
    const sb = createAdminClient();
    const { data: document } = await sb
      .from("case_documents")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (!document) return NextResponse.json({ error: "Document not found" }, { status: 404 });
    const denied = await requireCaseAccess(sb, auth, document.case_id, "Document");
    if (denied) return denied;

    let result: unknown;
    let eventType = "document.updated";
    if (action === "version") {
      const version = Number(document.current_version) + 1;
      const { data, error } = await sb
        .from("document_versions")
        .insert({
          document_id: id,
          version,
          body: optionalString(body.body, "body", 1000000),
          file_id: optionalUuid(body.fileId, "fileId") ?? null,
          change_summary: optionalString(body.changeSummary, "changeSummary", 1000),
          created_by: auth.id,
        })
        .select("*")
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      const { error: documentUpdateError } = await sb
        .from("case_documents")
        .update({ current_version: version, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (documentUpdateError) {
        await sb.from("document_versions").delete().eq("id", data.id);
        return NextResponse.json({ error: documentUpdateError.message }, { status: 400 });
      }
      result = data;
      eventType = "document.version_created";
    } else if (action === "comment") {
      const { data, error } = await sb
        .from("document_comments")
        .insert({
          document_id: id,
          version_id: optionalUuid(body.versionId, "versionId") ?? null,
          author_id: auth.id,
          body: requiredString(body.body, "body", 10000),
          anchor:
            body.anchor && typeof body.anchor === "object" && !Array.isArray(body.anchor)
              ? body.anchor
              : null,
        })
        .select("*")
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      result = data;
      eventType = "document.commented";
    } else if (action === "update") {
      const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if ("title" in body) patch.title = requiredString(body.title, "title", 300);
      if ("status" in body) patch.status = oneOf(body.status, "status", statuses);
      if (Object.keys(patch).length === 1) throw new ApiInputError("No supported fields supplied");
      const { data, error } = await sb
        .from("case_documents")
        .update(patch)
        .eq("id", id)
        .select("*")
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      result = data;
      eventType = body.status === "approved" ? "document.approved" : "document.updated";
    } else {
      throw new ApiInputError("Unsupported action");
    }

    await recordStudioMutation(sb, {
      actorId: auth.id,
      action: eventType,
      entity: "case_documents",
      entityId: id,
      caseEvent: {
        caseId: document.case_id,
        eventType,
        entityType: "case_documents",
        entityId: id,
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    return apiError(error);
  }
}
