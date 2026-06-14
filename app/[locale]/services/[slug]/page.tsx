import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { DeliverablesGrid } from "@/components/deliverables-grid";
import { OtherServicesGrid } from "@/components/other-services-grid";
import { PriceBadge } from "@/components/pricing-tiers";
import { ServiceHeroCrystal } from "@/components/service-hero-crystal";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { AuditCta } from "@/components/audit-cta";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { Process } from "@/components/process";
import { servicesMeta } from "@/data/services";
import {
  SERVICE_BASE_PRICES,
  SERVICE_MONTHLY,
  type ServiceId,
} from "@/data/pricing";
import { Link } from "@/i18n/navigation";
import { pageTitle } from "@/lib/brand";
import { routing } from "@/i18n/routing";
import { Locale, translations } from "@/lib/translations";
import { btn } from "@/lib/ui";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return servicesMeta.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const safeLocale = locale as Locale;
  const t = translations[safeLocale];
  const index = servicesMeta.findIndex((s) => s.slug === slug);
  if (index === -1) return {};
  const service = t.services[index];
  return {
    title: pageTitle(service.title),
    description: service.description,
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const safeLocale = locale as Locale;
  const t = translations[safeLocale];

  const index = servicesMeta.findIndex((s) => s.slug === slug);
  if (index === -1) notFound();

  const meta = servicesMeta[index];
  const service = t.services[index];
  const serviceId = meta.id as ServiceId;
  const otherServices = servicesMeta
    .map((m, i) => ({ meta: m, copy: t.services[i] }))
    .filter((s) => s.meta.slug !== slug);

  return (
    <>
      <Navigation locale={safeLocale} t={t} />

      <main className="relative pt-page">
        <section className="relative overflow-hidden py-12 md:py-20">
          <div aria-hidden className="ambient-glow" />
          <div className="container-lux relative">
            <Link
              href="/#services"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-textMuted transition-colors hover:text-accentGold"
            >
              <ArrowLeft size={14} />
              {t.servicePage.backToHome}
            </Link>

            <div className="mt-10 flex flex-col gap-10 md:flex-row md:items-center md:justify-between md:gap-12">
              <div className="flex-1">
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accentGold">
                  {t.servicePage.sectionEyebrow}
                </p>
                <h1 className="mt-3 text-fluid-hero font-display font-light text-textPrimary">
                  {service.title}
                </h1>
                <p className="mt-6 max-w-2xl text-lg text-textSecondary">
                  {service.description}
                </p>
                <p className="mt-5 max-w-2xl text-sm font-normal leading-relaxed tracking-normal text-accentWarm/90">
                  {service.details}
                </p>

                <div className="mt-8 flex flex-col items-start gap-3">
                  <Link
                    href={`/contact?services=${meta.slug}`}
                    className={btn("primary", "md", "w-full justify-center sm:w-auto")}
                  >
                    {t.servicePage.orderCta}
                    <ArrowUpRight size={16} />
                  </Link>
                  <PriceBadge
                    amount={SERVICE_BASE_PRICES[serviceId]}
                    locale={safeLocale}
                    fromLabelText={t.orderPage.fromLabel}
                    monthly={SERVICE_MONTHLY[serviceId]}
                    className="pl-0.5 opacity-75"
                  />
                </div>

                {service.portfolioUrl || service.portfolioUrl2 ? (
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    {service.portfolioUrl2 ? (
                      <a
                        href={service.portfolioUrl2}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="focus-outline group inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-accentGold/40 bg-accentGold/10 px-7 py-3.5 text-base font-semibold text-accentGold transition-all hover:-translate-y-0.5 hover:border-accentGold hover:bg-accentGold/15 hover:shadow-[0_12px_32px_-12px_rgba(201,169,110,0.45)] sm:w-auto"
                      >
                        {service.portfolioLinkLabel2}
                        <ArrowUpRight
                          size={18}
                          aria-hidden
                          className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </a>
                    ) : null}
                    {service.portfolioUrl ? (
                      <a
                        href={service.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="focus-outline inline-flex w-full items-center justify-center gap-2 rounded-full border border-borderStrong bg-bgElevated px-5 py-2.5 text-sm font-medium text-textPrimary transition-colors hover:border-accentGold/45 hover:bg-white/[0.04] hover:text-accentGold sm:w-auto"
                      >
                        {service.portfolioLinkLabel}
                        <ArrowUpRight size={16} aria-hidden />
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <ServiceHeroCrystal src={meta.image} alt={service.title} />
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container-lux">
            <header className="max-w-3xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accentGold">
                {t.servicePage.deliverables}
              </p>
              <h2
                className="mt-3 font-display font-light text-safe-wrap"
                style={{
                  fontSize: "clamp(1.4rem, 3.2vw, 3.5rem)",
                  lineHeight: 1.04,
                  letterSpacing: "-0.022em",
                }}
              >
                {service.title}
              </h2>
            </header>
            <DeliverablesGrid items={service.whatYouGet} />
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container-lux">
            <header className="max-w-3xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accentGold">
                {t.servicePage.otherServices}
              </p>
            </header>
            <OtherServicesGrid
              locale={safeLocale}
              fromLabel={t.orderPage.fromLabel}
              items={otherServices.map(({ meta: m, copy }) => ({
                id: m.id,
                slug: m.slug,
                image: m.image,
                title: copy.title,
                description: copy.description,
                price: SERVICE_BASE_PRICES[m.id as ServiceId],
                monthly: SERVICE_MONTHLY[m.id as ServiceId],
              }))}
            />
          </div>
        </section>

        <Process t={t} />

        <AuditCta t={t} />
      </main>

      <Footer t={t} />
    </>
  );
}
