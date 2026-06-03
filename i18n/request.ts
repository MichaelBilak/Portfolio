import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { Locale, translations } from "@/lib/translations";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: Locale = hasLocale(routing.locales, requested)
    ? (requested as Locale)
    : routing.defaultLocale;

  return {
    locale,
    messages: translations[locale] as unknown as Record<string, unknown>,
  };
});
