/**
 * Public admin URL base path (obscure). Internal App Router stays under /studio.
 * Set NEXT_PUBLIC_STUDIO_PATH in env, e.g. /ops-k7m2xq9n4w
 */
export function getStudioBasePath(): string {
  const raw = (process.env.NEXT_PUBLIC_STUDIO_PATH || "/studio").trim();
  const withSlash = raw.startsWith("/") ? raw : `/${raw}`;
  return withSlash.replace(/\/+$/, "") || "/studio";
}

/** Build a public studio href, e.g. studioPath('/leads') → '/ops-…/leads' */
export function studioPath(subpath = ""): string {
  const base = getStudioBasePath();
  if (!subpath || subpath === "/") return base;
  const suffix = subpath.startsWith("/") ? subpath : `/${subpath}`;
  return `${base}${suffix}`;
}

export function isStudioPublicPath(pathname: string): boolean {
  const base = getStudioBasePath();
  return pathname === base || pathname.startsWith(`${base}/`);
}
