import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Contact } from "@/components/contact";
import { FaqList } from "@/components/faq-list";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { Link } from "@/i18n/navigation";
import { pageTitle } from "@/lib/brand";
import { routing } from "@/i18n/routing";
import { phraseText } from "@/lib/format-text";
import { Locale, translations } from "@/lib/translations";
import { FitHeading } from "@/components/ui/fit-heading";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbHomeLabel, breadcrumbJsonLd, jsonLdScript } from "@/lib/seo/json-ld";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const FALLBACK_LANDING = {
  eyebrow: "Initial review",
  title: "Digital audit",
  lead: "A preliminary review of visibility, website and contact opportunities.",
  forWhoTitle: "Who it is for",
  forWho: ["Local businesses that want clearer digital priorities"],
  checksTitle: "What we check",
  checks: ["Visibility", "Website usability", "Contact paths"],
  receiveTitle: "What you receive",
  receive: ["A short priority summary"],
  processTitle: "How it works",
  process: ["Send a request", "We review public presence", "You get next steps"],
  faqTitle: "FAQ",
  faq: [] as { question: string; answer: string }[],
  cta: "Request the review",
  privacyNote: "See the privacy policy.",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = translations[locale as Locale];
  const landing = t.auditLanding ?? FALLBACK_LANDING;
  return buildPageMetadata({
    locale: locale as Locale,
    path: "/audit-digitale",
    title: pageTitle(landing.title),
    description: landing.lead,
  });
}

export default async function AuditDigitalePage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const safeLocale = locale as Locale;
  const t = translations[safeLocale];
  const landing = t.auditLanding ?? FALLBACK_LANDING;

  const schema = breadcrumbJsonLd(safeLocale, [
    { name: breadcrumbHomeLabel(safeLocale), path: "" },
      { name: landing.title.replace(/\s*\n\s*/g, " "), path: "/audit-digitale" },
  ]);

  return (
    <>
      <Navigation locale={safeLocale} t={t} />

      <main className="relative pt-page pb-safe">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: jsonLdScript(schema) }}
        />
        <div className="container-lux max-w-4xl pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-textMuted transition-colors hover:text-accentGold"
          >
            <ArrowLeft size={14} />
            {t.servicePage.backToHome}
          </Link>
        </div>

        <section className="container-lux max-w-4xl py-10 md:py-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accentGold">
            {landing.eyebrow}
          </p>
          <FitHeading text={landing.title} className="mt-4" max="4.5rem" />
          <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-textSecondary text-pretty">{phraseText(landing.lead)}</p>

          <div className="mt-12 grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="font-display text-xl text-textPrimary">{landing.forWhoTitle}</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-textSecondary">
                {landing.forWho.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-xl text-textPrimary">{landing.checksTitle}</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-textSecondary">
                {landing.checks.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-xl text-textPrimary">{landing.receiveTitle}</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-textSecondary">
                {landing.receive.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-xl text-textPrimary">{landing.processTitle}</h2>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-textSecondary">
                {landing.process.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </div>
          </div>

          {landing.faq.length ? (
            <div className="mt-14">
              <h2 className="font-display text-xl text-textPrimary">{landing.faqTitle}</h2>
              <FaqList
                items={landing.faq.map((item) => ({
                  question: phraseText(item.question),
                  answer: phraseText(item.answer),
                }))}
              />
            </div>
          ) : null}

          <p className="mt-10 text-sm text-textMuted">{landing.privacyNote}</p>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-accentGold">
            {landing.cta}
          </p>
        </section>

        <Contact t={t} auditMode />
      </main>

      <Footer t={t} />
    </>
  );
}
