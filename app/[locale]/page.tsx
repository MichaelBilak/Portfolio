import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { SiteShell } from "@/components/site-shell";
import { routing } from "@/i18n/routing";
import { Locale } from "@/lib/translations";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  return <SiteShell locale={locale as Locale} />;
}
