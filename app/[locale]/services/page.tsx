import { ArrowLeft } from "lucide-react";
import { PricingAddons } from "@/components/pricing-addons";
import { ServiceCategories } from "@/components/service-categories";
import { ServicesCrystalGrid } from "@/components/services-crystal-grid";
import type { Metadata } from "next";
import { pageTitle } from "@/lib/brand";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { AuditCta } from "@/components/audit-cta";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getSiteContent } from "@/lib/cms/catalog";
import { Locale } from "@/lib/translations";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const { t } = await getSiteContent(locale as Locale);
  return {
    title: pageTitle(t.servicesPage.title),
    description: t.servicesPage.subtitle,
  };
}

export default async function ServicesPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const safeLocale = locale as Locale;
  const { t, serviceMetas, addonStructure } = await getSiteContent(safeLocale);
  const sp = t.servicesPage;

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
            <p className="mt-5 whitespace-nowrap text-[clamp(0.8rem,2.4vw,1.125rem)] leading-snug text-textSecondary">
              {sp.subtitle}
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container-lux">
            <ServicesCrystalGrid
              metas={serviceMetas.map(({ id, slug, image }) => ({ id, slug, image }))}
              titles={serviceMetas.map(
                (meta) => t.services.find((s) => s.id === meta.id)?.title ?? meta.id,
              )}
              viewServiceLabel={t.servicePage.viewService}
            />
          </div>
        </section>

        <PricingAddons t={t.pricingAddons} categories={addonStructure} />

        <div className="container-lux border-t border-borderSubtle py-10">
          <p className="mx-auto max-w-3xl text-center text-sm leading-relaxed text-textMuted">
            {sp.pricingNote}
          </p>
        </div>
        <ServiceCategories categories={sp.categories} />

        <AuditCta t={t} />
      </main>

      <Footer t={t} />
    </>
  );
}
