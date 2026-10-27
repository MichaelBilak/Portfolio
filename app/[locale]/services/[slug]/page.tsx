import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { DeliverablesGrid } from "@/components/deliverables-grid";
import { FaqList } from "@/components/faq-list";
import { OtherServicesGrid } from "@/components/other-services-grid";
import { ServiceHeroCrystal } from "@/components/service-hero-crystal";
import { FitHeading } from "@/components/ui/fit-heading";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { AuditCta } from "@/components/audit-cta";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { Process } from "@/components/process";
import { Link } from "@/i18n/navigation";
import { pageTitle } from "@/lib/brand";
import { getSiteContent } from "@/lib/cms/catalog";
import { routing } from "@/i18n/routing";
import { phraseText } from "@/lib/format-text";
import { Locale } from "@/lib/translations";
import { btn } from "@/lib/ui";
import { servicesMeta } from "@/data/services";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  breadcrumbHomeLabel,
  breadcrumbJsonLd,
  faqHeading,
  jsonLdScript,
  serviceJsonLd,
} from "@/lib/seo/json-ld";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return servicesMeta.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const { t, serviceMetas } = await getSiteContent(locale as Locale);
  const meta = serviceMetas.find((s) => s.slug === slug);
  if (!meta) return {};
  const service = t.services.find((s) => s.id === meta.id);
  if (!service) return {};
  return buildPageMetadata({
    locale: locale as Locale,
    path: `/services/${slug}`,
    title: pageTitle(service.title),
    description: service.description,
  });
}

export default async function ServicePage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const safeLocale = locale as Locale;
  const { t, serviceMetas } = await getSiteContent(safeLocale);

  const meta = serviceMetas.find((s) => s.slug === slug);
  if (!meta) notFound();

  const service = t.services.find((s) => s.id === meta.id);
  if (!service) notFound();

  const otherServices = serviceMetas
    .filter((m) => m.slug !== slug)
    .map((m) => ({
      meta: m,
      copy: t.services.find((s) => s.id === m.id)!,
    }))
    .filter((s) => s.copy);

  const schema = [
    serviceJsonLd({
      locale: safeLocale,
      name: service.title,
      description: service.description,
      path: `/services/${slug}`,
      serviceType: service.title,
    }),
    breadcrumbJsonLd(safeLocale, [
      { name: breadcrumbHomeLabel(safeLocale), path: "" },
      { name: t.nav.services, path: "/services" },
      { name: service.title, path: `/services/${slug}` },
    ]),
  ];

  return (
    <>
      <Navigation locale={safeLocale} t={t} />

      <main className="relative pt-page">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: jsonLdScript(schema) }}
        />
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
                <FitHeading text={service.title} className="mt-3" max="4.75rem" />
                <p className="mt-6 max-w-2xl whitespace-pre-line text-lg text-textSecondary text-pretty">
                  {phraseText(service.description)}
                </p>
                <p className="mt-5 max-w-2xl whitespace-pre-line text-sm font-normal leading-relaxed tracking-normal text-accentWarm/90">
                  {phraseText(service.details)}
                </p>

                <div className="mt-8">
                  <Link
                    href={`/contact?services=${meta.slug}`}
                    className={btn("primary", "md", "w-full justify-center sm:w-auto")}
                  >
                    {t.servicePage.orderCta}
                    <ArrowUpRight size={16} />
                  </Link>
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
              <FitHeading as="h2" text={service.title} className="mt-3" max="3.5rem" min="1rem" />
            </header>
            <DeliverablesGrid items={service.whatYouGet} />
          </div>
        </section>

        {service.faq?.length ? (
          <section className="py-16 md:py-24">
            <div className="container-lux max-w-3xl">
              <FitHeading as="h2" text={faqHeading(safeLocale)} max="3.5rem" min="1rem" />
              <FaqList
                items={service.faq.map((item) => ({
                  question: phraseText(item.question),
                  answer: phraseText(item.answer),
                }))}
              />
            </div>
          </section>
        ) : null}

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

        <Process
          t={t}
          override={
            slug === "photo-video"
              ? {
                  title: service.title,
                  subtitle: service.description,
                  steps: service.whatYouGet.map((line, index) => {
                    const splitAt = line.indexOf(":");
                    const hasLabel = splitAt > 0 && splitAt < 48;
                    return {
                      id: `video-${index + 1}`,
                      title: hasLabel ? line.slice(0, splitAt).trim() : line,
                      summary: "",
                      description: hasLabel ? line.slice(splitAt + 1).trim() : "",
                    };
                  }),
                }
              : undefined
          }
        />

        <AuditCta t={t} />
      </main>

      <Footer t={t} />
    </>
  );
}
