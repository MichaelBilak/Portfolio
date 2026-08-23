import { HqEntityDetail } from "@/components/studio/workspaces/hq-entity-detail";
import type { HqField } from "@/components/studio/workspaces/hq-entity-workspace";

const fields: HqField[] = [
  { key: "name", label: "Subscription" },
  { key: "amount", label: "Amount", type: "number" },
  { key: "currency", label: "Currency" },
  { key: "interval", label: "Interval", type: "select", options: [
    { value: "month", label: "Monthly" }, { value: "quarter", label: "Quarterly" },
    { value: "year", label: "Annual" }, { value: "week", label: "Weekly" },
  ] },
  { key: "started_on", requestKey: "startedOn", label: "Start date", type: "date" },
  { key: "next_billing_date", requestKey: "nextBillingDate", label: "Next billing", type: "date" },
  { key: "status", label: "Status", type: "select", options: [
    { value: "active", label: "Active" }, { value: "paused", label: "Paused" },
    { value: "cancelled", label: "Cancelled" }, { value: "ended", label: "Ended" },
  ] },
];

export default async function SubscriptionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <HqEntityDetail id={id} kind="subscription" endpoint={`/api/studio/subscriptions/${id}`} backPath="/subscriptions" backLabel="Subscriptions" titleKey="name" subtitleKey="status" fields={fields} />;
}
