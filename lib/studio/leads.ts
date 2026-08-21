import type { SupabaseClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { pageParams } from "@/lib/studio/api";

export const LEAD_STATUSES = ["new", "in_progress", "won", "lost", "spam"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_PRIORITIES = ["low", "normal", "high"] as const;
export type LeadPriority = (typeof LEAD_PRIORITIES)[number];

export const LEAD_SELECT =
  "id, status, priority, full_name, email, business_name, business_type, site_url, brief, source, intent, locale, selected_services, selected_service_slugs, selected_addons, assignee_id, first_responded_at, next_action_at, qualified_at, closed_at, lost_reason, created_at, updated_at";

export type LeadEventType =
  | "created"
  | "status_changed"
  | "priority_changed"
  | "assigned"
  | "note_added"
  | "imported"
  | "converted"
  | "gdpr_export"
  | "gdpr_delete"
  | "next_action_set";

const LEADS_MANAGE_ROLES = ["owner", "editor", "manager", "sales"] as const;

export async function appendLeadEvent(
  client: SupabaseClient,
  input: {
    leadId: string;
    actorId?: string | null;
    eventType: LeadEventType | string;
    payload?: Record<string, unknown>;
  },
) {
  const { error } = await client.from("lead_events").insert({
    lead_id: input.leadId,
    actor_id: input.actorId ?? null,
    event_type: input.eventType,
    payload: input.payload ?? {},
  });
  if (error) throw new Error(`Could not append lead event: ${error.message}`);
}

export async function notifyLeadManagers(
  client: SupabaseClient,
  input: {
    leadId: string;
    type: string;
    title: string;
    body?: string;
    payload?: Record<string, unknown>;
    excludeRecipientId?: string | null;
  },
) {
  const { data: recipients, error } = await client
    .from("profiles")
    .select("id")
    .in("role", [...LEADS_MANAGE_ROLES]);
  if (error) throw new Error(`Could not load lead recipients: ${error.message}`);

  const rows = (recipients || [])
    .filter((profile) => profile.id !== input.excludeRecipientId)
    .map((profile) => ({
      recipient_id: profile.id,
      case_id: null,
      type: input.type,
      title: input.title,
      body: input.body ?? null,
      link: `/leads/${input.leadId}`,
      payload: { leadId: input.leadId, ...(input.payload ?? {}) },
    }));

  if (!rows.length) return 0;
  const { error: insertError } = await client.from("notifications").insert(rows);
  if (insertError) throw new Error(`Could not create lead notifications: ${insertError.message}`);
  return rows.length;
}

export function isClosedLeadStatus(status: string) {
  return status === "won" || status === "lost" || status === "spam";
}

export function buildLeadPatchTimestamps(
  current: {
    status: string;
    first_responded_at?: string | null;
    qualified_at?: string | null;
    closed_at?: string | null;
  },
  next: {
    status?: string;
    noteAdded?: boolean;
  },
) {
  const now = new Date().toISOString();
  const patch: Record<string, unknown> = { updated_at: now };
  const nextStatus = next.status ?? current.status;

  if (
    !current.first_responded_at &&
    (next.noteAdded || (current.status === "new" && nextStatus === "in_progress"))
  ) {
    patch.first_responded_at = now;
  }

  if (nextStatus === "in_progress" && !current.qualified_at) {
    patch.qualified_at = now;
  }

  if (isClosedLeadStatus(nextStatus)) {
    patch.closed_at = now;
  } else if (isClosedLeadStatus(current.status) && !isClosedLeadStatus(nextStatus)) {
    patch.closed_at = null;
  }

  return patch;
}

export type LeadListFilters = {
  status?: string;
  priority?: string;
  source?: string;
  locale?: string;
  intent?: string;
  assigneeId?: string;
  q?: string;
  from?: string;
  to?: string;
  sort?: string;
  order?: "asc" | "desc";
  unassigned?: boolean;
};

export function parseLeadListFilters(request: NextRequest): LeadListFilters & {
  limit: number;
  offset: number;
} {
  const sp = request.nextUrl.searchParams;
  const { limit, offset } = pageParams(request);
  const sort = sp.get("sort") || "created_at";
  const order = sp.get("order") === "asc" ? "asc" : "desc";
  return {
    status: sp.get("status") || undefined,
    priority: sp.get("priority") || undefined,
    source: sp.get("source") || undefined,
    locale: sp.get("locale") || undefined,
    intent: sp.get("intent") || undefined,
    assigneeId: sp.get("assigneeId") || undefined,
    q: sp.get("q")?.trim() || undefined,
    from: sp.get("from") || undefined,
    to: sp.get("to") || undefined,
    sort: ["created_at", "updated_at", "priority", "status", "full_name"].includes(sort)
      ? sort
      : "created_at",
    order,
    unassigned: sp.get("unassigned") === "1",
    limit,
    offset,
  };
}

export function applyLeadFilters<T extends { eq: Function; or: Function; gte: Function; lte: Function; is: Function }>(
  query: T,
  filters: LeadListFilters,
): T {
  let next = query;
  if (filters.status) next = next.eq("status", filters.status) as T;
  if (filters.priority) next = next.eq("priority", filters.priority) as T;
  if (filters.source) next = next.eq("source", filters.source) as T;
  if (filters.locale) next = next.eq("locale", filters.locale) as T;
  if (filters.intent) next = next.eq("intent", filters.intent) as T;
  if (filters.assigneeId) next = next.eq("assignee_id", filters.assigneeId) as T;
  if (filters.unassigned) next = next.is("assignee_id", null) as T;
  if (filters.from) next = next.gte("created_at", filters.from) as T;
  if (filters.to) next = next.lte("created_at", filters.to) as T;
  if (filters.q) {
    const q = filters.q.replace(/[%(),]/g, "");
    next = next.or(
      `email.ilike.%${q}%,full_name.ilike.%${q}%,business_name.ilike.%${q}%`,
    ) as T;
  }
  return next;
}

export function csvEscape(value: unknown) {
  const text = value == null ? "" : String(value);
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function leadsToCsv(
  rows: Array<Record<string, unknown>>,
) {
  const headers = [
    "id",
    "created_at",
    "status",
    "priority",
    "full_name",
    "email",
    "business_name",
    "business_type",
    "site_url",
    "source",
    "intent",
    "locale",
    "assignee_id",
    "first_responded_at",
    "next_action_at",
    "lost_reason",
    "brief",
  ];
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((key) => csvEscape(row[key])).join(","));
  }
  return `${lines.join("\n")}\n`;
}

export function medianMs(values: number[]) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid]! : Math.round((sorted[mid - 1]! + sorted[mid]!) / 2);
}

export function parsePeriodBounds(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const fromParam = sp.get("from");
  const toParam = sp.get("to");
  if (fromParam || toParam) {
    const to = toParam ? new Date(toParam) : new Date();
    const from = fromParam
      ? new Date(fromParam)
      : new Date(to.getTime() - 30 * 86_400_000);
    return {
      from: from.toISOString(),
      to: to.toISOString(),
      periodDays: Math.max(1, Math.round((to.getTime() - from.getTime()) / 86_400_000)),
    };
  }
  const days = Math.min(Math.max(Number(sp.get("days") || 30), 1), 365);
  const to = new Date();
  const from = new Date(Date.now() - days * 86_400_000);
  return { from: from.toISOString(), to: to.toISOString(), periodDays: days };
}
