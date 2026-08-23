import { HqEntityDetail } from "@/components/studio/workspaces/hq-entity-detail";
import type { HqField } from "@/components/studio/workspaces/hq-entity-workspace";

const fields: HqField[] = [
  { key: "name", label: "Project name", required: true },
  { key: "description", label: "Description", type: "textarea" },
  { key: "status", label: "Status", type: "select", options: [
    { value: "planned", label: "Planned" }, { value: "discovery", label: "Discovery" },
    { value: "design", label: "Design" }, { value: "development", label: "Development" },
    { value: "testing", label: "Testing" }, { value: "waiting_client", label: "Waiting Client" },
    { value: "launch", label: "Launch" }, { value: "completed", label: "Completed" },
    { value: "paused", label: "Paused" }, { value: "cancelled", label: "Cancelled" },
  ] },
  { key: "progress", label: "Progress %", type: "number" },
  { key: "start_date", requestKey: "startDate", label: "Start date", type: "date" },
  { key: "target_date", requestKey: "targetDate", label: "Target date", type: "date" },
  { key: "sold_price", requestKey: "soldPrice", label: "Sold price", type: "number" },
  { key: "estimated_hours", requestKey: "estimatedHours", label: "Estimated hours", type: "number" },
  { key: "actual_hours", requestKey: "actualHours", label: "Actual hours", type: "number" },
  { key: "internal_hourly_cost", requestKey: "internalHourlyCost", label: "Internal hourly cost", type: "number" },
];

export default async function ClientProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <HqEntityDetail id={id} kind="project" endpoint={`/api/studio/client-projects/${id}`} backPath="/projects" backLabel="Projects" titleKey="name" subtitleKey="status" fields={fields} />;
}
