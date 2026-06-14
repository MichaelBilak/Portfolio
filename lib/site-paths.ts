import { routing } from "@/i18n/routing";
import { localeOrder } from "@/lib/locale-meta";
import { SITE_URL } from "@/lib/brand";
import type { Locale } from "@/lib/translations";

/** Path segment for a locale (`/` for default Italian). */
export function localePath(locale: Locale, pathname = ""): string {
  const base = locale === routing.defaultLocale ? "" : `/${locale}`;
  if (!pathname) return base || "/";
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${normalized}` || "/";
}

export function absoluteUrl(locale: Locale, pathname = ""): string {
  const path = localePath(locale, pathname);
  return `${SITE_URL}${path === "/" ? "" : path}`.replace(/\/$/, "") || SITE_URL;
}

export function localeAlternateLanguages(pathname = ""): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of localeOrder) {
    languages[locale] = absoluteUrl(locale, pathname);
  }
  languages["x-default"] = absoluteUrl(routing.defaultLocale, pathname);
  return languages;
}
