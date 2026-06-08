import type { Locale } from "@/lib/translations";

export interface LocaleMeta {
  langName: string;
  langCode: string;
  selectorLabel: string;
}

/** Minimal locale labels for client UI — avoids bundling full translations. */
export const localeMeta: Record<Locale, LocaleMeta> = {
  it: { langName: "Italiano", langCode: "IT", selectorLabel: "Lingua" },
  en: { langName: "English", langCode: "EN", selectorLabel: "Language" },
  fr: { langName: "Francais", langCode: "FR", selectorLabel: "Langue" },
  ru: { langName: "Русский", langCode: "RU", selectorLabel: "Язык" },
  de: { langName: "Deutsch", langCode: "DE", selectorLabel: "Sprache" },
  es: { langName: "Español", langCode: "ES", selectorLabel: "Idioma" },
};

export const localeOrder: Locale[] = ["it", "en", "fr", "ru", "de", "es"];
