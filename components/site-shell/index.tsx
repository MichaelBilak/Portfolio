import dynamic from "next/dynamic";
import { DeferredSection } from "@/components/deferred-section";
import { Hero } from "@/components/hero";
import { Navigation } from "@/components/navigation";
import { ProblemStatement } from "@/components/problem-statement";
import { Proof } from "@/components/proof";
import { TrustStrip } from "@/components/trust-strip";
import { Locale, translations } from "@/lib/translations";

const Services = dynamic(() => import("@/components/services").then((m) => m.Services));
const FeaturedWork = dynamic(
  () => import("@/components/featured-work").then((m) => m.FeaturedWork),
);
const BusinessImpact = dynamic(
  () => import("@/components/business-impact").then((m) => m.BusinessImpact),
);
const AuditCta = dynamic(() => import("@/components/audit-cta").then((m) => m.AuditCta));
const ContactCompact = dynamic(
  () => import("@/components/contact/contact-compact").then((m) => m.ContactCompact),
);
const Contact = dynamic(() => import("@/components/contact").then((m) => m.Contact));
const Footer = dynamic(() => import("@/components/footer").then((m) => m.Footer));

interface SiteShellProps {
  locale: Locale;
}

export function SiteShell({ locale }: SiteShellProps) {
  const t = translations[locale];

  return (
    <>
      <Navigation locale={locale} t={t} />
      <main className="min-w-0 overflow-x-clip">
        <Hero t={t} />
        <TrustStrip t={t} />
        <Proof t={t} />
        <ProblemStatement t={t} />
        <div className="section-deferred">
          <DeferredSection>
            <Services t={t} />
          </DeferredSection>
        </div>
        <div className="section-deferred">
          <DeferredSection>
            <FeaturedWork t={t} />
          </DeferredSection>
        </div>
        <div className="section-deferred">
          <DeferredSection>
            <BusinessImpact t={t} />
          </DeferredSection>
        </div>
        <div className="section-deferred">
          <DeferredSection>
            <AuditCta t={t} />
          </DeferredSection>
        </div>
        <div className="section-deferred md:hidden">
          <DeferredSection>
            <ContactCompact t={t} />
          </DeferredSection>
        </div>
        <div className="section-deferred hidden md:block">
          <DeferredSection>
            <Contact t={t} />
          </DeferredSection>
        </div>
      </main>
      <DeferredSection>
        <Footer t={t} />
      </DeferredSection>
    </>
  );
}
