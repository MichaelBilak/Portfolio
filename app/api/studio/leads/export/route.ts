import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStudioUser } from "@/lib/studio/auth";
import {
  applyLeadFilters,
  leadsToCsv,
  parseLeadListFilters,
} from "@/lib/studio/leads";

export async function GET(request: NextRequest) {
  const auth = await requireStudioUser({ leads: true });
  if ("error" in auth) return auth.error;

  const filters = parseLeadListFilters(request);
  const sb = createAdminClient();
  let query = sb
    .from("leads")
    .select(
      "id, created_at, status, priority, full_name, email, business_name, business_type, site_url, source, intent, locale, assignee_id, first_responded_at, next_action_at, lost_reason, brief",
    )
    .order(filters.sort || "created_at", { ascending: filters.order === "asc" })
    .limit(5000);

  query = applyLeadFilters(query, filters);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const csv = leadsToCsv((data || []) as Array<Record<string, unknown>>);
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-export.csv"`,
    },
  });
}
