import { randomUUID } from "node:crypto";
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

const bucket = "crm-private";

export async function GET(request: NextRequest) {
  const auth = await requireStudioUser({ capability: "cases.read" });
  if ("error" in auth) return auth.error;
  const sb = createAdminClient();
  const fileId = request.nextUrl.searchParams.get("fileId");
  if (fileId) {
    const { data: file, error } = await sb
      .from("case_files")
      .select("*")
      .eq("id", fileId)
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (!file) return NextResponse.json({ error: "File not found" }, { status: 404 });
    const denied = await requireCaseAccess(sb, auth, file.case_id, "File");
    if (denied) return denied;
    const { data, error: signedError } = await sb.storage
      .from(file.bucket)
      .createSignedUrl(file.path, 300, { download: file.file_name });
    if (signedError) return NextResponse.json({ error: signedError.message }, { status: 400 });
    return NextResponse.json({ file, signedUrl: data.signedUrl, expiresIn: 300 });
  }
  const caseId = request.nextUrl.searchParams.get("caseId");
  if (!caseId) return NextResponse.json({ error: "caseId or fileId is required" }, { status: 400 });
  const denied = await requireCaseAccess(sb, auth, caseId);
  if (denied) return denied;
  const { data, error } = await sb
    .from("case_files")
    .select("*")
    .eq("case_id", caseId)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const auth = await requireStudioUser({ capability: "files.manage" });
  if ("error" in auth) return auth.error;
  try {
    const body = await readJsonObject(request);
    const caseId = optionalUuid(body.caseId, "caseId");
    if (!caseId) throw new ApiInputError("caseId is required");
    const fileName = requiredString(body.fileName, "fileName", 255);
    const mimeType = optionalString(body.mimeType, "mimeType", 200);
    const sizeBytes =
      typeof body.sizeBytes === "number" && Number.isInteger(body.sizeBytes) && body.sizeBytes >= 0
        ? body.sizeBytes
        : null;
    if (sizeBytes !== null && sizeBytes > 50 * 1024 * 1024) {
      throw new ApiInputError("File exceeds the 50 MB limit");
    }
    const sb = createAdminClient();
    const denied = await requireCaseAccess(sb, auth, caseId);
    if (denied) return denied;

    if (body.action === "complete") {
      const path = requiredString(body.path, "path", 700);
      if (!path.startsWith(`${caseId}/`) || path.includes("..")) {
        throw new ApiInputError("path is invalid");
      }
      const separator = path.lastIndexOf("/");
      const directory = path.slice(0, separator);
      const objectName = path.slice(separator + 1);
      const { data: uploadedObjects, error: storageError } = await sb.storage
        .from(bucket)
        .list(directory, { search: objectName, limit: 10 });
      if (storageError) {
        return NextResponse.json({ error: storageError.message }, { status: 400 });
      }
      if (!uploadedObjects?.some((item) => item.name === objectName)) {
        throw new ApiInputError("Uploaded object was not found");
      }
      const { data: file, error } = await sb
        .from("case_files")
        .insert({
          case_id: caseId,
          bucket,
          path,
          file_name: fileName,
          mime_type: mimeType,
          size_bytes: sizeBytes,
          category: optionalString(body.category, "category", 100),
          uploaded_by: auth.id,
          metadata:
            body.metadata && typeof body.metadata === "object" && !Array.isArray(body.metadata)
              ? body.metadata
              : {},
        })
        .select("*")
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      await recordStudioMutation(sb, {
        actorId: auth.id,
        action: "file.upload",
        entity: "case_files",
        entityId: file.id,
        caseEvent: {
          caseId,
          eventType: "file.uploaded",
          entityType: "case_files",
          entityId: file.id,
          payload: { fileName },
        },
      });
      return NextResponse.json(file, { status: 201 });
    }

    const extension = fileName.includes(".")
      ? `.${fileName.split(".").pop()?.replace(/[^a-z0-9]/gi, "").slice(0, 10)}`
      : "";
    const path = `${caseId}/${new Date().getUTCFullYear()}/${randomUUID()}${extension}`;
    const { data: signed, error: signedError } = await sb.storage
      .from(bucket)
      .createSignedUploadUrl(path);
    if (signedError) return NextResponse.json({ error: signedError.message }, { status: 400 });
    return NextResponse.json(
      { bucket, path, fileName, mimeType, sizeBytes, signedUrl: signed.signedUrl, token: signed.token },
    );
  } catch (error) {
    return apiError(error);
  }
}
