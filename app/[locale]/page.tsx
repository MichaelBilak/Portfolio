import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { SiteShell } from "@/components/site-shell";
import { routing } from "@/i18n/routing";
import { Locale } from "@/lib/translations";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { localeMetaContent } from "@/lib/seo/locale-defaults";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const safeLocale = locale as Locale;
  const meta = localeMetaContent[safeLocale];
  return buildPageMetadata({
    locale: safeLocale,
    path: "",
    title: meta.title,
    description: meta.description,
  });
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  return <SiteShell locale={locale as Locale} />;
}
