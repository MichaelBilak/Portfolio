import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type StudioRole = "owner" | "editor" | "sales";

export type StudioProfile = {
  id: string;
  email: string;
  name: string | null;
  role: StudioRole;
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
    .select("id, name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) return null;

  return {
    id: profile.id,
    email: user.email || "",
    name: profile.name,
    role: profile.role as StudioRole,
  };
}

export function canManageContent(role: StudioRole) {
  return role === "owner" || role === "editor";
}

export function canManageLeads(role: StudioRole) {
  return role === "owner" || role === "editor" || role === "sales";
}

export function canManageUsers(role: StudioRole) {
  return role === "owner";
}

export async function requireStudioUser(opts?: {
  content?: boolean;
  leads?: boolean;
  owner?: boolean;
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
  return user;
}
