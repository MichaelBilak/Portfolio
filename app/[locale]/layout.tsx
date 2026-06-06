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
import { Locale } from "@/lib/translations";
import { LoadingScreen } from "@/components/loading-screen";
import "../globals.css";

// Expressive display (hero + section accents + big numbers) — bold, modern,
// Red Collar-style impact. Used sparingly. Supports Cyrillic.
const display = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

// Brand wordmark keeps its original serif so the logo lockup never changes.
// (Not part of the 3-font UI system — it's a locked brand asset.)
const brand = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "600"],
  variable: "--font-brand",
  display: "swap",
});

// Body — premium geometric grotesque with Cyrillic coverage.
const sans = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

// Mono labels / eyebrows — refined, Cyrillic-aware.
const mono = IBM_Plex_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = "https://bilakstudio.it";
const logoUrl = "/images/logo-dm-group.png";

const localeMetaContent: Record<
  Locale,
  { title: string; description: string; ogLocale: string }
> = {
  it: {
    title: "DormUp Group · Studio Digitale Emilia-Romagna - Posizionamento Digitale Esclusivo per il Tuo Brand.",
    description:
      "Studio digitale in Emilia-Romagna. Usiamo un approccio unico per valorizzare il tuo brand. Design che converte, sviluppo pulito, risultati rapidi.",
    ogLocale: "it_IT",
  },
  en: {
    title: "DormUp Group · Digital Studio Emilia-Romagna - Exclusive Digital Positioning for Your Brand.",
    description:
      "Digital studio in Emilia-Romagna. We use a unique approach to enhance your brand. Design that converts, clean development, quick results.",
    ogLocale: "en_US",
  },
  fr: {
    title: "DormUp Group · Studio Digital Emilia-Romagna - Positionnement Digital Exclusif pour Votre Marque.",
    description:
      "Studio digital en Emilia-Romagna. Nous utilisons une approche unique pour valoriser votre marque. Design qui convertit, développement propre, résultats rapides.",
    ogLocale: "fr_FR",
  },
  ru: {
    title: "DormUp Group · Диджитал Студия Эмилия-Романья - Эксклюзивное цифровое позиционирование вашего бренда.",
    description:
      "Диджитал студия в Эмилия-Романье. Мы используем уникальный подход, чтобы усилить ваш бренд. Дизайн, который конвертирует, чистая разработка, быстрые результаты.",
    ogLocale: "ru_RU",
  },
  de: {
    title: "DormUp Group · Digitalstudio Emilia-Romagna - Exklusive Digitale Positionierung für Ihre Marke.",
    description:
      "Digitalstudio in der Emilia-Romagna. Wir nutzen einen einzigartigen Ansatz, um Ihre Marke zu stärken. Design, das konvertiert, saubere Entwicklung, schnelle Ergebnisse.",
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
      addressLocality: "Emilia-Romagna",
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
        <LoadingScreen />
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
