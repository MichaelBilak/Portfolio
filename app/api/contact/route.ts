import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import {
  buildServiceEmailLines,
} from "@/lib/order-email-pricing";

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
    "  NEW AUDIT REQUEST  —  DormUp Group",
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

  const credentials = JSON.parse(credentialsJson) as object;

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

  // Append the new row
  const appendResult = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Sheet1!A:H",
    valueInputOption: "USER_ENTERED",
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

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as ContactPayload;
  const isAudit = payload.intent === "audit";

  if (!payload.email) {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }

  if (!isAudit && !payload.businessName?.trim()) {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }

  const businessType = payload.businessType ?? "other";
  const businessTypeLabel = BUSINESS_TYPE_LABELS[businessType] ?? businessType;

  const p: ContactFormPayload = {
    fullName: payload.fullName?.trim() || "—",
    email: payload.email,
    businessName: payload.businessName?.trim() || businessTypeLabel,
    businessType,
    brief: payload.brief?.trim() || "—",
    source: payload.source ?? "other",
  };

  const siteUrl = payload.siteUrl?.trim();

  const selectedServices = Array.isArray(payload.selectedServices)
    ? payload.selectedServices.filter((s) => typeof s === "string" && s.trim())
    : [];
  const selectedServiceSlugs = Array.isArray(payload.selectedServiceSlugs)
    ? payload.selectedServiceSlugs.filter((s) => typeof s === "string" && s.trim())
    : [];
  const selectedAddons = Array.isArray(payload.selectedAddons)
    ? payload.selectedAddons.filter((s) => typeof s === "string" && s.trim())
    : [];

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
      from: `"DormUp Group" <${gmailUser}>`,
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

  await Promise.all([emailPromise, sheetsPromise]);

  return NextResponse.json({ ok: true }, { status: 200 });
}
