import { ArrowUpRight } from "lucide-react";
import { ContactLink } from "@/components/contact-link";
import { preventBrokenPhrases } from "@/lib/format-text";
import { TranslationSet } from "@/lib/translations";
import { btn } from "@/lib/ui";

interface AuditCtaProps {
  t: TranslationSet;
}

export function AuditCta({ t }: AuditCtaProps) {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bgElevated/80 from-0% via-bgPrimary via-35% to-bgPrimary"
      />
      <div className="container-lux relative">
        <div className="relative overflow-hidden rounded-[2rem] border border-borderStrong bg-bgCard px-5 py-12 text-center sm:px-10 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-28 right-1/4 h-72 w-72 rounded-full bg-gold-radial opacity-15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_55%,rgba(19,28,39,0.45),transparent_72%)]"
          />

          <div className="relative z-10 mx-auto max-w-4xl">
            <span className="inline-flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border border-borderSubtle bg-white/[0.04] px-3 py-2 text-center font-mono text-[9px] uppercase tracking-[0.16em] text-accentGold backdrop-blur hyphens-none text-safe-wrap sm:px-4 sm:text-[10px] sm:tracking-[0.22em]">
              {preventBrokenPhrases(t.audit.meta)}
            </span>
            <h2 className="mt-7 text-fluid-title font-display font-semibold leading-[1.12] text-textPrimary text-safe-wrap">
              {t.audit.title.split("\n").map((line) => (
                <span key={line} className="block text-safe-wrap sm:whitespace-nowrap">
                  {preventBrokenPhrases(line)}
                </span>
              ))}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-textSecondary text-pretty">
              {t.audit.body}
            </p>
            <ContactLink
              audit
              className={btn(
                "primary",
                "lg",
                "amber-pulse relative mt-10 w-full overflow-visible sm:w-auto",
              )}
            >
              <span
                aria-hidden
                className="absolute -right-1 -top-2 z-10 rounded-full bg-bgPrimary px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-accentGold ring-1 ring-accentGold/50 sm:-right-2 sm:-top-2.5 sm:text-[10px]"
              >
                {t.audit.freeBadge}
              </span>
              {t.audit.cta}
              <ArrowUpRight
                size={18}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </ContactLink>
          </div>
        </div>
      </div>
    </section>
  );
}
