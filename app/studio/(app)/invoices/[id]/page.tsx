import { HqEntityDetail } from "@/components/studio/workspaces/hq-entity-detail";
import type { HqField } from "@/components/studio/workspaces/hq-entity-workspace";

const fields: HqField[] = [
  { key: "invoice_number", requestKey: "invoiceNumber", label: "Invoice number" },
  { key: "issue_date", requestKey: "issueDate", label: "Issue date", type: "date" },
  { key: "due_date", requestKey: "dueDate", label: "Due date", type: "date" },
  { key: "subtotal", label: "Subtotal", type: "number" },
  { key: "tax_total", requestKey: "taxTotal", label: "Tax", type: "number" },
  { key: "total", label: "Total", type: "number" },
  { key: "currency", label: "Currency" },
  { key: "status", label: "Status", type: "select", options: [
    { value: "draft", label: "Draft" }, { value: "sent", label: "Sent" },
    { value: "partially_paid", label: "Partially Paid" },
    { value: "paid", label: "Paid" }, { value: "overdue", label: "Overdue" },
    { value: "void", label: "Cancelled" },
  ] },
];

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <HqEntityDetail id={id} kind="invoice" endpoint={`/api/studio/invoices/${id}`} backPath="/invoices" backLabel="Invoices" titleKey="invoice_number" subtitleKey="status" fields={fields} />;
}
