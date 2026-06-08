import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { About } from "@/components/about";
import { AuditCta } from "@/components/audit-cta";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Locale, translations } from "@/lib/translations";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = translations[locale as Locale];
  return {
    title: `${t.about.title} · Bilak Michael Studio`,
    description: t.about.bio.split("\n")[0],
  };
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const safeLocale = locale as Locale;
  const t = translations[safeLocale];

  return (
    <>
      <Navigation locale={safeLocale} t={t} />

      <main className="relative pt-page">
        <div className="container-lux max-w-5xl pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-textMuted transition-colors hover:text-accentGold"
          >
            <ArrowLeft size={14} />
            {t.aboutPage.backToHome}
          </Link>
        </div>

        <About t={t} />
        <AuditCta t={t} />
      </main>

      <Footer t={t} />
    </>
  );
}
