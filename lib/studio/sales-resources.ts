import type { SalesResource } from "@/lib/studio/sales-api";
import { ApiInputError } from "@/lib/studio/api";

const metadata = { column: "metadata", kind: "object", nullable: true } as const;
const relationColumns = [
  "company_id",
  "contact_id",
  "deal_id",
  "project_id",
  "lead_id",
  "task_id",
] as const;

function requireRelation(row: Readonly<Record<string, unknown>>, exactlyOne: boolean) {
  const count = relationColumns.filter((column) => typeof row[column] === "string").length;
  if ((exactlyOne && count !== 1) || (!exactlyOne && count === 0)) {
    throw new ApiInputError(
      exactlyOne
        ? "Exactly one related entity is required"
        : "At least one related entity is required",
    );
  }
}

export const companiesResource: SalesResource = {
  table: "companies",
  singular: "company",
  readCapability: "companies.read",
  writeCapability: "companies.manage",
  searchColumns: ["name", "legal_name", "email", "phone"],
  filterColumns: { ownerId: "owner_id", status: "status" },
  listSelect: "id,name,industry,city,country,status,website,updated_at",
  select: "*, contacts(*), deals(*), client_projects(*), invoices(*), subscriptions(*), activities(*), notes(*)",
  fields: [
    { column: "name", kind: "string", required: true, maxLength: 300 },
    { column: "legal_name", aliases: ["legalName"], kind: "string", nullable: true, maxLength: 300 },
    { column: "tax_id", aliases: ["taxId"], kind: "string", nullable: true, maxLength: 80 },
    { column: "email", kind: "string", nullable: true, maxLength: 320 },
    { column: "phone", kind: "string", nullable: true, maxLength: 60 },
    { column: "website", kind: "string", nullable: true, maxLength: 500 },
    { column: "industry", kind: "string", nullable: true, maxLength: 200 },
    { column: "city", kind: "string", nullable: true, maxLength: 150 },
    { column: "country", kind: "string", nullable: true, maxLength: 150 },
    { column: "internal_summary", aliases: ["internalSummary"], kind: "string", nullable: true, maxLength: 20000 },
    { column: "address", kind: "object", nullable: true },
    { column: "owner_id", aliases: ["ownerId"], kind: "uuid", nullable: true },
    {
      column: "status",
      kind: "string",
      defaultValue: "prospect",
      allowed: ["prospect", "active_client", "inactive", "former_client", "partner"],
    },
    { column: "tags", kind: "stringArray" },
    metadata,
  ],
  actorColumn: "created_by",
};

export const contactsResource: SalesResource = {
  table: "contacts",
  singular: "contact",
  readCapability: "companies.read",
  writeCapability: "companies.manage",
  searchColumns: ["first_name", "last_name", "email", "phone"],
  filterColumns: { companyId: "company_id", status: "status" },
  fields: [
    { column: "company_id", aliases: ["companyId"], kind: "uuid", nullable: true },
    { column: "first_name", aliases: ["firstName"], kind: "string", nullable: true, maxLength: 150 },
    { column: "last_name", aliases: ["lastName"], kind: "string", nullable: true, maxLength: 150 },
    { column: "email", kind: "string", nullable: true, maxLength: 320 },
    { column: "phone", kind: "string", nullable: true, maxLength: 60 },
    { column: "job_title", aliases: ["jobTitle"], kind: "string", nullable: true, maxLength: 150 },
    { column: "role", kind: "string", nullable: true, maxLength: 150 },
    { column: "whatsapp", kind: "string", nullable: true, maxLength: 60 },
    { column: "telegram", kind: "string", nullable: true, maxLength: 100 },
    { column: "preferred_language", aliases: ["preferredLanguage"], kind: "string", nullable: true, maxLength: 20 },
    { column: "is_primary", aliases: ["isPrimary"], kind: "boolean", defaultValue: false },
    {
      column: "status",
      kind: "string",
      defaultValue: "active",
      allowed: ["active", "inactive"],
    },
    metadata,
  ],
  actorColumn: "created_by",
  validateCreate: (row) => {
    if (!row.first_name && !row.last_name && !row.email) {
      throw new ApiInputError("firstName, lastName, or email is required");
    }
  },
};

export const dealsResource: SalesResource = {
  table: "deals",
  singular: "deal",
  readCapability: "deals.read",
  writeCapability: "deals.manage",
  searchColumns: ["title", "notes"],
  filterColumns: {
    companyId: "company_id",
    contactId: "primary_contact_id",
    leadId: "lead_id",
    ownerId: "owner_id",
    stage: "stage",
    status: "status",
  },
  select: "*, companies(id,name), contacts(id,first_name,last_name,email), products(id,name), client_projects(id,name,status,health), tasks(*), activities(*), related_notes:notes(*)",
  listSelect: "id,title,company_id,product_id,stage,status,value,currency,probability,expected_close_date,next_action,next_action_date,updated_at,companies(id,name),products(id,name)",
  fields: [
    { column: "title", kind: "string", required: true, maxLength: 300 },
    { column: "company_id", aliases: ["companyId"], kind: "uuid", nullable: true },
    {
      column: "primary_contact_id",
      aliases: ["primaryContactId"],
      kind: "uuid",
      nullable: true,
    },
    { column: "lead_id", aliases: ["leadId"], kind: "uuid", nullable: true },
    { column: "product_id", aliases: ["productId"], kind: "uuid", nullable: true },
    {
      column: "stage",
      kind: "string",
      defaultValue: "qualified",
      allowed: ["qualified", "discovery", "proposal", "negotiation", "won", "lost"],
    },
    { column: "status", kind: "string", defaultValue: "open", allowed: ["open", "won", "lost"] },
    { column: "value", kind: "number", defaultValue: 0, min: 0 },
    { column: "currency", kind: "string", defaultValue: "EUR", maxLength: 8 },
    { column: "probability", kind: "integer", defaultValue: 25, min: 0, max: 100 },
    {
      column: "expected_close_date",
      aliases: ["expectedCloseDate"],
      kind: "date",
      nullable: true,
    },
    { column: "closed_at", aliases: ["closedAt"], kind: "date", nullable: true },
    { column: "owner_id", aliases: ["ownerId"], kind: "uuid", nullable: true },
    { column: "source", kind: "string", nullable: true, maxLength: 100 },
    { column: "pain_summary", aliases: ["painSummary"], kind: "string", nullable: true, maxLength: 10000 },
    { column: "solution_summary", aliases: ["solutionSummary"], kind: "string", nullable: true, maxLength: 10000 },
    { column: "proposal_amount", aliases: ["proposalAmount"], kind: "number", nullable: true, min: 0 },
    { column: "setup_fee", aliases: ["setupFee"], kind: "number", nullable: true, min: 0 },
    { column: "monthly_fee", aliases: ["monthlyFee"], kind: "number", nullable: true, min: 0 },
    { column: "objections", kind: "string", nullable: true, maxLength: 10000 },
    { column: "competitors", kind: "string", nullable: true, maxLength: 10000 },
    { column: "next_action", aliases: ["nextAction"], kind: "string", nullable: true, maxLength: 1000 },
    { column: "next_action_date", aliases: ["nextActionDate"], kind: "date", nullable: true },
    { column: "notes", kind: "string", nullable: true, maxLength: 10000 },
    { column: "lost_reason", aliases: ["lostReason"], kind: "string", nullable: true, maxLength: 1000 },
    metadata,
  ],
  actorColumn: "created_by",
  prepareMutation: (row) => {
    const stage = typeof row.stage === "string" ? row.stage : null;
    if (stage === "won" || stage === "lost") {
      return { ...row, status: stage, closed_at: new Date().toISOString() };
    }
    if (stage) return { ...row, status: "open", closed_at: null };
    return row;
  },
};

export const productsResource: SalesResource = {
  table: "products",
  singular: "product",
  readCapability: "deals.read",
  writeCapability: "deals.manage",
  searchColumns: ["name", "sku", "description"],
  filterColumns: { active: "active", kind: "kind" },
  fields: [
    { column: "sku", kind: "string", required: true, maxLength: 100 },
    { column: "name", kind: "string", required: true, maxLength: 300 },
    { column: "description", kind: "string", nullable: true, maxLength: 10000 },
    {
      column: "kind",
      kind: "string",
      defaultValue: "service",
      allowed: ["service", "subscription", "addon", "other"],
    },
    { column: "unit", kind: "string", defaultValue: "item", maxLength: 40 },
    { column: "unit_price", aliases: ["unitPrice"], kind: "number", defaultValue: 0, min: 0 },
    { column: "category", kind: "string", nullable: true, maxLength: 150 },
    { column: "base_price", aliases: ["basePrice"], kind: "number", nullable: true, min: 0 },
    { column: "max_price", aliases: ["maxPrice"], kind: "number", nullable: true, min: 0 },
    { column: "default_monthly_fee", aliases: ["defaultMonthlyFee"], kind: "number", nullable: true, min: 0 },
    { column: "status", kind: "string", defaultValue: "active", allowed: ["active", "inactive", "archived"] },
    { column: "currency", kind: "string", defaultValue: "EUR", maxLength: 8 },
    { column: "tax_rate", aliases: ["taxRate"], kind: "number", defaultValue: 0, min: 0, max: 100 },
    { column: "active", kind: "boolean", defaultValue: true },
    metadata,
  ],
  actorColumn: "created_by",
};

export const activitiesResource: SalesResource = {
  table: "activities",
  singular: "activity",
  readCapability: "activities.read",
  writeCapability: "activities.create",
  searchColumns: ["subject", "body"],
  filterColumns: {
    dealId: "deal_id",
    companyId: "company_id",
    contactId: "contact_id",
    leadId: "lead_id",
    projectId: "project_id",
    taskId: "task_id",
    type: "activity_type",
  },
  fields: [
    {
      column: "activity_type",
      aliases: ["type", "activityType"],
      kind: "string",
      required: true,
      allowed: ["call", "email", "meeting", "task", "note", "status_change", "system", "other"],
    },
    { column: "subject", kind: "string", required: true, maxLength: 300 },
    { column: "body", kind: "string", nullable: true, maxLength: 10000 },
    { column: "deal_id", aliases: ["dealId"], kind: "uuid", nullable: true },
    { column: "company_id", aliases: ["companyId"], kind: "uuid", nullable: true },
    { column: "contact_id", aliases: ["contactId"], kind: "uuid", nullable: true },
    { column: "lead_id", aliases: ["leadId"], kind: "uuid", nullable: true },
    {
      column: "project_id",
      aliases: ["projectId"],
      kind: "uuid",
      nullable: true,
    },
    { column: "task_id", aliases: ["taskId"], kind: "uuid", nullable: true },
    { column: "occurred_at", aliases: ["occurredAt"], kind: "date", nullable: true },
    metadata,
  ],
  actorColumn: "actor_id",
  validateCreate: (row) => requireRelation(row, false),
};

export const notesResource: SalesResource = {
  table: "notes",
  singular: "note",
  readCapability: "activities.read",
  writeCapability: "activities.create",
  searchColumns: ["body"],
  filterColumns: {
    dealId: "deal_id",
    companyId: "company_id",
    contactId: "contact_id",
    leadId: "lead_id",
    projectId: "project_id",
    taskId: "task_id",
  },
  fields: [
    { column: "body", kind: "string", required: true, maxLength: 20000 },
    { column: "deal_id", aliases: ["dealId"], kind: "uuid", nullable: true },
    { column: "company_id", aliases: ["companyId"], kind: "uuid", nullable: true },
    { column: "contact_id", aliases: ["contactId"], kind: "uuid", nullable: true },
    { column: "lead_id", aliases: ["leadId"], kind: "uuid", nullable: true },
    {
      column: "project_id",
      aliases: ["projectId"],
      kind: "uuid",
      nullable: true,
    },
    { column: "task_id", aliases: ["taskId"], kind: "uuid", nullable: true },
    { column: "pinned", kind: "boolean", defaultValue: false },
  ],
  actorColumn: "author_id",
  validateCreate: (row) => requireRelation(row, true),
};
