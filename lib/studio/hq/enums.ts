export const COMPANY_STATUSES = ["prospect", "active_client", "inactive", "former_client", "partner"] as const;
export type CompanyStatus = (typeof COMPANY_STATUSES)[number];

export const CONTACT_STATUSES = ["active", "inactive"] as const;
export type ContactStatus = (typeof CONTACT_STATUSES)[number];

export const PRODUCT_KINDS = ["service", "subscription", "addon", "other"] as const;
export type ProductKind = (typeof PRODUCT_KINDS)[number];

export const DEAL_STAGES = [
  "qualified",
  "discovery",
  "proposal",
  "negotiation",
  "won",
  "lost",
] as const;
export type DealStage = (typeof DEAL_STAGES)[number];

export const DEAL_STATUSES = ["open", "won", "lost"] as const;
export type DealStatus = (typeof DEAL_STATUSES)[number];

export const PROJECT_STATUSES = [
  "planned",
  "discovery",
  "design",
  "development",
  "testing",
  "waiting_client",
  "launch",
  "completed",
  "paused",
  "cancelled",
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_HEALTH_VALUES = ["green", "yellow", "red", "unknown"] as const;
export type ProjectHealth = (typeof PROJECT_HEALTH_VALUES)[number];

export const PROJECT_PRIORITIES = ["low", "normal", "high", "urgent"] as const;
export type ProjectPriority = (typeof PROJECT_PRIORITIES)[number];

export const MILESTONE_STATUSES = [
  "pending",
  "in_progress",
  "completed",
  "blocked",
  "cancelled",
] as const;
export type MilestoneStatus = (typeof MILESTONE_STATUSES)[number];

export const INVOICE_STATUSES = [
  "draft",
  "sent",
  "viewed",
  "partially_paid",
  "paid",
  "overdue",
  "cancelled",
  "void",
] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export const PAYMENT_STATUSES = [
  "pending",
  "succeeded",
  "failed",
  "refunded",
  "cancelled",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const SUBSCRIPTION_STATUSES = [
  "trialing",
  "active",
  "paused",
  "past_due",
  "cancelled",
  "ended",
] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

export const BILLING_INTERVALS = ["week", "month", "quarter", "year"] as const;
export type BillingInterval = (typeof BILLING_INTERVALS)[number];

export const ACTIVITY_TYPES = [
  "call",
  "email",
  "meeting",
  "task",
  "note",
  "status_change",
  "system",
  "other",
] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];
