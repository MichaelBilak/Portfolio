import { ArrowLeft } from "lucide-react";
import { PricingAddons } from "@/components/pricing-addons";
import { ServiceCategories } from "@/components/service-categories";
import { ServicesCrystalGrid } from "@/components/services-crystal-grid";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { AuditCta } from "@/components/audit-cta";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { servicesMeta } from "@/data/services";
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
    title: `${t.servicesPage.title} · Bilak Michael Studio`,
    description: t.servicesPage.subtitle,
  };
}

export default async function ServicesPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const safeLocale = locale as Locale;
  const t = translations[safeLocale];
  const sp = t.servicesPage;

  return (
    <>
      <Navigation locale={safeLocale} t={t} />

      <main className="relative pt-page">
        {/* ── Hero header ── */}
        <section className="relative overflow-hidden py-12 md:py-20">
          <div aria-hidden className="ambient-glow" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bgPrimary to-transparent"
          />
          <div className="container-lux relative max-w-5xl">
            <Link
              href="/#services"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-textMuted transition-colors hover:text-accentGold"
            >
              <ArrowLeft size={14} />
              {t.servicePage.backToHome}
            </Link>

            <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.28em] text-accentGold">
              {sp.eyebrow}
            </p>
            <h1 className="mt-3 text-fluid-hero font-display font-light text-textPrimary">
              {sp.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-textSecondary">
              {sp.subtitle}
            </p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-textMuted">
              {sp.techStack}
            </p>
          </div>
        </section>

        {/* ── Crystal service grid ── */}
        <section className="py-16 md:py-24">
          <div className="container-lux">
            <ServicesCrystalGrid
              metas={servicesMeta.map(({ id, slug, image }) => ({ id, slug, image }))}
              titles={servicesMeta.map((_, i) => t.services[i].title)}
              viewServiceLabel={t.servicePage.viewService}
              fromLabel={t.orderPage.fromLabel}
              locale={safeLocale}
            />
          </div>
        </section>

        <PricingAddons t={t.pricingAddons} />

        {/* ── Capability categories ── */}
        <div className="container-lux border-t border-borderSubtle py-10">
          <p className="max-w-2xl text-sm leading-relaxed text-textMuted">{sp.pricingNote}</p>
        </div>
        <ServiceCategories categories={sp.categories} />

        <AuditCta t={t} />
      </main>

      <Footer t={t} />
    </>
  );
}
