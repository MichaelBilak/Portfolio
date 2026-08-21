import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStudioUser } from "@/lib/studio/auth";
import { appendLeadEvent } from "@/lib/studio/leads";

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireStudioUser({ leads: true });
  if ("error" in auth) return auth.error;

  const { id } = await ctx.params;
  const sb = createAdminClient();
  const { data: lead } = await sb.from("leads").select("*").eq("id", id).maybeSingle();
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [{ data: notes }, { data: events }] = await Promise.all([
    sb.from("lead_notes").select("*").eq("lead_id", id),
    sb.from("lead_events").select("*").eq("lead_id", id).order("created_at", { ascending: true }),
  ]);

  try {
    await appendLeadEvent(sb, {
      leadId: id,
      actorId: auth.id,
      eventType: "gdpr_export",
    });
  } catch {
    // Export still succeeds if event append fails on older schemas.
  }

  return NextResponse.json(
    { lead, notes, events },
    {
      headers: {
        "Content-Disposition": `attachment; filename="lead-${id}.json"`,
      },
    },
  );
}

export async function DELETE(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireStudioUser({ leads: true });
  if ("error" in auth) return auth.error;

  const { id } = await ctx.params;
  const sb = createAdminClient();

  try {
    await appendLeadEvent(sb, {
      leadId: id,
      actorId: auth.id,
      eventType: "gdpr_delete",
    });
  } catch {
    // Continue with delete.
  }

  const { error } = await sb.from("leads").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await sb.from("audit_logs").insert({
    actor_id: auth.id,
    action: "gdpr_delete_lead",
    entity: "leads",
    entity_id: id,
  });

  return NextResponse.json({ ok: true });
}
