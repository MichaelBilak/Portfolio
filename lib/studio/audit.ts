import type { SupabaseClient } from "@supabase/supabase-js";

type AuditInput = {
  actorId: string;
  action: string;
  entity: string;
  entityId?: string | null;
  meta?: Record<string, unknown>;
};

type CaseEventInput = {
  caseId: string;
  actorId: string;
  eventType: string;
  entityType?: string | null;
  entityId?: string | null;
  payload?: Record<string, unknown>;
};

export async function writeAuditLog(client: SupabaseClient, input: AuditInput) {
  const { error } = await client.from("audit_logs").insert({
    actor_id: input.actorId,
    action: input.action,
    entity: input.entity,
    entity_id: input.entityId ?? null,
    meta: input.meta ?? {},
  });
  if (error) throw new Error(`Could not write audit log: ${error.message}`);
}

export async function appendCaseEvent(client: SupabaseClient, input: CaseEventInput) {
  const { error } = await client.from("case_events").insert({
    case_id: input.caseId,
    actor_id: input.actorId,
    event_type: input.eventType,
    entity_type: input.entityType ?? null,
    entity_id: input.entityId ?? null,
    payload: input.payload ?? {},
  });
  if (error) throw new Error(`Could not append case event: ${error.message}`);
}

export async function recordStudioMutation(
  client: SupabaseClient,
  input: AuditInput & { caseEvent?: Omit<CaseEventInput, "actorId"> },
) {
  await Promise.all([
    writeAuditLog(client, input),
    input.caseEvent
      ? appendCaseEvent(client, { ...input.caseEvent, actorId: input.actorId })
      : Promise.resolve(),
  ]);
}
