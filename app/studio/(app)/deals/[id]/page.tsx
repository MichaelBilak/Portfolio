import { HqEntityDetail } from "@/components/studio/workspaces/hq-entity-detail";
import type { HqField } from "@/components/studio/workspaces/hq-entity-workspace";

const stages = [
  { value: "discovery", label: "Discovery" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal", label: "Proposal" },
  { value: "negotiation", label: "Negotiation" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

const fields: HqField[] = [
  { key: "title", label: "Deal name", required: true },
  { key: "stage", label: "Stage", type: "select", options: stages },
  { key: "value", label: "Value", type: "number" },
  { key: "currency", label: "Currency" },
  { key: "probability", label: "Probability", type: "number" },
  { key: "expected_close_date", requestKey: "expectedCloseDate", label: "Expected close", type: "date" },
  { key: "next_action", requestKey: "nextAction", label: "Next action" },
  { key: "next_action_date", requestKey: "nextActionDate", label: "Next action date", type: "date" },
  { key: "pain_summary", requestKey: "painSummary", label: "Pain summary", type: "textarea" },
  { key: "solution_summary", requestKey: "solutionSummary", label: "Solution summary", type: "textarea" },
  { key: "objections", label: "Objections", type: "textarea" },
  { key: "lost_reason", requestKey: "lostReason", label: "Lost reason", type: "textarea" },
];

export default async function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <HqEntityDetail id={id} kind="deal" endpoint={`/api/studio/deals/${id}`} backPath="/deals" backLabel="Deals" titleKey="title" subtitleKey="stage" fields={fields} />;
}
