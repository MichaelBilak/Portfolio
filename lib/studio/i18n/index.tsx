"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type StudioLocale = "ru" | "en";

const messages = {
  ru: {
    "nav.overview": "Обзор",
    "nav.leads": "Лиды",
    "nav.cases": "Кейсы",
    "nav.tasks": "Задачи",
    "nav.documents": "Документы",
    "nav.automations": "Автоматизации",
    "nav.inbox": "Уведомления",
    "nav.reports": "Отчёты",
    "nav.website": "Сайт",
    "nav.settings": "Настройки",
    "nav.siteSettings": "Настройки сайта",
    "nav.crm": "CRM",
    "nav.content": "Контент",
    "nav.workspace": "Рабочее пространство",
    "role.owner": "Владелец",
    "role.editor": "Редактор",
    "role.sales": "Продажи",
    "role.manager": "Менеджер",
    "role.specialist": "Специалист",
    "role.viewer": "Наблюдатель",
    "common.loading": "Загрузка…",
    "common.retry": "Повторить",
    "common.empty": "Здесь пока ничего нет",
    "common.error": "Не удалось загрузить данные",
    "common.search": "Поиск",
    "common.refresh": "Обновить",
    "common.save": "Сохранить",
    "common.cancel": "Отмена",
    "common.add": "Добавить",
    "common.open": "Открыть",
    "common.all": "Все",
    "common.list": "Список",
    "common.board": "Доска",
    "common.endpointUnavailable": "Не удалось выполнить запрос к серверу.",
  },
  en: {
    "nav.overview": "Overview",
    "nav.leads": "Leads",
    "nav.cases": "Cases",
    "nav.tasks": "Tasks",
    "nav.documents": "Documents",
    "nav.automations": "Automations",
    "nav.inbox": "Notifications",
    "nav.reports": "Reports",
    "nav.website": "Website",
    "nav.settings": "Settings",
    "nav.siteSettings": "Site settings",
    "nav.crm": "CRM",
    "nav.content": "Content",
    "nav.workspace": "Workspace",
    "role.owner": "Owner",
    "role.editor": "Editor",
    "role.sales": "Sales",
    "role.manager": "Manager",
    "role.specialist": "Specialist",
    "role.viewer": "Viewer",
    "common.loading": "Loading…",
    "common.retry": "Retry",
    "common.empty": "Nothing here yet",
    "common.error": "Could not load data",
    "common.search": "Search",
    "common.refresh": "Refresh",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.add": "Add",
    "common.open": "Open",
    "common.all": "All",
    "common.list": "List",
    "common.board": "Board",
    "common.endpointUnavailable": "The server request could not be completed.",
  },
} as const;

export type StudioMessageKey = keyof (typeof messages)["en"];
type I18nValue = {
  locale: StudioLocale;
  setLocale: (locale: StudioLocale) => void;
  t: (key: StudioMessageKey) => string;
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
  const bootLocale: StudioLocale = initialLocale === "en" ? "en" : "ru";
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
      t: (key) => messages[locale][key],
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
  const { locale, setLocale } = useStudioI18n();
  return (
    <label className="st-language">
      <span className="st-visually-hidden">Admin language</span>
      <select
        value={locale}
        onChange={(event) => setLocale(event.target.value as StudioLocale)}
        aria-label="Admin language"
      >
        <option value="ru">RU</option>
        <option value="en">EN</option>
      </select>
    </label>
  );
}
