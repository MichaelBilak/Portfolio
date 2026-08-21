import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStudioUser } from "@/lib/studio/auth";
import {
  apiError,
  oneOf,
  optionalString,
  optionalUuid,
  readJsonObject,
} from "@/lib/studio/api";
import { recordStudioMutation } from "@/lib/studio/audit";
import {
  LEAD_PRIORITIES,
  LEAD_STATUSES,
  appendLeadEvent,
  buildLeadPatchTimestamps,
} from "@/lib/studio/leads";

export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireStudioUser({ leads: true });
  if ("error" in auth) return auth.error;

  try {
    const { id } = await ctx.params;
    const body = await readJsonObject(request);
    const sb = createAdminClient();

    const { data: current, error: currentError } = await sb
      .from("leads")
      .select(
        "id, status, priority, assignee_id, first_responded_at, qualified_at, closed_at, next_action_at, lost_reason",
      )
      .eq("id", id)
      .maybeSingle();
    if (currentError) return NextResponse.json({ error: currentError.message }, { status: 400 });
    if (!current) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

    const status = oneOf(body.status, "status", LEAD_STATUSES);
    const priority = oneOf(body.priority, "priority", LEAD_PRIORITIES);
    const assigneeId = optionalUuid(body.assigneeId ?? body.assignee_id, "assigneeId");
    const nextActionAt = optionalString(
      body.nextActionAt ?? body.next_action_at,
      "nextActionAt",
      40,
    );
    const lostReason = optionalString(
      body.lostReason ?? body.lost_reason,
      "lostReason",
      500,
    );
    const note = optionalString(body.note, "note", 5000);

    const patch: Record<string, unknown> = {
      ...buildLeadPatchTimestamps(current, {
        status,
        noteAdded: Boolean(note),
      }),
    };

    if (status !== undefined) patch.status = status;
    if (priority !== undefined) patch.priority = priority;
    if (assigneeId !== undefined) patch.assignee_id = assigneeId;
    if (nextActionAt !== undefined) {
      patch.next_action_at = nextActionAt;
    }
    if (lostReason !== undefined) patch.lost_reason = lostReason;
    if (status === "lost" && lostReason === undefined && !current.lost_reason) {
      // allow lost without reason; UI may prompt
    }

    const hasLeadPatch =
      status !== undefined ||
      priority !== undefined ||
      assigneeId !== undefined ||
      nextActionAt !== undefined ||
      lostReason !== undefined ||
      Object.keys(patch).length > 1;

    if (hasLeadPatch) {
      const { error } = await sb.from("leads").update(patch).eq("id", id);
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (status !== undefined && status !== current.status) {
      await appendLeadEvent(sb, {
        leadId: id,
        actorId: auth.id,
        eventType: "status_changed",
        payload: { from: current.status, to: status },
      });
    }
    if (priority !== undefined && priority !== current.priority) {
      await appendLeadEvent(sb, {
        leadId: id,
        actorId: auth.id,
        eventType: "priority_changed",
        payload: { from: current.priority, to: priority },
      });
    }
    if (assigneeId !== undefined && assigneeId !== current.assignee_id) {
      await appendLeadEvent(sb, {
        leadId: id,
        actorId: auth.id,
        eventType: "assigned",
        payload: { from: current.assignee_id, to: assigneeId },
      });
    }
    if (nextActionAt !== undefined && nextActionAt !== current.next_action_at) {
      await appendLeadEvent(sb, {
        leadId: id,
        actorId: auth.id,
        eventType: "next_action_set",
        payload: { nextActionAt },
      });
    }

    if (note) {
      const { error } = await sb.from("lead_notes").insert({
        lead_id: id,
        author_id: auth.id,
        body: note,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      await appendLeadEvent(sb, {
        leadId: id,
        actorId: auth.id,
        eventType: "note_added",
        payload: { preview: note.slice(0, 120) },
      });
    }

    await recordStudioMutation(sb, {
      actorId: auth.id,
      action: "lead.update",
      entity: "leads",
      entityId: id,
      meta: {
        status,
        priority,
        assigneeId,
        nextActionAt,
        note: Boolean(note),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
