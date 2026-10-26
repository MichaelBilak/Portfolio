import { CONTACT_EMAIL } from "@/lib/contact-email";
import { BRAND_NAME, INSTAGRAM_URL, SITE_URL } from "@/lib/brand";
import { absoluteUrl } from "@/lib/site-paths";
import type { Locale } from "@/lib/translations";

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const LOGO_PATH = "/images/logo-dm-group.png";

const HOME_LABEL: Record<Locale, string> = {
  it: "Inizio",
  en: "Home",
  fr: "Accueil",
  ru: "Главная",
  de: "Startseite",
  es: "Inicio",
};

const FAQ_HEADING: Record<Locale, string> = {
  it: "Domande frequenti",
  en: "FAQ",
  fr: "Questions fréquentes",
  ru: "Вопросы и ответы",
  de: "Häufige Fragen",
  es: "Preguntas frecuentes",
};

export function breadcrumbHomeLabel(locale: Locale): string {
  return HOME_LABEL[locale];
}

export function faqHeading(locale: Locale): string {
  return FAQ_HEADING[locale];
}

export function organizationJsonLd(locale: Locale, description: string) {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: BRAND_NAME,
    url: absoluteUrl(locale),
    email: CONTACT_EMAIL,
    logo: `${SITE_URL}${LOGO_PATH}`,
    image: `${SITE_URL}${LOGO_PATH}`,
    description,
    sameAs: [INSTAGRAM_URL],
    areaServed: [
      { "@type": "City", name: "Rimini" },
      { "@type": "AdministrativeArea", name: "Emilia-Romagna" },
      { "@type": "Country", name: "Italy" },
    ],
  };
}

export function websiteJsonLd(locale: Locale, description: string) {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: BRAND_NAME,
    url: absoluteUrl(locale),
    description,
    publisher: { "@id": ORG_ID },
    inLanguage: locale,
  };
}

export function serviceJsonLd(input: {
  locale: Locale;
  name: string;
  description: string;
  path: string;
  serviceType?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.locale, input.path),
    provider: { "@id": ORG_ID },
    serviceType: input.serviceType || input.name,
    areaServed: [
      { "@type": "City", name: "Rimini" },
      { "@type": "Country", name: "Italy" },
    ],
  };
}

export function breadcrumbJsonLd(
  locale: Locale,
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(locale, item.path),
    })),
  };
}

export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data);
}
