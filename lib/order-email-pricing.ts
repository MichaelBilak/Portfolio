import { servicesMeta } from "@/data/services";
import type { Locale } from "@/lib/translations";

const LOCALES: Locale[] = ["it", "en", "fr", "ru", "de", "es"];

export function parseEmailLocale(value?: string): Locale {
  const candidate = value?.toLowerCase();
  return LOCALES.includes(candidate as Locale) ? (candidate as Locale) : "en";
}

export function buildServiceEmailLines(
  slugs: string[],
  titles: string[],
): string[] {
  const lines: string[] = [];

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    const title = titles[i]?.trim() || slug;
    const meta = servicesMeta.find((m) => m.slug === slug);
    if (!meta) {
      lines.push(`• ${title}`);
      continue;
    }

    lines.push(`• ${title}`);
  }

  return lines;
}
