import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStudioUser } from "@/lib/studio/auth";

export async function PUT(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireStudioUser({ content: true });
  if ("error" in auth) return auth.error;

  const { id } = await ctx.params;
  const body = await request.json();
  const sb = createAdminClient();

  const {
    service_i18n,
    service_tiers,
    id: _id,
    created_at: _c,
    ...service
  } = body as Record<string, unknown> & {
    service_i18n?: Array<Record<string, unknown>>;
    service_tiers?: Array<Record<string, unknown>>;
  };

  const { error } = await sb
    .from("services")
    .update({ ...service, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (Array.isArray(service_i18n)) {
    for (const row of service_i18n) {
      const { id: i18nId, ...rest } = row;
      if (i18nId) await sb.from("service_i18n").update(rest).eq("id", i18nId);
      else {
        await sb.from("service_i18n").upsert(
          { ...rest, service_id: id },
          { onConflict: "service_id,locale" },
        );
      }
    }
  }

  if (Array.isArray(service_tiers)) {
    for (const tier of service_tiers) {
      const { service_tier_i18n, id: tierId, ...tierRest } = tier as {
        id?: string;
        service_tier_i18n?: Array<Record<string, unknown>>;
      } & Record<string, unknown>;

      let tid = tierId;
      if (tid) {
        await sb.from("service_tiers").update(tierRest).eq("id", tid);
      } else {
        const { data } = await sb
          .from("service_tiers")
          .insert({ ...tierRest, service_id: id })
          .select("id")
          .single();
        tid = data?.id;
      }

      if (tid && Array.isArray(service_tier_i18n)) {
        for (const row of service_tier_i18n) {
          const { id: tiId, ...rest } = row;
          if (tiId) await sb.from("service_tier_i18n").update(rest).eq("id", tiId);
          else {
            await sb.from("service_tier_i18n").upsert(
              { ...rest, tier_id: tid },
              { onConflict: "tier_id,locale" },
            );
          }
        }
      }
    }
  }

  return NextResponse.json({ ok: true });
}
