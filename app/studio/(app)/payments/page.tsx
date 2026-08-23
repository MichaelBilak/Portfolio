import { createAdminClient } from "@/lib/supabase/admin";
import { HqEntityWorkspace, type HqField } from "@/components/studio/workspaces/hq-entity-workspace";

export default async function PaymentsPage() {
  const sb = createAdminClient();
  const { data: invoices } = await sb
    .from("invoices")
    .select("id,invoice_number")
    .neq("status", "void")
    .order("issue_date", { ascending: false })
    .limit(500);
  const fields: HqField[] = [
    { key: "paid_at", requestKey: "paidAt", label: "Payment date", table: true, create: true, required: true, type: "datetime-local" },
    { key: "invoice_id", requestKey: "invoiceId", label: "Invoice", table: true, create: true, required: true, type: "select", options: (invoices || []).map((row) => ({ value: row.id, label: row.invoice_number })) },
    { key: "amount", label: "Amount", table: true, create: true, required: true, type: "number", currency: true },
    { key: "currency", label: "Currency", create: true },
    { key: "method", label: "Method", table: true, create: true },
    { key: "status", label: "Status", table: true },
  ];
  return <HqEntityWorkspace title="Payments" eyebrow="Finance" subtitle="Cash actually received from clients." endpoint="/api/studio/payments" emptyTitle="No payments recorded" emptyDescription="Record a payment to update revenue and invoice outstanding." createLabel="Record payment" fields={fields} />;
}
