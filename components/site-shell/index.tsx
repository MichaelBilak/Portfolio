import { About } from "@/components/about";
import { AuditCta } from "@/components/audit-cta";
import { BeforeAfter } from "@/components/before-after";
import { BusinessImpact } from "@/components/business-impact";
import { Contact } from "@/components/contact";
import { FeaturedWork } from "@/components/featured-work";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navigation } from "@/components/navigation";
import { ProblemStatement } from "@/components/problem-statement";
import { Process } from "@/components/process";
import { Proof } from "@/components/proof";
import { Services } from "@/components/services";
import { TrustStrip } from "@/components/trust-strip";
import { Locale, translations } from "@/lib/translations";

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
        <ProblemStatement t={t} />
        <Services t={t} />
        <FeaturedWork t={t} />
        <BeforeAfter t={t} />
        <Process t={t} />
        <BusinessImpact t={t} />
        <AuditCta t={t} />
        <About t={t} />
        <Contact t={t} />
      </main>
      <Footer t={t} />
    </>
  );
}
