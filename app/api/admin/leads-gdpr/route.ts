import { NextRequest, NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payload";

export const dynamic = "force-dynamic";

/** GDPR data export for a lead (owner/editor/sales via Payload cookie auth). */
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "id required" }, { status: 400 });
  }

  try {
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: request.headers });
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const role = (user as { role?: string }).role;
    if (!role || !["owner", "editor", "sales"].includes(role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const lead = await payload.findByID({
      collection: "leads",
      id,
      depth: 0,
      overrideAccess: true,
    });

    const exportBody = {
      exportedAt: new Date().toISOString(),
      purpose: "GDPR data subject access / portability",
      data: lead,
    };

    return new NextResponse(JSON.stringify(exportBody, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="lead-${id}.json"`,
      },
    });
  } catch (err) {
    console.error("[gdpr-export]", err);
    return NextResponse.json({ message: "Export failed" }, { status: 500 });
  }
}

/** GDPR erase lead (owner only). */
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "id required" }, { status: 400 });
  }

  try {
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: request.headers });
    if (!user || (user as { role?: string }).role !== "owner") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await payload.delete({
      collection: "leads",
      id,
      overrideAccess: true,
    });

    await payload.create({
      collection: "audit-logs",
      overrideAccess: true,
      data: {
        action: "gdpr_erase",
        collection: "leads",
        documentId: String(id),
        summary: `Lead ${id} erased (GDPR)`,
        actor: user.id,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[gdpr-erase]", err);
    return NextResponse.json({ message: "Erase failed" }, { status: 500 });
  }
}
