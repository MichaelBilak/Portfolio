import { HqEntityDetail } from "@/components/studio/workspaces/hq-entity-detail";
import type { HqField } from "@/components/studio/workspaces/hq-entity-workspace";

const fields: HqField[] = [
  { key: "name", label: "Company", required: true },
  { key: "industry", label: "Industry" },
  { key: "status", label: "Status", type: "select", options: [
    { value: "prospect", label: "Prospect" },
    { value: "active_client", label: "Active Client" },
    { value: "inactive", label: "Inactive" },
    { value: "former_client", label: "Former Client" },
    { value: "partner", label: "Partner" },
  ] },
  { key: "city", label: "City" },
  { key: "country", label: "Country" },
  { key: "website", label: "Website" },
  { key: "internal_summary", requestKey: "internalSummary", label: "Internal summary", type: "textarea" },
];

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <HqEntityDetail id={id} kind="company" endpoint={`/api/studio/companies/${id}`} backPath="/companies" backLabel="Companies" titleKey="name" subtitleKey="industry" fields={fields} />;
}
