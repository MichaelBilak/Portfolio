import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStudioUser } from "@/lib/studio/auth";

export async function PUT(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireStudioUser({ content: true });
  if ("error" in auth) return auth.error;
  const { id } = await ctx.params;
  const body = await request.json();
  const sb = createAdminClient();

  const { addon_category_i18n, addon_items, id: _i, created_at: _c, ...cat } = body;

  await sb.from("addon_categories").update(cat).eq("id", id);

  if (Array.isArray(addon_category_i18n)) {
    for (const row of addon_category_i18n) {
      const { id: rid, ...rest } = row;
      if (rid) await sb.from("addon_category_i18n").update(rest).eq("id", rid);
      else await sb.from("addon_category_i18n").upsert({ ...rest, category_id: id }, { onConflict: "category_id,locale" });
    }
  }

  if (Array.isArray(addon_items)) {
    for (const item of addon_items) {
      const { addon_item_i18n, id: itemId, ...itemRest } = item;
      let iid = itemId as string | undefined;
      if (iid) await sb.from("addon_items").update(itemRest).eq("id", iid);
      else {
        const { data } = await sb.from("addon_items").insert({ ...itemRest, category_id: id }).select("id").single();
        iid = data?.id;
      }
      if (iid && Array.isArray(addon_item_i18n)) {
        for (const row of addon_item_i18n) {
          const { id: rid, ...rest } = row;
          if (rid) await sb.from("addon_item_i18n").update(rest).eq("id", rid);
          else await sb.from("addon_item_i18n").upsert({ ...rest, item_id: iid }, { onConflict: "item_id,locale" });
        }
      }
    }
  }

  return NextResponse.json({ ok: true });
}
