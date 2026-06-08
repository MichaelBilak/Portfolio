import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { AuditCta } from "@/components/audit-cta";
import { FeaturedWork } from "@/components/featured-work";
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
  const safeLocale = locale as Locale;
  const t = translations[safeLocale];
  return {
    title: `${t.workPage.title} · Bilak Michael Studio`,
    description: t.workPage.subtitle,
  };
}

export default async function WorkPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const safeLocale = locale as Locale;
  const t = translations[safeLocale];

  return (
    <>
      <Navigation locale={safeLocale} t={t} />

      <main className="relative pt-page">
        <section className="relative overflow-hidden py-12 md:py-20">
          <div aria-hidden className="ambient-glow" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bgPrimary to-transparent"
          />
          <div className="container-lux relative max-w-4xl">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-textMuted transition-colors hover:text-accentGold"
            >
              <ArrowLeft size={14} />
              {t.servicePage.backToHome}
            </Link>

            <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.28em] text-accentGold">
              {t.workPage.eyebrow}
            </p>
            <h1 className="mt-3 text-fluid-hero font-display font-light text-textPrimary">
              {t.workPage.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-textSecondary">
              {t.workPage.subtitle}
            </p>
          </div>
        </section>

        <FeaturedWork t={t} variant="all" hideHeading />

        <AuditCta t={t} />
      </main>

      <Footer t={t} />
    </>
  );
}
