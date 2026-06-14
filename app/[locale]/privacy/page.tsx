import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { Link } from "@/i18n/navigation";
import { pageTitle } from "@/lib/brand";
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
    title: pageTitle(t.privacyPage.title),
    description: t.privacyPage.sections[0]?.body ?? t.privacyPage.title,
  };
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const safeLocale = locale as Locale;
  const t = translations[safeLocale];
  const pp = t.privacyPage;

  return (
    <>
      <Navigation locale={safeLocale} t={t} />

      <main className="relative pt-page pb-safe">
        <article className="container-lux max-w-3xl py-12 md:py-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-textMuted transition-colors hover:text-accentGold"
          >
            <ArrowLeft size={14} />
            {pp.backToHome}
          </Link>

          <h1 className="mt-10 text-fluid-title font-display font-light text-textPrimary">{pp.title}</h1>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-textMuted">
            {pp.lastUpdated}
          </p>

          <div className="mt-12 space-y-10">
            {pp.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-semibold tracking-tight text-textPrimary">{section.heading}</h2>
                <p className="mt-3 leading-relaxed text-textSecondary text-pretty">{section.body}</p>
              </section>
            ))}
          </div>
        </article>
      </main>

      <Footer t={t} className="!pb-0 pb-safe lg:!pb-0" />
    </>
  );
}
