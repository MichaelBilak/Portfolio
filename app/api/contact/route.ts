import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface ContactPayload {
  fullName?: string;
  businessName?: string;
  businessType?: string;
  brief?: string;
  source?: string;
}

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

function buildHtml(p: Required<ContactPayload>): string {
  const businessTypeLabel = BUSINESS_TYPE_LABELS[p.businessType] ?? p.businessType;
  const sourceLabel = SOURCE_LABELS[p.source] ?? p.source;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Audit Request</title>
</head>
<body style="margin:0;padding:0;background:#07090f;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#07090f;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:32px;">
              <p style="margin:0;font-size:22px;font-weight:300;letter-spacing:-0.01em;color:#f8fafc;">
                Dorm<span style="color:#fcd34d;">Up</span>
                <span style="margin-left:10px;font-size:9px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:rgba(248,250,252,0.7);vertical-align:middle;">GROUP</span>
                <span style="margin-left:6px;font-size:8px;font-weight:500;letter-spacing:0.22em;text-transform:uppercase;color:rgba(252,211,77,0.6);vertical-align:middle;">Digital Agency</span>
              </p>
              <p style="margin:4px 0 0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(148,163,184,0.6);">
                New audit request
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding-bottom:28px;">
              <div style="height:1px;background:linear-gradient(to right,rgba(252,211,77,0.35),transparent);"></div>
            </td>
          </tr>

          <!-- Fields -->
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0">

                ${field("Full Name", p.fullName)}
                ${field("Business Name", p.businessName)}
                ${field("Business Type", businessTypeLabel)}
                ${field("How did they find us", sourceLabel)}

                <!-- Brief -->
                <tr>
                  <td style="padding-bottom:20px;">
                    <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(252,211,77,0.75);">
                      Brief / Project description
                    </p>
                    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:14px 16px;">
                      <p style="margin:0;font-size:14px;line-height:1.65;color:#e2e8f0;white-space:pre-wrap;">${escapeHtml(p.brief)}</p>
                    </div>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:4px 0 24px;">
              <div style="height:1px;background:rgba(148,163,184,0.12);"></div>
            </td>
          </tr>

          <!-- Footer note -->
          <tr>
            <td>
              <p style="margin:0;font-size:11px;color:rgba(148,163,184,0.5);letter-spacing:0.04em;">
                Sent automatically from the website contact form · dormup-it.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function field(label: string, value: string): string {
  return `
    <tr>
      <td style="padding-bottom:16px;">
        <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(252,211,77,0.75);">${label}</p>
        <p style="margin:0;font-size:14px;color:#f8fafc;padding:10px 14px;background:rgba(255,255,255,0.03);border-radius:8px;border:1px solid rgba(255,255,255,0.06);">${escapeHtml(value)}</p>
      </td>
    </tr>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as ContactPayload;

  if (!payload.fullName || !payload.businessName || !payload.brief) {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }

  const p: Required<ContactPayload> = {
    fullName: payload.fullName,
    businessName: payload.businessName,
    businessType: payload.businessType ?? "other",
    brief: payload.brief,
    source: payload.source ?? "other",
  };

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  const toEmail = process.env.CONTACT_TO_EMAIL ?? "dormup.it@gmail.com";

  if (gmailUser && gmailPass) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
    });

    await transporter.sendMail({
      from: `"DormUp Group" <${gmailUser}>`,
      to: toEmail,
      subject: `✦ New audit request — ${p.businessName}`,
      html: buildHtml(p),
    });
  } else {
    console.log("[contact] Email env vars not set — logging payload:", p);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
