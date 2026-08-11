"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  createStudioTranslator,
  resolveStudioLocale,
  type StudioLocale,
  type StudioMessageKey,
  type StudioVars,
} from "@/lib/studio/i18n/messages";

export type { StudioLocale, StudioMessageKey, StudioVars };
export {
  createStudioTranslator,
  fieldLabel,
  formatStudioDate,
  getSiteCopyCatalog,
  labelLang,
  labelPriority,
  labelStatus,
  resolveStudioLocale,
  studioDateLocale,
  studioMessages,
  translateStudio,
} from "@/lib/studio/i18n/messages";

type I18nValue = {
  locale: StudioLocale;
  setLocale: (locale: StudioLocale) => void;
  t: (key: StudioMessageKey, vars?: StudioVars) => string;
};

const I18nContext = createContext<I18nValue | null>(null);
const COOKIE_NAME = "studio_locale";

function cookieLocale(): StudioLocale | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return match?.[1] === "en" || match?.[1] === "ru" ? match[1] : null;
}

export function StudioI18nProvider({
  children,
  initialLocale = "ru",
}: {
  children: React.ReactNode;
  initialLocale?: StudioLocale | string;
}) {
  const bootLocale = resolveStudioLocale(initialLocale);
  const [locale, setLocaleState] = useState<StudioLocale>(bootLocale);

  useEffect(() => {
    const saved = cookieLocale() || (localStorage.getItem(COOKIE_NAME) as StudioLocale | null);
    if (saved === "ru" || saved === "en") setLocaleState(saved);
  }, []);

  const setLocale = useCallback((next: StudioLocale) => {
    setLocaleState(next);
    document.cookie = `${COOKIE_NAME}=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    localStorage.setItem(COOKIE_NAME, next);
    document.documentElement.lang = next;
    void fetch("/api/studio/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminLocale: next }),
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<I18nValue>(
    () => ({
      locale,
      setLocale,
      t: (key, vars) => createStudioTranslator(locale)(key, vars),
    }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useStudioI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useStudioI18n must be used inside StudioI18nProvider");
  return value;
}

export function StudioLanguageSelector() {
  const { locale, setLocale, t } = useStudioI18n();
  return (
    <label className="st-language">
      <span className="st-visually-hidden">{t("nav.language")}</span>
      <select
        value={locale}
        onChange={(event) => setLocale(event.target.value as StudioLocale)}
        aria-label={t("nav.language")}
      >
        <option value="ru">RU</option>
        <option value="en">EN</option>
      </select>
    </label>
  );
}
