import { createAdminClient } from "@/lib/supabase/admin";
import { HqEntityWorkspace, type HqField } from "@/components/studio/workspaces/hq-entity-workspace";

const stages = [
  { value: "discovery", label: "Discovery" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal", label: "Proposal" },
  { value: "negotiation", label: "Negotiation" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

export default async function DealsPage() {
  const sb = createAdminClient();
  const [{ data: companies }, { data: products }] = await Promise.all([
    sb.from("companies").select("id,name").order("name").limit(500),
    sb.from("products").select("id,name").order("name").limit(200),
  ]);
  const fields: HqField[] = [
    { key: "title", label: "Deal", table: true, create: true, required: true },
    { key: "company_id", requestKey: "companyId", label: "Company", table: true, create: true, required: true, type: "select", options: (companies || []).map((row) => ({ value: row.id, label: row.name })) },
    { key: "product_id", requestKey: "productId", label: "Product", create: true, type: "select", options: (products || []).map((row) => ({ value: row.id, label: row.name })) },
    { key: "stage", label: "Stage", table: true, create: true, required: true, type: "select", options: stages },
    { key: "value", label: "Value", table: true, create: true, required: true, type: "number", currency: true },
    { key: "currency", label: "Currency", create: true },
    { key: "probability", label: "Probability", table: true, create: true, type: "number" },
    { key: "expected_close_date", requestKey: "expectedCloseDate", label: "Expected close", table: true, create: true, type: "date" },
    { key: "next_action", requestKey: "nextAction", label: "Next action", table: true, create: true },
    { key: "next_action_date", requestKey: "nextActionDate", label: "Next action date", create: true, type: "date" },
  ];

  return (
    <HqEntityWorkspace
      title="Deals"
      eyebrow="Sales"
      subtitle="Commercial opportunities separated from companies and delivery work."
      endpoint="/api/studio/deals"
      detailPath="/deals"
      emptyTitle="No active deals"
      emptyDescription="Create your first deal or convert a qualified lead."
      createLabel="New deal"
      fields={fields}
      boardField="stage"
      boardOptions={stages}
    />
  );
}
