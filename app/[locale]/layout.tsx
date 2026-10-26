import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Manrope, Unbounded } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ClientProviders } from "@/components/client-providers";
import { AnalyticsScripts } from "@/components/analytics";
import { Locale } from "@/lib/translations";
import { SITE_URL } from "@/lib/brand";
import { LITE_MODE_BOOTSTRAP_SCRIPT } from "@/lib/lite-mode";
import { SPLASH_BOOTSTRAP_SCRIPT, SPLASH_GATE_ID } from "@/lib/splash-session";
import { getSeoDefaults } from "@/lib/cms/catalog";
import { localeMetaContent } from "@/lib/seo/locale-defaults";
import {
  jsonLdScript,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo/json-ld";
import "../globals.css";

const display = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600"],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

const brand = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600"],
  variable: "--font-brand",
  display: "swap",
  preload: true,
});

const sans = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

const mono = IBM_Plex_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

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

  // Defaults only — child pages must call buildPageMetadata with their path.
  // Do not set homepage-only canonical here (would leak to all routes).
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: meta.title,
      template: `%s | DormUp Studio`,
    },
    description: meta.description,
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
        { url: "/icon.png", sizes: "32x32", type: "image/png" },
      ],
      shortcut: [{ url: "/favicon.ico", type: "image/x-icon" }],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    robots:
      process.env.VERCEL_ENV === "preview"
        ? { index: false, follow: false }
        : { index: true, follow: true },
  };
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();
  const safeLocale = locale as Locale;
  const meta = localeMetaContent[safeLocale];

  let gaId: string | undefined;
  let plausibleDomain: string | undefined;
  try {
    const seo = await getSeoDefaults(safeLocale);
    gaId = seo.gaMeasurementId;
    plausibleDomain = seo.plausibleDomain;
  } catch {
    // CMS optional at first boot
  }

  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      organizationJsonLd(safeLocale, meta.description),
      websiteJsonLd(safeLocale, meta.description),
    ],
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: SPLASH_BOOTSTRAP_SCRIPT }}
        />
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: LITE_MODE_BOOTSTRAP_SCRIPT }}
        />
      </head>
      <body
        className={`${display.variable} ${brand.variable} ${sans.variable} ${mono.variable} font-sans bg-bgPrimary antialiased`}
      >
        <div id={SPLASH_GATE_ID} aria-hidden="true" />
        <ClientProviders>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ClientProviders>
        <AnalyticsScripts gaId={gaId} plausibleDomain={plausibleDomain} />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: jsonLdScript(schemaGraph) }}
        />
      </body>
    </html>
  );
}
