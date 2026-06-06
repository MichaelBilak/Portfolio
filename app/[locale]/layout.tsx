import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  IBM_Plex_Mono,
  Manrope,
  Unbounded,
} from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ClientProviders } from "@/components/client-providers";
import { Locale } from "@/lib/translations";
import "../globals.css";

// Expressive display (hero + section accents + big numbers) — bold, modern,
// Red Collar-style impact. Used sparingly. Supports Cyrillic.
const display = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
  preload: false,
});

// Brand wordmark keeps its original serif so the logo lockup never changes.
// (Not part of the 3-font UI system — it's a locked brand asset.)
const brand = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "600"],
  variable: "--font-brand",
  display: "swap",
  preload: true,
});

// Body — premium geometric grotesque with Cyrillic coverage.
const sans = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

// Mono labels / eyebrows — refined, Cyrillic-aware.
const mono = IBM_Plex_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

const siteUrl = "https://bilakstudio.it";
const logoUrl = "/images/logo-dm-group.png";

const localeMetaContent: Record<
  Locale,
  { title: string; description: string; ogLocale: string }
> = {
  it: {
    title: "DormUp Group · Studio Digitale",
    description:
      "Studio digitale a Rimini, Italia. Creiamo siti ed esperienze digitali premium per brand e business che vogliono distinguersi: design distintivo, strategia concreta, risultati misurabili.",
    ogLocale: "it_IT",
  },
  en: {
    title: "DormUp Group · Digital Studio",
    description:
      "Digital studio in Rimini, Italy. We craft premium websites and digital experiences for brands and businesses that want to stand out—distinctive design, sharp strategy, measurable results.",
    ogLocale: "en_US",
  },
  fr: {
    title: "DormUp Group · Studio Digital",
    description:
      "Studio digital à Rimini, Italie. Nous créons des sites et expériences digitales premium pour marques et business qui veulent se démarquer — design distinctif, stratégie concrète, résultats mesurables.",
    ogLocale: "fr_FR",
  },
  ru: {
    title: "DormUp Group · Диджитал Студия",
    description:
      "Диджитал-студия в Римини, Италия. Создаём премиум-сайты и цифровые решения для брендов и бизнесов, которым важно выделяться — выразительный дизайн, чёткая стратегия, измеримый результат.",
    ogLocale: "ru_RU",
  },
  de: {
    title: "DormUp Group · Digitalstudio",
    description:
      "Digitalstudio in Rimini, Italien. Wir gestalten Premium-Websites und digitale Erlebnisse für Marken und Unternehmen, die herausstechen wollen — ausdrucksstarkes Design, klare Strategie, messbare Ergebnisse.",
    ogLocale: "de_DE",
  },
};

function localePath(locale: Locale): string {
  return locale === routing.defaultLocale ? "/" : `/${locale}`;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: Pick<LayoutProps, "params">): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: Locale = hasLocale(routing.locales, locale)
    ? (locale as Locale)
    : routing.defaultLocale;

  const meta = localeMetaContent[safeLocale];
  const languages: Record<string, string> = {};
  routing.locales.forEach((code) => {
    languages[code] = `${siteUrl}${localePath(code)}`;
  });

  return {
    metadataBase: new URL(siteUrl),
    title: meta.title,
    description: meta.description,
    icons: {
      icon: [{ url: "/icon.png", type: "image/png" }],
      shortcut: [{ url: "/icon.png", type: "image/png" }],
      apple: [{ url: "/icon.png", type: "image/png" }],
    },
    alternates: {
      canonical: `${siteUrl}${localePath(safeLocale)}`,
      languages: {
        ...languages,
        "x-default": `${siteUrl}/`,
      },
    },
    robots: { index: true, follow: true },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
      locale: meta.ogLocale,
      url: `${siteUrl}${localePath(safeLocale)}`,
      images: [
        {
          url: "/images/og-cover.svg",
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ["/images/og-cover.svg"],
    },
  };
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "DormUp Group Digital Studio",
    email: "dormup.it@gmail.com",
    image: `${siteUrl}${logoUrl}`,
    logo: `${siteUrl}${logoUrl}`,
    url: `${siteUrl}${localePath(locale as Locale)}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Rimini",
      addressCountry: "IT",
    },
    description: localeMetaContent[locale as Locale].description,
    areaServed: "Italia",
    sameAs: [
      "https://www.instagram.com/",
      "https://www.linkedin.com/",
    ],
  };

  return (
    <html lang={locale}>
      <body className={`${display.variable} ${brand.variable} ${sans.variable} ${mono.variable} font-sans bg-bgPrimary antialiased`}>
        <ClientProviders>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ClientProviders>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </body>
    </html>
  );
}
