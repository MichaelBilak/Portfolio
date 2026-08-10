import { NextRequest, NextResponse } from "next/server";
import { getRedirectMatch } from "@/lib/cms/catalog";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");
  if (!path || !path.startsWith("/")) {
    return NextResponse.json(null);
  }

  try {
    const match = await getRedirectMatch(path);
    if (!match) return NextResponse.json(null);
    return NextResponse.json(match);
  } catch {
    return NextResponse.json(null);
  }
}
