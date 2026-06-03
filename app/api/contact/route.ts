import { NextRequest, NextResponse } from "next/server";

interface ContactPayload {
  fullName?: string;
  businessName?: string;
  businessType?: string;
  brief?: string;
  source?: string;
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as ContactPayload;

  if (!payload.fullName || !payload.businessName || !payload.brief) {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }

  // Optional: connect here to Resend/Nodemailer via env vars in production.
  console.log("Contact request", payload);

  return NextResponse.json({ ok: true }, { status: 200 });
}
