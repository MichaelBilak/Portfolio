import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Mono, DM_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Locale } from "@/lib/translations";
import "../globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "600"],
  variable: "--font-display",
});

const sans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
});

const mono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
});

const siteUrl = "https://bilakstudio.it";

const localeMetaContent: Record<
  Locale,
  { title: string; description: string; ogLocale: string }
> = {
  it: {
    title: "Bilak Michael · Web Designer Rimini — Siti per Ristoranti e Hotel",
    description:
      "Studio digitale a Rimini. Creo siti web premium per ristoranti, hotel e business locali. Design che converte, sviluppo pulito.",
    ogLocale: "it_IT",
  },
  en: {
    title: "Bilak Michael · Web Designer Rimini — Websites for Restaurants and Hotels",
    description:
      "Digital studio in Rimini. I build premium websites for restaurants, hotels and local businesses. Design that converts, clean development.",
    ogLocale: "en_US",
  },
  fr: {
    title: "Bilak Michael · Web Designer Rimini — Sites pour Restaurants et Hotels",
    description:
      "Studio digital a Rimini. Je cree des sites premium pour restaurants, hotels et business locaux. Design qui convertit, code propre.",
    ogLocale: "fr_FR",
  },
  ru: {
    title: "Bilak Michael · Web Designer Rimini — Сайты для ресторанов и отелей",
    description:
      "Цифровая студия в Римини. Создаём премиум-сайты для ресторанов, отелей и локальных бизнесов. Дизайн под конверсию, чистый код.",
    ogLocale: "ru_RU",
  },
  de: {
    title: "Bilak Michael · Web Designer Rimini — Websites fur Restaurants und Hotels",
    description:
      "Digitales Studio in Rimini. Ich baue Premium-Websites fur Restaurants, Hotels und lokale Unternehmen. Design das konvertiert, sauberer Code.",
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
    name: "Bilak Michael Digital Studio",
    image: `${siteUrl}/images/og-cover.svg`,
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
      "https://wa.me/393333333333",
    ],
  };

  return (
    <html lang={locale}>
      <body className={`${display.variable} ${sans.variable} ${mono.variable} bg-bgPrimary antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </body>
    </html>
  );
}
