import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type StudioRole =
  | "owner"
  | "editor"
  | "sales"
  | "manager"
  | "specialist"
  | "viewer";

export type StudioCapability =
  | "content.manage"
  | "leads.manage"
  | "users.manage"
  | "companies.read"
  | "companies.manage"
  | "deals.read"
  | "deals.manage"
  | "projects.read"
  | "projects.manage"
  | "activities.read"
  | "activities.create"
  | "cases.read"
  | "cases.create"
  | "cases.update"
  | "cases.archive"
  | "tasks.manage"
  | "files.manage"
  | "documents.manage"
  | "automations.manage"
  | "finance.manage"
  | "time.manage"
  | "reports.read"
  | "settings.manage";

export type StudioProfile = {
  id: string;
  email: string;
  name: string | null;
  role: StudioRole;
  adminLocale: string;
};

const allCapabilities: readonly StudioCapability[] = [
  "content.manage",
  "leads.manage",
  "users.manage",
  "companies.read",
  "companies.manage",
  "deals.read",
  "deals.manage",
  "projects.read",
  "projects.manage",
  "activities.read",
  "activities.create",
  "cases.read",
  "cases.create",
  "cases.update",
  "cases.archive",
  "tasks.manage",
  "files.manage",
  "documents.manage",
  "automations.manage",
  "finance.manage",
  "time.manage",
  "reports.read",
  "settings.manage",
];

const roleCapabilities: Record<StudioRole, readonly StudioCapability[]> = {
  owner: allCapabilities,
  editor: allCapabilities.filter((capability) => capability !== "users.manage"),
  manager: allCapabilities.filter(
    (capability) =>
      capability !== "users.manage" &&
      capability !== "content.manage" &&
      capability !== "settings.manage",
  ),
  sales: [
    "leads.manage",
    "companies.read",
    "companies.manage",
    "deals.read",
    "deals.manage",
    "projects.read",
    "activities.read",
    "activities.create",
    "cases.read",
    "cases.create",
    "cases.update",
    "tasks.manage",
    "files.manage",
    "documents.manage",
    "time.manage",
    "reports.read",
  ],
  specialist: [
    "companies.read",
    "deals.read",
    "projects.read",
    "projects.manage",
    "activities.read",
    "activities.create",
    "cases.read",
    "cases.update",
    "tasks.manage",
    "files.manage",
    "documents.manage",
    "time.manage",
  ],
  viewer: [
    "companies.read",
    "deals.read",
    "projects.read",
    "activities.read",
    "cases.read",
    "reports.read",
  ],
};

export async function getStudioSession(): Promise<StudioProfile | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("id, name, role, admin_locale")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) return null;

  return {
    id: profile.id,
    email: user.email || "",
    name: profile.name,
    role: profile.role as StudioRole,
    adminLocale: (profile.admin_locale as string | null) || "ru",
  };
}

export function hasStudioCapability(role: StudioRole, capability: StudioCapability) {
  return roleCapabilities[role]?.includes(capability) ?? false;
}

export function canManageContent(role: StudioRole) {
  return hasStudioCapability(role, "content.manage");
}

export function canManageLeads(role: StudioRole) {
  return hasStudioCapability(role, "leads.manage");
}

export function canManageUsers(role: StudioRole) {
  return hasStudioCapability(role, "users.manage");
}

export function canManageCompanies(role: StudioRole) {
  return hasStudioCapability(role, "companies.manage");
}

export function canManageDeals(role: StudioRole) {
  return hasStudioCapability(role, "deals.manage");
}

export function canManageProjects(role: StudioRole) {
  return hasStudioCapability(role, "projects.manage");
}

export function canCreateActivities(role: StudioRole) {
  return hasStudioCapability(role, "activities.create");
}

export async function requireStudioUser(opts?: {
  content?: boolean;
  leads?: boolean;
  owner?: boolean;
  capability?: StudioCapability;
  capabilities?: StudioCapability[];
}): Promise<StudioProfile | { error: Response }> {
  const user = await getStudioSession();
  if (!user) {
    return { error: new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }) };
  }
  if (opts?.owner && !canManageUsers(user.role)) {
    return { error: new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 }) };
  }
  if (opts?.content && !canManageContent(user.role)) {
    return { error: new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 }) };
  }
  if (opts?.leads && !canManageLeads(user.role)) {
    return { error: new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 }) };
  }
  if (opts?.capability && !hasStudioCapability(user.role, opts.capability)) {
    return { error: new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 }) };
  }
  if (
    opts?.capabilities &&
    !opts.capabilities.every((capability) => hasStudioCapability(user.role, capability))
  ) {
    return { error: new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 }) };
  }
  return user;
}
