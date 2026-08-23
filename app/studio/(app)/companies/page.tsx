import { HqEntityWorkspace, type HqField } from "@/components/studio/workspaces/hq-entity-workspace";

const fields: HqField[] = [
  { key: "name", label: "Company", table: true, create: true, required: true },
  { key: "industry", label: "Industry", table: true, create: true },
  { key: "city", label: "City", table: true, create: true },
  { key: "country", label: "Country", table: true, create: true },
  {
    key: "status",
    label: "Status",
    table: true,
    create: true,
    required: true,
    type: "select",
    options: [
      { value: "prospect", label: "Prospect" },
      { value: "active_client", label: "Active Client" },
      { value: "inactive", label: "Inactive" },
      { value: "former_client", label: "Former Client" },
      { value: "partner", label: "Partner" },
    ],
  },
  { key: "website", label: "Website", create: true },
  { key: "updated_at", label: "Last activity", table: true, type: "date" },
];

export default function CompaniesPage() {
  return (
    <HqEntityWorkspace
      title="Companies"
      eyebrow="Sales"
      subtitle="The complete relationship history for every prospect and client."
      endpoint="/api/studio/companies"
      detailPath="/companies"
      emptyTitle="No companies yet"
      emptyDescription="Create a company or convert a qualified lead."
      createLabel="New company"
      fields={fields}
    />
  );
}
