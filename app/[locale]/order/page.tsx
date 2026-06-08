import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { AuditCta } from "@/components/audit-cta";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { OrderServices } from "@/components/order-services";
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
    title: `${t.orderPage.title} · Bilak Michael Studio`,
    description: t.orderPage.subtitle,
  };
}

export default async function OrderPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const safeLocale = locale as Locale;
  const t = translations[safeLocale];
  const op = t.orderPage;

  return (
    <>
      <Navigation locale={safeLocale} t={t} />

      <main className="relative pt-page pb-28 md:pb-0">
        <section className="relative overflow-hidden py-12 md:py-20">
          <div aria-hidden className="ambient-glow" />
          <div className="container-lux relative max-w-5xl">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-textMuted transition-colors hover:text-accentGold"
            >
              <ArrowLeft size={14} />
              {t.nav.services}
            </Link>

            <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.28em] text-accentGold">
              {op.eyebrow}
            </p>
            <h1 className="mt-3 text-fluid-hero font-display font-light text-textPrimary">
              {op.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-textSecondary">{op.subtitle}</p>
          </div>
        </section>

        <Suspense fallback={null}>
          <OrderServices t={t} locale={safeLocale} />
        </Suspense>
        <AuditCta t={t} />
      </main>

      <Footer t={t} className="!pb-0 pb-safe lg:!pb-0" />
    </>
  );
}
