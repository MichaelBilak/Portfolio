import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { AuditCta } from "@/components/audit-cta";
import { CustomCursor } from "@/components/custom-cursor";
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
  const Icon = meta.icon;
  const otherServices = servicesMeta
    .map((m, i) => ({ meta: m, copy: t.services[i] }))
    .filter((s) => s.meta.slug !== slug);

  return (
    <>
      <CustomCursor />
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

            <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-start md:gap-10">
              <span className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-borderStrong bg-bgElevated shadow-[0_0_0_5px_var(--bg-primary)]">
                <Icon size={26} className="text-accentGold" />
              </span>
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
                {service.portfolioUrl ? (
                  <a
                    href={service.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-outline mt-8 inline-flex items-center gap-2 rounded-full border border-borderStrong bg-bgElevated px-5 py-2.5 text-sm font-medium text-accentGold transition-colors hover:border-accentGold/45 hover:bg-white/[0.04]"
                  >
                    {service.portfolioLinkLabel}
                    <ArrowUpRight size={16} aria-hidden />
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container-lux">
            <header className="max-w-3xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accentGold">
                {t.servicePage.deliverables}
              </p>
              <h2 className="mt-3 text-fluid-title font-display font-light">
                {service.title}
              </h2>
            </header>
            <ul className="mt-10 grid gap-4 md:grid-cols-2">
              {service.whatYouGet.map((item) => (
                <li
                  key={item}
                  className="glass-card flex items-start gap-3 rounded-2xl p-5 transition-colors hover:border-borderStrong"
                >
                  <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-borderStrong bg-bgElevated">
                    <Check size={14} className="text-accentGold" />
                  </span>
                  <span className="leading-relaxed text-textPrimary">{item}</span>
                </li>
              ))}
            </ul>
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
                    <p className="font-display text-xl font-light text-textPrimary">{tier.name}</p>
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

        <section className="py-16 md:py-24">
          <div className="container-lux">
            <header className="max-w-3xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accentGold">
                {t.servicePage.otherServices}
              </p>
            </header>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {otherServices.map(({ meta: m, copy }) => {
                const OtherIcon = m.icon;
                return (
                  <Link
                    key={m.id}
                    href={`/services/${m.slug}`}
                    className="glass-card hover-lift group flex flex-col gap-4 rounded-2xl p-6 hover:border-borderStrong"
                  >
                    <div className="flex items-center justify-between">
                      <span className="inline-flex rounded-xl border border-borderSubtle bg-white/[0.03] p-2.5">
                        <OtherIcon size={16} className="text-accentGold" />
                      </span>
                      <ArrowUpRight
                        size={14}
                        className="text-textMuted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accentGold"
                      />
                    </div>
                    <h3 className="font-display text-2xl font-light text-textPrimary">
                      {copy.title}
                    </h3>
                    <p className="text-sm text-textSecondary">{copy.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer t={t} />
    </>
  );
}
