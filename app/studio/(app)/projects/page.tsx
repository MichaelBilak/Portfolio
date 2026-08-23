import { createAdminClient } from "@/lib/supabase/admin";
import { HqEntityWorkspace, type HqField } from "@/components/studio/workspaces/hq-entity-workspace";

const statuses = [
  { value: "planned", label: "Planned" },
  { value: "discovery", label: "Discovery" },
  { value: "design", label: "Design" },
  { value: "development", label: "Development" },
  { value: "testing", label: "Testing" },
  { value: "waiting_client", label: "Waiting Client" },
  { value: "launch", label: "Launch" },
  { value: "completed", label: "Completed" },
  { value: "paused", label: "Paused" },
  { value: "cancelled", label: "Cancelled" },
];

export default async function ClientProjectsPage() {
  const sb = createAdminClient();
  const [{ data: companies }, { data: deals }, { data: products }] = await Promise.all([
    sb.from("companies").select("id,name").order("name").limit(500),
    sb.from("deals").select("id,title").eq("stage", "won").order("title").limit(300),
    sb.from("products").select("id,name").order("name").limit(200),
  ]);
  const fields: HqField[] = [
    { key: "name", label: "Project", table: true, create: true, required: true },
    { key: "company_id", requestKey: "companyId", label: "Company", table: true, create: true, required: true, type: "select", options: (companies || []).map((row) => ({ value: row.id, label: row.name })) },
    { key: "deal_id", requestKey: "dealId", label: "Won deal", create: true, type: "select", options: (deals || []).map((row) => ({ value: row.id, label: row.title })) },
    { key: "product_id", requestKey: "productId", label: "Product", create: true, type: "select", options: (products || []).map((row) => ({ value: row.id, label: row.name })) },
    { key: "status", label: "Status", table: true, create: true, required: true, type: "select", options: statuses },
    { key: "progress", label: "Progress %", table: true, create: true, type: "number" },
    { key: "health", label: "Health", table: true },
    { key: "target_date", requestKey: "targetDate", label: "Deadline", table: true, create: true, type: "date" },
    { key: "sold_price", requestKey: "soldPrice", label: "Sold price", table: true, create: true, type: "number", currency: true },
    { key: "estimated_hours", requestKey: "estimatedHours", label: "Estimated hours", create: true, type: "number" },
    { key: "actual_hours", requestKey: "actualHours", label: "Actual hours", create: true, type: "number" },
    { key: "internal_hourly_cost", requestKey: "internalHourlyCost", label: "Internal hourly cost", create: true, type: "number" },
  ];
  return (
    <HqEntityWorkspace
      title="Projects"
      eyebrow="Delivery"
      subtitle="Delivery status, profitability, deadlines and the next concrete action."
      endpoint="/api/studio/client-projects"
      detailPath="/projects"
      emptyTitle="No delivery projects"
      emptyDescription="Create a project or convert a won deal."
      createLabel="New project"
      fields={fields}
      boardField="status"
      boardOptions={statuses}
    />
  );
}
