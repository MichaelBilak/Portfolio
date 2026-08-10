import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import {
  buildServiceEmailLines,
} from "@/lib/order-email-pricing";

// ── Validation constants ──────────────────────────────────────
const FIELD_LIMITS = {
  fullName: 200,
  email: 320,
  businessName: 300,
  brief: 5000,
  siteUrl: 500,
} as const;

const VALID_BUSINESS_TYPES = ["restaurant", "hotel", "bar", "other"] as const;
const VALID_SOURCES = ["google", "referral", "social", "other"] as const;
const VALID_INTENTS = ["audit", "contact"] as const;

// RFC 5321 compliant, rejects newlines (email injection prevention)
const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;

const MAX_ARRAY_LENGTH = 20;
const MAX_ARRAY_ITEM_LENGTH = 200;

interface ContactPayload {
  fullName?: string;
  email?: string;
  businessName?: string;
  businessType?: string;
  siteUrl?: string;
  brief?: string;
  source?: string;
  intent?: string;
  locale?: string;
  selectedServices?: string[];
  selectedServiceSlugs?: string[];
  selectedAddons?: string[];
  turnstileToken?: string;
  /** Honeypot — must stay empty */
  website?: string;
}

type ContactFormPayload = Required<
  Pick<ContactPayload, "fullName" | "email" | "businessName" | "businessType" | "brief" | "source">
>;

const BUSINESS_TYPE_LABELS: Record<string, string> = {
  restaurant: "Restaurant",
  hotel: "Hotel",
  bar: "Bar / Café",
  other: "Other",
};

const SOURCE_LABELS: Record<string, string> = {
  google: "Google Search",
  referral: "Referral",
  social: "Social Media",
  other: "Other",
};

function buildPlainText(
  p: ContactFormPayload,
  timestamp: string,
  selectedServices: string[],
  selectedServiceSlugs: string[],
  selectedAddons: string[],
  siteUrl?: string,
): string {
  const businessTypeLabel = BUSINESS_TYPE_LABELS[p.businessType] ?? p.businessType;
  const sourceLabel = SOURCE_LABELS[p.source] ?? p.source;

  const lines = [
    "================================================",
    "  NEW AUDIT REQUEST  —  DormUp Studio",
    "================================================",
    "",
    `Date / Time:     ${timestamp}`,
    `Full Name:       ${p.fullName}`,
    `Email:           ${p.email}`,
    `Business Name:   ${p.businessName}`,
    `Business Type:   ${businessTypeLabel}`,
    `How found us:    ${sourceLabel}`,
  ];

  if (siteUrl?.trim()) {
    lines.push(`Website URL:     ${siteUrl.trim()}`);
  }

  if (selectedServices.length > 0) {
    lines.push("", "Selected Services", "------------------------------------------------");
    lines.push(...buildServiceEmailLines(selectedServiceSlugs, selectedServices));
  }

  if (selectedAddons.length > 0) {
    lines.push("", "Add-on Modules", "------------------------------------------------");
    for (const name of selectedAddons) {
      lines.push(`• ${name}`);
    }
  }

  lines.push(
    "",
    "Brief / Project Description",
    "------------------------------------------------",
    p.brief,
    "",
    "------------------------------------------------",
    "Sent automatically from dormup-it.com",
  );

  return lines.join("\n");
}

async function appendToGoogleSheets(
  p: ContactFormPayload,
  timestamp: string,
): Promise<void> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const credentialsJson = process.env.GOOGLE_SHEETS_CREDENTIALS_JSON;

  if (!spreadsheetId || !credentialsJson) return;

  let credentials: object;
  try {
    credentials = JSON.parse(credentialsJson) as object;
  } catch {
    console.error("[contact] Invalid GOOGLE_SHEETS_CREDENTIALS_JSON — skipping Sheets");
    return;
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const businessTypeLabel = BUSINESS_TYPE_LABELS[p.businessType] ?? p.businessType;
  const sourceLabel = SOURCE_LABELS[p.source] ?? p.source;

  // Get the current number of rows to calculate the next ID
  const meta = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Sheet1!A:A",
  });
  const existingRows = meta.data.values?.length ?? 1;
  const nextId = existingRows; // row 1 = header, so row 2 = ID #1, etc.

  // Append the new row — RAW prevents formula injection from user input
  const appendResult = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Sheet1!A:H",
    valueInputOption: "RAW",
    includeValuesInResponse: true,
    requestBody: {
      values: [
        [
          nextId,
          timestamp,
          p.fullName,
          p.email,
          p.businessName,
          businessTypeLabel,
          sourceLabel,
          p.brief,
        ],
      ],
    },
  });

  // Highlight the new row in light yellow to mark it as "new"
  const updatedRange = appendResult.data.updates?.updatedRange;
  if (!updatedRange) return;

  // Parse the row index from the updated range (e.g. "Sheet1!A5:H5" → row 5 → index 4)
  const rowMatch = updatedRange.match(/(\d+)(?::\w+\d+)?$/);
  if (!rowMatch) return;
  const rowIndex = parseInt(rowMatch[1], 10) - 1; // 0-based

  // Get sheet ID
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
  const sheetId = spreadsheet.data.sheets?.[0]?.properties?.sheetId ?? 0;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          repeatCell: {
            range: {
              sheetId,
              startRowIndex: rowIndex,
              endRowIndex: rowIndex + 1,
              startColumnIndex: 0,
              endColumnIndex: 8,
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 1, green: 0.976, blue: 0.773 }, // #FFF8C5 yellow
                textFormat: { bold: false },
              },
            },
            fields: "userEnteredFormat(backgroundColor,textFormat)",
          },
        },
      ],
    },
  });
}

function bad(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}

function safeArray(value: unknown, maxItems = MAX_ARRAY_LENGTH): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((s): s is string => typeof s === "string")
    .slice(0, maxItems)
    .map((s) => s.slice(0, MAX_ARRAY_ITEM_LENGTH).trim())
    .filter(Boolean);
}

export async function POST(request: NextRequest) {
  // ── Parse ──────────────────────────────────────────────────
  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return bad("Invalid JSON");
  }

  // Honeypot
  if (payload.website && String(payload.website).trim()) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // Cloudflare Turnstile (when configured)
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const token = typeof payload.turnstileToken === "string" ? payload.turnstileToken : "";
    if (!token) return bad("Captcha required");
    try {
      const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: turnstileSecret,
          response: token,
        }),
      });
      const result = (await verify.json()) as { success?: boolean };
      if (!result.success) return bad("Captcha failed");
    } catch {
      return bad("Captcha verification error", 502);
    }
  }

  // ── Validate email (required, max length, no injection) ────
  const rawEmail = typeof payload.email === "string" ? payload.email : "";
  const cleanEmail = rawEmail.replace(/[\r\n\t]/g, "").trim();

  if (!cleanEmail) {
    return bad("Email is required");
  }
  if (cleanEmail.length > FIELD_LIMITS.email) {
    return bad("Email too long");
  }
  if (!EMAIL_RE.test(cleanEmail)) {
    return bad("Invalid email");
  }

  // ── Validate field lengths ─────────────────────────────────
  if (payload.fullName && payload.fullName.length > FIELD_LIMITS.fullName) {
    return bad("Name too long");
  }
  if (payload.businessName && payload.businessName.length > FIELD_LIMITS.businessName) {
    return bad("Business name too long");
  }
  if (payload.brief && payload.brief.length > FIELD_LIMITS.brief) {
    return bad("Brief too long");
  }
  if (payload.siteUrl && payload.siteUrl.length > FIELD_LIMITS.siteUrl) {
    return bad("URL too long");
  }

  // ── Whitelist enum fields ──────────────────────────────────
  const intent = VALID_INTENTS.includes(payload.intent as typeof VALID_INTENTS[number])
    ? payload.intent
    : undefined;
  const isAudit = intent === "audit";

  const businessType = VALID_BUSINESS_TYPES.includes(payload.businessType as typeof VALID_BUSINESS_TYPES[number])
    ? (payload.businessType as typeof VALID_BUSINESS_TYPES[number])
    : "other";

  const source = VALID_SOURCES.includes(payload.source as typeof VALID_SOURCES[number])
    ? (payload.source as typeof VALID_SOURCES[number])
    : "other";

  // ── Validate arrays ────────────────────────────────────────
  const selectedServices = safeArray(payload.selectedServices);
  const selectedServiceSlugs = safeArray(payload.selectedServiceSlugs);
  const selectedAddons = safeArray(payload.selectedAddons);

  // ── Business logic validation ──────────────────────────────
  if (!isAudit && !payload.businessName?.trim()) {
    return bad("Business name is required");
  }

  const businessTypeLabel = BUSINESS_TYPE_LABELS[businessType];

  const p: ContactFormPayload = {
    fullName: payload.fullName?.trim().slice(0, FIELD_LIMITS.fullName) || "—",
    email: cleanEmail,
    businessName: payload.businessName?.trim().slice(0, FIELD_LIMITS.businessName) || businessTypeLabel,
    businessType,
    brief: payload.brief?.trim().slice(0, FIELD_LIMITS.brief) || "—",
    source,
  };

  const siteUrl = payload.siteUrl?.trim().slice(0, FIELD_LIMITS.siteUrl);
  const locale =
    typeof payload.locale === "string" &&
    ["it", "en", "fr", "ru", "de", "es"].includes(payload.locale)
      ? payload.locale
      : "it";

  const now = new Date();
  const timestamp = now.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Rome",
  });

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  const toEmail = process.env.CONTACT_TO_EMAIL ?? "dormup.it@gmail.com";

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    undefined;
  const userAgent = request.headers.get("user-agent") ?? undefined;

  const leadPromise = (async () => {
    try {
      const { isSupabaseConfigured, createAdminClient } = await import("@/lib/supabase/admin");
      if (!isSupabaseConfigured()) return;
      const sb = createAdminClient();
      const { error } = await sb.from("leads").insert({
        status: "new",
        priority: "normal",
        full_name: p.fullName,
        email: p.email,
        business_name: p.businessName,
        business_type: businessType,
        site_url: siteUrl || null,
        brief: p.brief,
        source,
        intent: isAudit ? "audit" : "contact",
        locale,
        selected_services: selectedServices,
        selected_service_slugs: selectedServiceSlugs,
        selected_addons: selectedAddons,
        ip: ip || null,
        user_agent: userAgent || null,
        raw_payload: payload as unknown as Record<string, unknown>,
      });
      if (error) throw error;
    } catch (err) {
      console.error("[contact] Failed to persist lead:", err);
    }
  })();

  const emailPromise = (async () => {
    if (!gmailUser || !gmailPass) {
      console.log("[contact] Email env vars not set — logging payload:", p);
      return;
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
    });
    await transporter.sendMail({
      from: `"DormUp Studio" <${gmailUser}>`,
      to: toEmail,
      subject: `New ${isAudit ? "audit" : "contact"} request — ${p.businessName}`,
      text: buildPlainText(
        p,
        timestamp,
        selectedServices,
        selectedServiceSlugs,
        selectedAddons,
        siteUrl,
      ),
    });
  })();

  const sheetsPromise = appendToGoogleSheets(p, timestamp).catch((err: unknown) => {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[contact] Google Sheets error:", msg);
  });

  await Promise.all([leadPromise, emailPromise, sheetsPromise]);

  return NextResponse.json({ ok: true }, { status: 200 });
}

