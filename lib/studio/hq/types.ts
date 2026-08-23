import type {
  ActivityType,
  BillingInterval,
  CompanyStatus,
  ContactStatus,
  DealStage,
  DealStatus,
  InvoiceStatus,
  MilestoneStatus,
  PaymentStatus,
  ProductKind,
  ProjectHealth,
  ProjectPriority,
  ProjectStatus,
  SubscriptionStatus,
} from "./enums";

/** PostgreSQL numeric values are transported as decimal strings to avoid precision loss. */
export type DecimalString = string;
export type ISODate = string;
export type ISODateTime = string;
export type CurrencyCode = string;

export type Company = {
  id: string;
  name: string;
  legalName: string | null;
  taxId: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  status: CompanyStatus;
  ownerId: string | null;
  tags: string[];
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
};

export type Contact = {
  id: string;
  companyId: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  jobTitle: string | null;
  isPrimary: boolean;
  status: ContactStatus;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
};

export type Product = {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  kind: ProductKind;
  unit: string;
  unitPrice: DecimalString;
  currency: CurrencyCode;
  taxRate: DecimalString;
  active: boolean;
};

export type Deal = {
  id: string;
  companyId: string | null;
  primaryContactId: string | null;
  leadId: string | null;
  title: string;
  stage: DealStage;
  status: DealStatus;
  value: DecimalString;
  currency: CurrencyCode;
  probability: number;
  expectedCloseDate: ISODate | null;
  closedAt: ISODateTime | null;
  ownerId: string | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
};

export type ClientProject = {
  id: string;
  projectNumber: number;
  dealId: string | null;
  companyId: string | null;
  primaryContactId: string | null;
  caseId: string | null;
  name: string;
  status: ProjectStatus;
  health: ProjectHealth;
  priority: ProjectPriority;
  ownerId: string | null;
  startDate: ISODate | null;
  targetDate: ISODate | null;
  completedAt: ISODateTime | null;
  budget: DecimalString;
  currency: CurrencyCode;
  progress: number;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
};

export type ProjectMilestone = {
  id: string;
  projectId: string;
  title: string;
  status: MilestoneStatus;
  dueDate: ISODate | null;
  completedAt: ISODateTime | null;
  amount: DecimalString | null;
  currency: CurrencyCode;
  sortOrder: number;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  companyId: string;
  contactId: string | null;
  projectId: string | null;
  dealId: string | null;
  status: InvoiceStatus;
  currency: CurrencyCode;
  issueDate: ISODate;
  dueDate: ISODate | null;
  subtotal: DecimalString;
  taxTotal: DecimalString;
  discountTotal: DecimalString;
  total: DecimalString;
  amountPaid: DecimalString;
};

export type InvoiceItem = {
  id: string;
  invoiceId: string;
  productId: string | null;
  description: string;
  quantity: DecimalString;
  unitPrice: DecimalString;
  taxRate: DecimalString;
  discount: DecimalString;
  lineSubtotal: DecimalString;
  lineTax: DecimalString;
  lineTotal: DecimalString;
  sortOrder: number;
};

export type Payment = {
  id: string;
  invoiceId: string | null;
  companyId: string;
  amount: DecimalString;
  currency: CurrencyCode;
  status: PaymentStatus;
  method: string | null;
  externalReference: string | null;
  paidAt: ISODateTime | null;
};

export type Subscription = {
  id: string;
  companyId: string;
  productId: string | null;
  projectId: string | null;
  status: SubscriptionStatus;
  amount: DecimalString;
  currency: CurrencyCode;
  interval: BillingInterval;
  intervalCount: number;
  startedOn: ISODate;
  nextBillingDate: ISODate | null;
};

export type Activity = {
  id: number;
  activityType: ActivityType;
  subject: string;
  body: string | null;
  companyId: string | null;
  contactId: string | null;
  dealId: string | null;
  projectId: string | null;
  leadId: string | null;
  taskId: string | null;
  actorId: string | null;
  occurredAt: ISODateTime;
  createdAt: ISODateTime;
};

export type HqDashboardSummary = {
  from: ISODate;
  to: ISODate;
  openDeals: number;
  pipelineValue: DecimalString;
  weightedPipeline: DecimalString;
  wonValue: DecimalString;
  openProjects: number;
  unhealthyProjects: number;
  overdueProjects: number;
  invoicedValue: DecimalString;
  invoicePaidValue: DecimalString;
  receivables: DecimalString;
  cashCollected: DecimalString;
  mrr: DecimalString;
};
