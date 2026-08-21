import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStudioUser } from "@/lib/studio/auth";
import { apiError, readJsonObject } from "@/lib/studio/api";
import { recordStudioMutation } from "@/lib/studio/audit";
import { appendLeadEvent } from "@/lib/studio/leads";

type ImportRow = {
  full_name?: string | null;
  email?: string | null;
  business_name?: string | null;
  business_type?: string | null;
  site_url?: string | null;
  brief?: string | null;
  source?: string | null;
  intent?: string | null;
  locale?: string | null;
  status?: string | null;
  priority?: string | null;
};

const FIELD_ALIASES: Record<keyof ImportRow, string[]> = {
  full_name: ["full_name", "fullname", "name", "client", "contact", "nome"],
  email: ["email", "e-mail", "mail"],
  business_name: ["business_name", "business", "company", "azienda", "brand"],
  business_type: ["business_type", "type", "categoria"],
  site_url: ["site_url", "website", "url", "site", "sito"],
  brief: ["brief", "notes", "note", "description", "descrizione"],
  source: ["source", "fonte", "origin"],
  intent: ["intent"],
  locale: ["locale", "lang", "language", "lingua"],
  status: ["status", "stato"],
  priority: ["priority", "priorita", "priorità"],
};

function normalizeHeader(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "_");
}

function mapRow(raw: Record<string, unknown>): ImportRow {
  const normalized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) {
    normalized[normalizeHeader(key)] = value;
  }
  const out: ImportRow = {};
  for (const [field, aliases] of Object.entries(FIELD_ALIASES) as Array<
    [keyof ImportRow, string[]]
  >) {
    for (const alias of aliases) {
      const value = normalized[alias];
      if (value == null || value === "") continue;
      out[field] = String(value).trim();
      break;
    }
  }
  return out;
}

function parseWorkbook(buffer: ArrayBuffer): ImportRow[] {
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return [];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
  return rows.map(mapRow);
}

function validateRow(row: ImportRow, index: number) {
  const errors: string[] = [];
  if (!row.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
    errors.push(`row ${index + 1}: invalid email`);
  }
  if (row.status && !["new", "in_progress", "won", "lost", "spam"].includes(row.status)) {
    errors.push(`row ${index + 1}: invalid status`);
  }
  if (row.priority && !["low", "normal", "high"].includes(row.priority)) {
    errors.push(`row ${index + 1}: invalid priority`);
  }
  return errors;
}

export async function POST(request: NextRequest) {
  const auth = await requireStudioUser({ leads: true });
  if ("error" in auth) return auth.error;

  try {
    const contentType = request.headers.get("content-type") || "";
    let rows: ImportRow[] = [];
    let dryRun = false;

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      dryRun = form.get("dryRun") === "1" || form.get("dryRun") === "true";
      const file = form.get("file");
      if (!(file instanceof File)) {
        return NextResponse.json({ error: "file is required" }, { status: 400 });
      }
      rows = parseWorkbook(await file.arrayBuffer());
    } else {
      const body = await readJsonObject(request);
      dryRun = Boolean(body.dryRun);
      if (Array.isArray(body.rows)) {
        rows = (body.rows as Record<string, unknown>[]).map(mapRow);
      } else if (typeof body.csv === "string") {
        const workbook = XLSX.read(body.csv, { type: "string" });
        const sheetName = workbook.SheetNames[0];
        const sheet = sheetName ? workbook.Sheets[sheetName] : null;
        const parsed = sheet
          ? XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" })
          : [];
        rows = parsed.map(mapRow);
      } else {
        return NextResponse.json({ error: "rows or csv required" }, { status: 400 });
      }
    }

    if (!rows.length) {
      return NextResponse.json({ error: "No rows found" }, { status: 400 });
    }
    if (rows.length > 1000) {
      return NextResponse.json({ error: "Max 1000 rows per import" }, { status: 400 });
    }

    const errors = rows.flatMap((row, index) => validateRow(row, index));
    const preview = rows.slice(0, 20).map((row) => ({
      email: row.email,
      full_name: row.full_name,
      business_name: row.business_name,
      source: row.source || "import",
      status: row.status || "new",
    }));

    if (dryRun || errors.length) {
      return NextResponse.json({
        dryRun: true,
        total: rows.length,
        valid: rows.length - errors.length,
        errors,
        preview,
      });
    }

    const sb = createAdminClient();
    const insertRows = rows.map((row) => ({
      status: row.status || "new",
      priority: row.priority || "normal",
      full_name: row.full_name || null,
      email: (row.email || "").toLowerCase(),
      business_name: row.business_name || null,
      business_type: row.business_type || null,
      site_url: row.site_url || null,
      brief: row.brief || null,
      source: row.source || "import",
      intent: row.intent || "contact",
      locale: row.locale || "it",
      selected_services: [],
      selected_service_slugs: [],
      selected_addons: [],
    }));

    const { data, error } = await sb.from("leads").insert(insertRows).select("id");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    for (const lead of data || []) {
      await appendLeadEvent(sb, {
        leadId: lead.id,
        actorId: auth.id,
        eventType: "imported",
        payload: { count: insertRows.length },
      });
    }

    await recordStudioMutation(sb, {
      actorId: auth.id,
      action: "lead.import",
      entity: "leads",
      meta: { count: data?.length || 0 },
    });

    return NextResponse.json({
      ok: true,
      imported: data?.length || 0,
      preview,
    });
  } catch (error) {
    return apiError(error);
  }
}
