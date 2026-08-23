import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStudioUser } from "@/lib/studio/auth";
import { apiError, optionalString, optionalUuid, readJsonObject } from "@/lib/studio/api";
import { recordStudioMutation } from "@/lib/studio/audit";
import { appendLeadEvent } from "@/lib/studio/leads";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireStudioUser({
    capabilities: ["leads.manage", "deals.manage"],
  });
  if ("error" in auth) return auth.error;

  try {
    const { id } = await context.params;
    const body = await readJsonObject(request);
    const unknown = Object.keys(body).filter((key) => !["title", "estimatedValue", "currency", "ownerId"].includes(key));
    if (unknown.length) {
      return NextResponse.json(
        { error: `Unknown fields: ${unknown.join(", ")}` },
        { status: 400 },
      );
    }

    const title = optionalString(body.title, "title", 300) ?? null;
    const ownerId = optionalUuid(body.ownerId, "ownerId");
    const sb = createAdminClient();
    const estimatedValue = body.estimatedValue === undefined ? undefined : Number(body.estimatedValue);
    if (estimatedValue !== undefined && (!Number.isFinite(estimatedValue) || estimatedValue < 0)) {
      return NextResponse.json({ error: "estimatedValue must be a non-negative number" }, { status: 400 });
    }
    const currency = optionalString(body.currency, "currency", 3)?.toUpperCase();
    if (currency && !/^[A-Z]{3}$/.test(currency)) {
      return NextResponse.json({ error: "currency must be a 3-letter code" }, { status: 400 });
    }
    if (estimatedValue !== undefined || currency) {
      const { error: leadUpdateError } = await sb.from("leads").update({
        ...(estimatedValue !== undefined ? { estimated_value: estimatedValue, estimated_deal_value: estimatedValue } : {}),
        ...(currency ? { currency } : {}),
        updated_at: new Date().toISOString(),
      }).eq("id", id);
      if (leadUpdateError) return NextResponse.json({ error: leadUpdateError.message }, { status: 400 });
    }
    const { data: dealId, error: conversionError } = await sb.rpc("convert_lead_to_deal", {
      p_lead_id: id,
      p_actor_id: auth.id,
      p_title: title,
    });
    if (conversionError) {
      const status = conversionError.code === "P0002" ? 404 : 400;
      return NextResponse.json({ error: conversionError.message }, { status });
    }
    if (ownerId) {
      const { error: ownerError } = await sb.from("deals").update({ owner_id: ownerId }).eq("id", dealId);
      if (ownerError) return NextResponse.json({ error: ownerError.message }, { status: 400 });
    }

    const { data: deal, error } = await sb
      .from("deals")
      .select("*")
      .eq("id", dealId)
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    await Promise.all([
      appendLeadEvent(sb, {
        leadId: id,
        actorId: auth.id,
        eventType: "deal_created",
        payload: { dealId },
      }),
      recordStudioMutation(sb, {
        actorId: auth.id,
        action: "lead.create_deal",
        entity: "leads",
        entityId: id,
        meta: { dealId },
      }),
    ]);
    return NextResponse.json(deal, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
