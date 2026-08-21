import type { SupabaseClient } from "@supabase/supabase-js";

export const CARE_STATUSES = ["active", "paused", "ended"] as const;
export type CareStatus = (typeof CARE_STATUSES)[number];

export const PROOF_TASK_TITLES = [
  "Portfolio: publish case on website",
  "Collect client testimonial",
  "Update services copy from this delivery",
] as const;

export async function seedProofTasksOnComplete(
  client: SupabaseClient,
  input: {
    caseId: string;
    actorId: string;
    previousStageId: string | null | undefined;
    nextStageId: string | null | undefined;
  },
) {
  if (!input.nextStageId || input.nextStageId === input.previousStageId) return { created: 0 };

  const { data: stage } = await client
    .from("pipeline_stages")
    .select("id, key, is_closed, is_won")
    .eq("id", input.nextStageId)
    .maybeSingle();
  if (!stage || stage.key !== "completed") return { created: 0 };

  const { data: current } = await client
    .from("cases")
    .select("id, metadata, owner_id")
    .eq("id", input.caseId)
    .maybeSingle();
  if (!current) return { created: 0 };

  const metadata =
    current.metadata && typeof current.metadata === "object" && !Array.isArray(current.metadata)
      ? (current.metadata as Record<string, unknown>)
      : {};
  if (metadata.proofSeeded === true) return { created: 0 };

  const rows = PROOF_TASK_TITLES.map((title) => ({
    case_id: input.caseId,
    title,
    description: "Proof loop: turn delivery into marketing assets.",
    status: "todo",
    priority: "normal",
    assignee_id: current.owner_id || input.actorId,
    created_by: input.actorId,
  }));

  const { error } = await client.from("tasks").insert(rows);
  if (error) throw new Error(error.message);

  await client
    .from("cases")
    .update({
      metadata: { ...metadata, proofSeeded: true, proofSeededAt: new Date().toISOString() },
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.caseId);

  return { created: rows.length };
}
