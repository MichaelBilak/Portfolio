import { createHash, randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStudioUser } from "@/lib/studio/auth";
import {
  ApiInputError,
  apiError,
  oneOf,
  optionalString,
  optionalUuid,
  positiveInteger,
  readJsonObject,
  requiredString,
} from "@/lib/studio/api";
import { recordStudioMutation } from "@/lib/studio/audit";
import { requireCaseAccess } from "@/lib/studio/access";

export async function GET(request: NextRequest) {
  const auth = await requireStudioUser({ capability: "documents.manage" });
  if ("error" in auth) return auth.error;
  const caseId = request.nextUrl.searchParams.get("caseId");
  if (!caseId) return NextResponse.json({ error: "caseId is required" }, { status: 400 });
  const sb = createAdminClient();
  const denied = await requireCaseAccess(sb, auth, caseId);
  if (denied) return denied;
  const [tokens, approvals] = await Promise.all([
    sb
      .from("client_portal_tokens")
      .select("id,case_id,label,expires_at,revoked_at,last_used_at,created_at")
      .eq("case_id", caseId)
      .order("created_at", { ascending: false }),
    sb
      .from("client_approvals")
      .select("*")
      .eq("case_id", caseId)
      .order("created_at", { ascending: false }),
  ]);
  const error = tokens.error || approvals.error;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ tokens: tokens.data, approvals: approvals.data });
}

export async function POST(request: NextRequest) {
  const auth = await requireStudioUser({ capability: "documents.manage" });
  if ("error" in auth) return auth.error;
  try {
    const body = await readJsonObject(request);
    const caseId = optionalUuid(body.caseId, "caseId");
    if (!caseId) throw new ApiInputError("caseId is required");
    const action = requiredString(body.action, "action", 30);
    const sb = createAdminClient();
    const denied = await requireCaseAccess(sb, auth, caseId);
    if (denied) return denied;
    if (action === "token") {
      const rawToken = randomBytes(32).toString("base64url");
      const tokenHash = createHash("sha256").update(rawToken).digest("hex");
      const expiresInDays =
        body.expiresInDays === undefined
          ? 14
          : positiveInteger(body.expiresInDays, "expiresInDays", 90);
      const { data, error } = await sb
        .from("client_portal_tokens")
        .insert({
          case_id: caseId,
          token_hash: tokenHash,
          label: optionalString(body.label, "label", 200),
          expires_at: new Date(Date.now() + expiresInDays * 86_400_000).toISOString(),
          created_by: auth.id,
        })
        .select("id,case_id,label,expires_at,created_at")
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      await recordStudioMutation(sb, {
        actorId: auth.id,
        action: "portal.token_create",
        entity: "client_portal_tokens",
        entityId: data.id,
        caseEvent: { caseId, eventType: "portal.token_created", entityId: data.id },
      });
      return NextResponse.json({ ...data, token: rawToken }, { status: 201 });
    }
    if (action === "approval") {
      const { data, error } = await sb
        .from("client_approvals")
        .insert({
          case_id: caseId,
          document_id: optionalUuid(body.documentId, "documentId") ?? null,
          requested_by: auth.id,
          client_name: optionalString(body.clientName, "clientName", 300),
          client_email: optionalString(body.clientEmail, "clientEmail", 320),
        })
        .select("*")
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      await recordStudioMutation(sb, {
        actorId: auth.id,
        action: "portal.approval_request",
        entity: "client_approvals",
        entityId: data.id,
        caseEvent: { caseId, eventType: "portal.approval_requested", entityId: data.id },
      });
      return NextResponse.json(data, { status: 201 });
    }
    throw new ApiInputError("action must be token or approval");
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireStudioUser({ capability: "documents.manage" });
  if ("error" in auth) return auth.error;
  try {
    const body = await readJsonObject(request);
    const action = requiredString(body.action, "action", 30);
    const id = requiredString(body.id, "id", 36);
    const sb = createAdminClient();
    if (action === "revoke-token") {
      const { data: token, error: tokenError } = await sb
        .from("client_portal_tokens")
        .select("case_id")
        .eq("id", id)
        .maybeSingle();
      if (tokenError) return NextResponse.json({ error: tokenError.message }, { status: 400 });
      if (!token) return NextResponse.json({ error: "Token not found" }, { status: 404 });
      const denied = await requireCaseAccess(sb, auth, token.case_id, "Token");
      if (denied) return denied;
      const { data, error } = await sb
        .from("client_portal_tokens")
        .update({ revoked_at: new Date().toISOString() })
        .eq("id", id)
        .select("id,case_id,revoked_at")
        .maybeSingle();
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      if (!data) return NextResponse.json({ error: "Token not found" }, { status: 404 });
      return NextResponse.json(data);
    }
    if (action === "approval-response") {
      const { data: approval, error: approvalError } = await sb
        .from("client_approvals")
        .select("case_id")
        .eq("id", id)
        .maybeSingle();
      if (approvalError) {
        return NextResponse.json({ error: approvalError.message }, { status: 400 });
      }
      if (!approval) return NextResponse.json({ error: "Approval not found" }, { status: 404 });
      const denied = await requireCaseAccess(sb, auth, approval.case_id, "Approval");
      if (denied) return denied;
      const status = oneOf(body.status, "status", ["approved", "rejected"] as const);
      const { data, error } = await sb
        .from("client_approvals")
        .update({
          status,
          comment: optionalString(body.comment, "comment", 5000),
          responded_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select("*")
        .maybeSingle();
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      if (!data) return NextResponse.json({ error: "Approval not found" }, { status: 404 });
      return NextResponse.json(data);
    }
    throw new ApiInputError("Unsupported action");
  } catch (error) {
    return apiError(error);
  }
}
