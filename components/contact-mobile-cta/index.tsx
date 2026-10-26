import { ArrowUpRight } from "lucide-react";
import { ContactLink } from "@/components/contact-link";
import { Eyebrow, Reveal } from "@/components/ui";
import { FitHeading } from "@/components/ui/fit-heading";
import { phraseText } from "@/lib/format-text";
import { TranslationSet } from "@/lib/translations";
import { btn } from "@/lib/ui";

interface ContactMobileCtaProps {
  t: TranslationSet;
}

/** Homepage mobile block — routes to /contact form (desktop keeps inline section). */
export function ContactMobileCta({ t }: ContactMobileCtaProps) {
  return (
    <section className="relative overflow-hidden border-t border-borderSubtle py-14 md:hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-gold-radial opacity-20 blur-3xl"
      />
      <div className="container-lux relative">
        <Reveal>
          <Eyebrow>{t.contact.label}</Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <FitHeading as="h2" text={t.contact.title} max="2.5rem" min="1rem" className="mt-4" />
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-md whitespace-pre-line text-base leading-relaxed text-textSecondary text-pretty">
            {phraseText(t.contact.body)}
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <ContactLink className={btn("primary", "lg", "mt-8 w-full justify-center")}>
            {t.nav.contact}
            <ArrowUpRight size={18} />
          </ContactLink>
        </Reveal>
      </div>
    </section>
  );
}
