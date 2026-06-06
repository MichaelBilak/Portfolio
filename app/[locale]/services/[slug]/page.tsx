import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { DeliverablesGrid } from "@/components/deliverables-grid";
import { OtherServicesGrid } from "@/components/other-services-grid";
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
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Locale, translations } from "@/lib/translations";

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
    title: `${service.title} · Bilak Michael Studio`,
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
  const otherServices = servicesMeta
    .map((m, i) => ({ meta: m, copy: t.services[i] }))
    .filter((s) => s.meta.slug !== slug);

  return (
    <>
      <Navigation locale={safeLocale} t={t} />

      <main className="relative pt-32">
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
              {/* Text */}
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
                {service.portfolioUrl || service.portfolioUrl2 ? (
                  <div className="mt-8 flex flex-wrap gap-3">
                    {service.portfolioUrl2 ? (
                      <a
                        href={service.portfolioUrl2}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="focus-outline inline-flex items-center gap-2 rounded-full border border-borderStrong bg-bgElevated px-5 py-2.5 text-sm font-medium text-accentGold transition-colors hover:border-accentGold/45 hover:bg-white/[0.04]"
                      >
                        {service.portfolioLinkLabel2}
                        <ArrowUpRight size={16} aria-hidden />
                      </a>
                    ) : null}
                    {service.portfolioUrl ? (
                      <a
                        href={service.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="focus-outline inline-flex items-center gap-2 rounded-full border border-borderStrong bg-bgElevated px-5 py-2.5 text-sm font-medium text-textPrimary transition-colors hover:border-accentGold/45 hover:bg-white/[0.04] hover:text-accentGold"
                      >
                        {service.portfolioLinkLabel}
                        <ArrowUpRight size={16} aria-hidden />
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </div>

              {/* Crystal figure */}
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
              <h2 className="mt-3 font-display font-light text-balance" style={{ fontSize: "clamp(1.4rem, 3.2vw, 3.5rem)", lineHeight: 1.04, letterSpacing: "-0.022em" }}>
                {service.title}
              </h2>
            </header>
            <DeliverablesGrid items={service.whatYouGet} />
          </div>
        </section>

        {/* ── Other services — right after the description ── */}
        <section className="py-16 md:py-24">
          <div className="container-lux">
            <header className="max-w-3xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accentGold">
                {t.servicePage.otherServices}
              </p>
            </header>
            <OtherServicesGrid
              items={otherServices.map(({ meta: m, copy }) => ({
                id: m.id,
                slug: m.slug,
                image: m.image,
                title: copy.title,
                description: copy.description,
              }))}
            />
          </div>
        </section>

        {service.pricingTiers && service.pricingTiers.length > 0 ? (
          <section className="py-16 md:py-24">
            <div className="container-lux">
              <header className="max-w-3xl">
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accentGold">
                  {t.servicePage.pricingEyebrow}
                </p>
                <h2 className="mt-3 text-fluid-title font-display font-light">
                  {service.pricingSectionTitle}
                </h2>
              </header>
              <div className="mt-10 grid gap-5 md:grid-cols-3">
                {service.pricingTiers.map((tier) => (
                  <div
                    key={tier.name}
                    className="glass-card flex flex-col rounded-2xl p-6 transition-colors hover:border-borderStrong"
                  >
                    <p className="text-xl font-semibold tracking-tight text-textPrimary">{tier.name}</p>
                    <p className="mt-3 text-sm leading-relaxed text-textSecondary">{tier.detail}</p>
                  </div>
                ))}
              </div>
              {service.pricingFootnote ? (
                <p className="mt-8 max-w-3xl text-sm leading-relaxed text-textMuted">{service.pricingFootnote}</p>
              ) : null}
            </div>
          </section>
        ) : null}

        <Process t={t} />

        <AuditCta t={t} />
      </main>

      <Footer t={t} />
    </>
  );
}
