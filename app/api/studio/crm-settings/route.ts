import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStudioUser } from "@/lib/studio/auth";
import { apiError, optionalString, readJsonObject } from "@/lib/studio/api";
import { recordStudioMutation } from "@/lib/studio/audit";

const PROVIDER = "crm_workspace";

export async function GET() {
  const auth = await requireStudioUser({ capability: "settings.manage" });
  if ("error" in auth) return auth.error;

  const sb = createAdminClient();
  const [{ data: settings }, { data: stages }] = await Promise.all([
    sb.from("integration_settings").select("*").eq("provider", PROVIDER).maybeSingle(),
    sb.from("pipeline_stages").select("*").order("sort_order", { ascending: true }),
  ]);

  const settingsPayload =
    settings?.settings && typeof settings.settings === "object"
      ? (settings.settings as Record<string, unknown>)
      : {};

  return NextResponse.json({
    workspace_name: settingsPayload.workspace_name || "DormUp Studio",
    timezone: settingsPayload.timezone || "Europe/Rome",
    currency: settingsPayload.currency || "EUR",
    stages: stages || [],
    integrations: {
      telegram: Boolean(process.env.TELEGRAM_BOT_TOKEN),
      gmail: Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD),
      cron: Boolean(process.env.CRM_CRON_SECRET),
    },
  });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireStudioUser({ capability: "settings.manage" });
  if ("error" in auth) return auth.error;

  try {
    const body = await readJsonObject(request);
    const payload = {
      workspace_name: optionalString(body.workspace_name, "workspace_name", 200) || "DormUp Studio",
      timezone: optionalString(body.timezone, "timezone", 80) || "Europe/Rome",
      currency: optionalString(body.currency, "currency", 8) || "EUR",
    };
    const sb = createAdminClient();
    const { data, error } = await sb
      .from("integration_settings")
      .upsert(
        {
          provider: PROVIDER,
          enabled: true,
          settings: payload,
          updated_by: auth.id,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "provider" },
      )
      .select("*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    await recordStudioMutation(sb, {
      actorId: auth.id,
      action: "crm.settings_update",
      entity: "integration_settings",
      entityId: data.id,
      meta: payload,
    });

    return NextResponse.json(payload);
  } catch (error) {
    return apiError(error);
  }
}
