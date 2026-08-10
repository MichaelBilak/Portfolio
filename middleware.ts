import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// ── Rate limiting for /api/contact ───────────────────────────
// Prefer Upstash when configured; otherwise in-memory (resets on cold start).

const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

function checkMemoryRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

async function checkRateLimit(ip: string): Promise<boolean> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    try {
      const key = `contact-rl:${ip}`;
      const incrRes = await fetch(`${upstashUrl}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["INCR", key],
          ["EXPIRE", key, "60"],
        ]),
      });
      if (incrRes.ok) {
        const data = (await incrRes.json()) as Array<{ result: number }>;
        const count = data?.[0]?.result ?? 0;
        return count <= RATE_LIMIT;
      }
    } catch {
      // fall through to memory
    }
  }

  return checkMemoryRateLimit(ip);
}

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip i18n for Payload admin + Payload REST/GraphQL (except contact rate-limit)
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/graphql") ||
    (pathname.startsWith("/api/") &&
      pathname !== "/api/contact" &&
      !pathname.startsWith("/api/contact/"))
  ) {
    return NextResponse.next();
  }

  // CMS-managed redirects (static next.config redirects still apply)
  if (!pathname.startsWith("/api") && !pathname.startsWith("/admin")) {
    try {
      const redirectRes = await fetch(
        new URL(`/api/site-redirects?path=${encodeURIComponent(pathname)}`, request.url),
        { next: { revalidate: 60 } },
      ).catch(() => null);
      if (redirectRes?.ok) {
        const data = (await redirectRes.json()) as {
          toPath?: string;
          permanent?: boolean;
        } | null;
        if (data?.toPath) {
          return NextResponse.redirect(
            new URL(data.toPath, request.url),
            data.permanent === false ? 302 : 301,
          );
        }
      }
    } catch {
      // ignore redirect lookup failures
    }
  }

  if (pathname === "/api/contact") {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    if (!(await checkRateLimit(ip))) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: {
          "Retry-After": "60",
          "Content-Type": "text/plain",
        },
      });
    }
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
