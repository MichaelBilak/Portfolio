import { createAdminClient } from "@/lib/supabase/admin";
import { HqEntityWorkspace, type HqField } from "@/components/studio/workspaces/hq-entity-workspace";

export default async function InvoicesPage() {
  const sb = createAdminClient();
  const [{ data: companies }, { data: projects }] = await Promise.all([
    sb.from("companies").select("id,name").order("name").limit(500),
    sb.from("client_projects").select("id,name").order("name").limit(500),
  ]);
  const fields: HqField[] = [
    { key: "invoice_number", requestKey: "invoiceNumber", label: "Invoice", table: true, create: true, required: true },
    { key: "company_id", requestKey: "companyId", label: "Company", table: true, create: true, required: true, type: "select", options: (companies || []).map((row) => ({ value: row.id, label: row.name })) },
    { key: "project_id", requestKey: "projectId", label: "Project", create: true, type: "select", options: (projects || []).map((row) => ({ value: row.id, label: row.name })) },
    { key: "issue_date", requestKey: "issueDate", label: "Issued", table: true, create: true, required: true, type: "date" },
    { key: "due_date", requestKey: "dueDate", label: "Due", table: true, create: true, required: true, type: "date" },
    { key: "total", label: "Total", table: true, create: true, required: true, type: "number", currency: true },
    { key: "currency", label: "Currency", create: true },
    { key: "amount_paid", label: "Paid", table: true, currency: true },
    { key: "remaining_amount", label: "Outstanding", table: true, currency: true },
    { key: "status", label: "Status", table: true, create: true, type: "select", options: [
      { value: "draft", label: "Draft" }, { value: "sent", label: "Sent" },
      { value: "partially_paid", label: "Partially Paid" },
      { value: "paid", label: "Paid" }, { value: "overdue", label: "Overdue" },
      { value: "void", label: "Cancelled" },
    ] },
  ];
  return <HqEntityWorkspace title="Invoices" eyebrow="Finance" subtitle="Amounts issued, paid and still outstanding." endpoint="/api/studio/invoices" detailPath="/invoices" emptyTitle="No invoices yet" emptyDescription="Create the first invoice for a client project." createLabel="New invoice" fields={fields} />;
}
