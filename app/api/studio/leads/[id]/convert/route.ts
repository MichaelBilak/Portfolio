import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStudioUser } from "@/lib/studio/auth";
import { apiError, optionalString, optionalUuid, readJsonObject } from "@/lib/studio/api";
import { recordStudioMutation } from "@/lib/studio/audit";
import { appendLeadEvent } from "@/lib/studio/leads";

export async function POST(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireStudioUser({ capabilities: ["leads.manage", "cases.create"] });
  if ("error" in auth) return auth.error;

  try {
    const { id } = await ctx.params;
    const body = await readJsonObject(request);
    const sb = createAdminClient();
    const { data: lead, error: leadError } = await sb
      .from("leads")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (leadError) return NextResponse.json({ error: leadError.message }, { status: 400 });
    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

    const { data: existing } = await sb
      .from("cases")
      .select("id")
      .eq("lead_id", id)
      .maybeSingle();
    if (existing) return NextResponse.json({ error: "Lead already converted", caseId: existing.id }, { status: 409 });

    let stageId = optionalUuid(body.stageId, "stageId");
    if (!stageId) {
      const { data: stage } = await sb
        .from("pipeline_stages")
        .select("id")
        .eq("key", "intake")
        .maybeSingle();
      stageId = stage?.id;
    }
    const ownerId = optionalUuid(body.ownerId, "ownerId") ?? auth.id;
    const { data: createdCase, error } = await sb
      .from("cases")
      .insert({
        title:
          optionalString(body.title, "title", 300) ||
          lead.business_name ||
          lead.full_name ||
          `Lead ${id.slice(0, 8)}`,
        description: lead.brief,
        lead_id: id,
        stage_id: stageId ?? null,
        owner_id: ownerId,
        client_name: lead.full_name,
        client_email: lead.email,
        company_name: lead.business_name,
        metadata: { source: lead.source, selectedServices: lead.selected_services },
        created_by: auth.id,
      })
      .select("*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const members = Array.from(new Set([auth.id, ownerId])).map((profileId) => ({
      case_id: createdCase.id,
      profile_id: profileId,
      member_role: profileId === auth.id ? "creator" : "owner",
      added_by: auth.id,
    }));
    const { error: memberError } = await sb.from("case_members").upsert(members);
    if (memberError) {
      await sb.from("cases").delete().eq("id", createdCase.id);
      return NextResponse.json({ error: memberError.message }, { status: 400 });
    }
    const now = new Date().toISOString();
    const { error: leadUpdateError } = await sb
      .from("leads")
      .update({
        status: "won",
        closed_at: now,
        qualified_at: lead.qualified_at || now,
        updated_at: now,
      })
      .eq("id", id);
    if (leadUpdateError) {
      await sb.from("cases").delete().eq("id", createdCase.id);
      return NextResponse.json({ error: leadUpdateError.message }, { status: 400 });
    }
    await appendLeadEvent(sb, {
      leadId: id,
      actorId: auth.id,
      eventType: "converted",
      payload: { caseId: createdCase.id, ownerId, stageId },
    });
    await recordStudioMutation(sb, {
      actorId: auth.id,
      action: "lead.convert",
      entity: "leads",
      entityId: id,
      meta: { caseId: createdCase.id },
      caseEvent: {
        caseId: createdCase.id,
        eventType: "lead.converted",
        entityType: "leads",
        entityId: id,
      },
    });
    return NextResponse.json(createdCase, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
