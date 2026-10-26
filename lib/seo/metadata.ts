import type { Metadata } from "next";
import { SITE_URL } from "@/lib/brand";
import { absoluteUrl, localeAlternateLanguages } from "@/lib/site-paths";
import type { Locale } from "@/lib/translations";

const OG_LOCALE: Record<Locale, string> = {
  it: "it_IT",
  en: "en_US",
  fr: "fr_FR",
  ru: "ru_RU",
  de: "de_DE",
  es: "es_ES",
};

export interface PageMetadataInput {
  locale: Locale;
  /** Path without locale prefix, e.g. `/services/photo-video` or `""` for home */
  path?: string;
  title: string;
  description: string;
  ogImage?: string;
  robots?: Metadata["robots"];
  ogType?: "website" | "article";
}

/** Path-correct canonical, hreflang, Open Graph and Twitter metadata. */
export function buildPageMetadata({
  locale,
  path = "",
  title,
  description,
  ogImage = "/images/og-cover.svg",
  robots = { index: true, follow: true },
  ogType = "website",
}: PageMetadataInput): Metadata {
  const canonical = absoluteUrl(locale, path);
  const languages = localeAlternateLanguages(path);

  return {
    metadataBase: new URL(SITE_URL),
    // Absolute: page titles already include the brand. The layout template
    // would otherwise append "| DormUp Studio" a second time.
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages,
    },
    robots,
    openGraph: {
      title,
      description,
      type: ogType,
      locale: OG_LOCALE[locale],
      url: canonical,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
