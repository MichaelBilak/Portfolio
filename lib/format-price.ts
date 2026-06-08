import type { Locale } from "@/lib/translations";
import type { AddonPriceType } from "@/data/pricing";

const LOCALE_FORMAT: Record<
  Locale,
  { decimal: string; thousands: string; currencyBefore: boolean }
> = {
  it: { decimal: ",", thousands: ".", currencyBefore: false },
  en: { decimal: ".", thousands: ",", currencyBefore: false },
  fr: { decimal: ",", thousands: "\u202f", currencyBefore: false },
  ru: { decimal: ",", thousands: "\u202f", currencyBefore: false },
  de: { decimal: ",", thousands: ".", currencyBefore: false },
  es: { decimal: ",", thousands: ".", currencyBefore: false },
};

function formatNumber(amount: number, locale: Locale): string {
  const { decimal, thousands } = LOCALE_FORMAT[locale];
  const [whole, frac] = amount.toFixed(0).split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
  return frac ? `${grouped}${decimal}${frac}` : grouped;
}

/** Format a EUR amount for display, e.g. "€1.299" or "€1,299" */
export function formatEur(
  amount: number,
  locale: Locale,
  opts?: { monthly?: boolean; prefix?: AddonPriceType | "none" }
): string {
  const num = formatNumber(amount, locale);
  const { currencyBefore } = LOCALE_FORMAT[locale];
  const core = currencyBefore ? `€${num}` : `€${num}`;
  const monthly = opts?.monthly ? monthlySuffix(locale) : "";
  if (opts?.prefix === "plus") return `+${core}${monthly}`;
  if (opts?.prefix === "from") return core + monthly;
  return core + monthly;
}

function monthlySuffix(locale: Locale): string {
  switch (locale) {
    case "it":
      return "/mese";
    case "en":
      return "/mo";
    case "fr":
      return "/mois";
    case "ru":
      return "/мес";
    case "de":
      return "/Mon.";
    case "es":
      return "/mes";
  }
}

export function fromLabel(locale: Locale): string {
  switch (locale) {
    case "it":
      return "da";
    case "en":
      return "from";
    case "fr":
      return "à partir de";
    case "ru":
      return "от";
    case "de":
      return "ab";
    case "es":
      return "desde";
  }
}

/** Full display: "da €1.299" / "from €1,299" */
export function formatFromPrice(
  amount: number,
  locale: Locale,
  opts?: { monthly?: boolean }
): string {
  return `${fromLabel(locale)} ${formatEur(amount, locale, opts)}`;
}
