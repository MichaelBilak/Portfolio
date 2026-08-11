import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { StudioProfile } from "@/lib/studio/auth";

export function hasGlobalCaseAccess(user: StudioProfile) {
  return user.role === "owner";
}

export async function getAccessibleCaseIds(
  sb: SupabaseClient,
  user: StudioProfile,
): Promise<string[] | null> {
  if (hasGlobalCaseAccess(user)) return null;

  const { data, error } = await sb
    .from("case_members")
    .select("case_id")
    .eq("profile_id", user.id);
  if (error) throw error;
  return (data || []).map((membership) => String(membership.case_id));
}

export async function canAccessCase(
  sb: SupabaseClient,
  user: StudioProfile,
  caseId: string,
): Promise<boolean> {
  if (hasGlobalCaseAccess(user)) {
    const { data, error } = await sb.from("cases").select("id").eq("id", caseId).maybeSingle();
    if (error) throw error;
    return Boolean(data);
  }

  const { data, error } = await sb
    .from("case_members")
    .select("case_id")
    .eq("case_id", caseId)
    .eq("profile_id", user.id)
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

export async function requireCaseAccess(
  sb: SupabaseClient,
  user: StudioProfile,
  caseId: string,
  resource = "Case",
): Promise<NextResponse | null> {
  return (await canAccessCase(sb, user, caseId))
    ? null
    : NextResponse.json({ error: `${resource} not found` }, { status: 404 });
}
