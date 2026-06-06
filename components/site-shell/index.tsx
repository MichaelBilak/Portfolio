import dynamic from "next/dynamic";
import { Hero } from "@/components/hero";
import { Navigation } from "@/components/navigation";
import { Proof } from "@/components/proof";
import { TrustStrip } from "@/components/trust-strip";
import { Locale, translations } from "@/lib/translations";

const ProblemStatement = dynamic(
  () => import("@/components/problem-statement").then((m) => m.ProblemStatement),
);
const Services = dynamic(() => import("@/components/services").then((m) => m.Services));
const FeaturedWork = dynamic(
  () => import("@/components/featured-work").then((m) => m.FeaturedWork),
);
const BeforeAfter = dynamic(
  () => import("@/components/before-after").then((m) => m.BeforeAfter),
);
const Process = dynamic(() => import("@/components/process").then((m) => m.Process));
const BusinessImpact = dynamic(
  () => import("@/components/business-impact").then((m) => m.BusinessImpact),
);
const AuditCta = dynamic(() => import("@/components/audit-cta").then((m) => m.AuditCta));
const About = dynamic(() => import("@/components/about").then((m) => m.About));
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
      <main>
        <Hero t={t} />
        <TrustStrip t={t} />
        <Proof t={t} />
        <div className="section-deferred">
          <ProblemStatement t={t} />
        </div>
        <div className="section-deferred">
          <Services t={t} />
        </div>
        <div className="section-deferred">
          <FeaturedWork t={t} />
        </div>
        <div className="section-deferred">
          <BeforeAfter t={t} />
        </div>
        <div className="section-deferred">
          <Process t={t} />
        </div>
        <div className="section-deferred">
          <BusinessImpact t={t} />
        </div>
        <div className="section-deferred">
          <AuditCta t={t} />
        </div>
        <div className="section-deferred">
          <About t={t} />
        </div>
        <div className="section-deferred">
          <Contact t={t} />
        </div>
      </main>
      <Footer t={t} />
    </>
  );
}
