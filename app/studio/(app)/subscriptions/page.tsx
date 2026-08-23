import { createAdminClient } from "@/lib/supabase/admin";
import { HqEntityWorkspace, type HqField } from "@/components/studio/workspaces/hq-entity-workspace";

export default async function SubscriptionsPage() {
  const sb = createAdminClient();
  const [{ data: companies }, { data: products }] = await Promise.all([
    sb.from("companies").select("id,name").order("name").limit(500),
    sb.from("products").select("id,name").order("name").limit(200),
  ]);
  const fields: HqField[] = [
    { key: "name", label: "Subscription", table: true, create: true, required: true },
    { key: "company_id", requestKey: "companyId", label: "Company", table: true, create: true, required: true, type: "select", options: (companies || []).map((row) => ({ value: row.id, label: row.name })) },
    { key: "product_id", requestKey: "productId", label: "Product", create: true, type: "select", options: (products || []).map((row) => ({ value: row.id, label: row.name })) },
    { key: "amount", label: "Amount", table: true, create: true, required: true, type: "number", currency: true },
    { key: "currency", label: "Currency", create: true },
    { key: "interval", label: "Interval", table: true, create: true, required: true, type: "select", options: [
      { value: "month", label: "Monthly" }, { value: "quarter", label: "Quarterly" },
      { value: "year", label: "Annual" }, { value: "week", label: "Weekly" },
    ] },
    { key: "started_on", requestKey: "startedOn", label: "Start", table: true, create: true, required: true, type: "date" },
    { key: "next_billing_date", requestKey: "nextBillingDate", label: "Next billing", table: true, create: true, type: "date" },
    { key: "status", label: "Status", table: true, create: true, type: "select", options: [
      { value: "active", label: "Active" }, { value: "paused", label: "Paused" },
      { value: "cancelled", label: "Cancelled" }, { value: "ended", label: "Ended" },
    ] },
  ];
  return <HqEntityWorkspace title="Subscriptions" eyebrow="Finance" subtitle="Recurring contracts normalized into monthly recurring revenue." endpoint="/api/studio/subscriptions" detailPath="/subscriptions" emptyTitle="No active subscriptions" emptyDescription="Add a recurring support or product contract." createLabel="New subscription" fields={fields} />;
}
