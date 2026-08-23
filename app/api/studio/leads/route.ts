import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStudioUser } from "@/lib/studio/auth";
import {
  apiError,
  oneOf,
  optionalString,
  readJsonObject,
  requiredString,
} from "@/lib/studio/api";
import { recordStudioMutation } from "@/lib/studio/audit";
import {
  LEAD_PRIORITIES,
  LEAD_SELECT,
  LEAD_STATUSES,
  appendLeadEvent,
  applyLeadFilters,
  parseLeadListFilters,
} from "@/lib/studio/leads";

export async function GET(request: NextRequest) {
  const auth = await requireStudioUser({ leads: true });
  if ("error" in auth) return auth.error;

  const filters = parseLeadListFilters(request);
  const sb = createAdminClient();
  let query = sb
    .from("leads")
    .select(LEAD_SELECT, { count: "exact" })
    .order(filters.sort || "created_at", { ascending: filters.order === "asc" })
    .range(filters.offset, filters.offset + filters.limit - 1);

  query = applyLeadFilters(query, filters);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({
    items: data || [],
    total: count || 0,
    limit: filters.limit,
    offset: filters.offset,
  });
}

export async function POST(request: NextRequest) {
  const auth = await requireStudioUser({ leads: true });
  if ("error" in auth) return auth.error;

  try {
    const body = await readJsonObject(request);
    const sb = createAdminClient();
    const status = oneOf(body.status, "status", LEAD_STATUSES, "new")!;
    const priority = oneOf(body.priority, "priority", LEAD_PRIORITIES, "normal")!;
    const email = requiredString(body.email, "email", 320).toLowerCase();
    const score = body.leadScore === undefined ? null : Number(body.leadScore);
    const estimatedDealValue = body.estimatedDealValue === undefined ? null : Number(body.estimatedDealValue);
    if (score !== null && (!Number.isInteger(score) || score < 0 || score > 10)) {
      return NextResponse.json({ error: "leadScore must be an integer from 0 to 10" }, { status: 400 });
    }
    if (estimatedDealValue !== null && (!Number.isFinite(estimatedDealValue) || estimatedDealValue < 0)) {
      return NextResponse.json({ error: "estimatedDealValue must be non-negative" }, { status: 400 });
    }

    const row = {
      status,
      priority,
      full_name: optionalString(body.fullName ?? body.full_name, "fullName", 200) ?? null,
      email,
      business_name:
        optionalString(body.businessName ?? body.business_name, "businessName", 300) ?? null,
      business_type:
        optionalString(body.businessType ?? body.business_type, "businessType", 80) ?? null,
      site_url: optionalString(body.siteUrl ?? body.site_url, "siteUrl", 500) ?? null,
      brief: optionalString(body.brief, "brief", 5000) ?? null,
      source: optionalString(body.source, "source", 80) ?? "manual",
      intent: optionalString(body.intent, "intent", 40) ?? "contact",
      locale: optionalString(body.locale, "locale", 8) ?? "it",
      selected_services: Array.isArray(body.selectedServices) ? body.selectedServices : [],
      selected_service_slugs: Array.isArray(body.selectedServiceSlugs)
        ? body.selectedServiceSlugs
        : [],
      selected_addons: Array.isArray(body.selectedAddons) ? body.selectedAddons : [],
      assignee_id: typeof body.assigneeId === "string" ? body.assigneeId : null,
      next_action_at:
        typeof body.nextActionAt === "string" && body.nextActionAt
          ? body.nextActionAt
          : null,
      category: optionalString(body.category, "category", 150) ?? null,
      city: optionalString(body.city, "city", 150) ?? null,
      country: optionalString(body.country, "country", 150) ?? null,
      phone: optionalString(body.phone, "phone", 60) ?? null,
      contact_person: optionalString(body.contactPerson, "contactPerson", 200) ?? null,
      contact_role: optionalString(body.contactRole, "contactRole", 150) ?? null,
      preferred_language: optionalString(body.preferredLanguage, "preferredLanguage", 20) ?? null,
      lead_score: score,
      estimated_deal_value: estimatedDealValue,
      estimated_value: estimatedDealValue,
      currency: (optionalString(body.currency, "currency", 3) ?? "EUR").toUpperCase(),
      recommended_offer: optionalString(body.recommendedOffer, "recommendedOffer", 500) ?? null,
      next_follow_up_at:
        typeof body.nextFollowUpAt === "string" && body.nextFollowUpAt
          ? body.nextFollowUpAt
          : null,
      lost_reason: optionalString(body.lostReason ?? body.lost_reason, "lostReason", 500) ?? null,
    };

    const { data, error } = await sb.from("leads").insert(row).select(LEAD_SELECT).single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    await appendLeadEvent(sb, {
      leadId: data.id,
      actorId: auth.id,
      eventType: "created",
      payload: { source: row.source, manual: true },
    });
    await recordStudioMutation(sb, {
      actorId: auth.id,
      action: "lead.create",
      entity: "leads",
      entityId: data.id,
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
