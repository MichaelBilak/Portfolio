import {
  SERVICE_BASE_PRICES,
  SERVICE_MONTHLY,
  type ServiceId,
} from "@/data/pricing";
import { servicesMeta } from "@/data/services";
import { formatFromPrice } from "@/lib/format-price";
import type { Locale } from "@/lib/translations";

const LOCALES: Locale[] = ["it", "en", "fr", "ru", "de", "es"];

export function parseEmailLocale(value?: string): Locale {
  const candidate = value?.toLowerCase();
  return LOCALES.includes(candidate as Locale) ? (candidate as Locale) : "en";
}

export function buildServiceEmailLines(
  slugs: string[],
  titles: string[],
  locale: Locale,
): { lines: string[]; total: number } {
  const lines: string[] = [];
  let total = 0;

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    const title = titles[i]?.trim() || slug;
    const meta = servicesMeta.find((m) => m.slug === slug);
    if (!meta) {
      lines.push(`• ${title}`);
      continue;
    }

    const id = meta.id as ServiceId;
    const amount = SERVICE_BASE_PRICES[id] ?? 0;
    total += amount;
    const price = formatFromPrice(amount, locale, {
      monthly: !!SERVICE_MONTHLY[id],
    });
    lines.push(`• ${title} — ${price}`);
  }

  return { lines, total };
}

export function formatEstimatedTotal(total: number, locale: Locale): string {
  const labels: Record<Locale, string> = {
    it: "Stima indicativa (da)",
    en: "Indicative estimate (from)",
    fr: "Estimation indicative (à partir de)",
    ru: "Ориентировочная сумма (от)",
    de: "Richtwert (ab)",
    es: "Estimación indicativa (desde)",
  };
  return `${labels[locale]}: ${formatFromPrice(total, locale)}`;
}
