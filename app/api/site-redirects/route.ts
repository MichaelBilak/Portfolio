import { NextRequest, NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payload";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");
  if (!path || !path.startsWith("/")) {
    return NextResponse.json(null);
  }

  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "redirects",
      where: {
        and: [
          { fromPath: { equals: path } },
          { enabled: { equals: true } },
        ],
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });

    const doc = result.docs[0];
    if (!doc) {
      return NextResponse.json(null);
    }

    return NextResponse.json({
      toPath: doc.toPath,
      permanent: doc.permanent !== false,
    });
  } catch {
    return NextResponse.json(null);
  }
}
