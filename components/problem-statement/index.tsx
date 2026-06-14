import { Reveal } from "@/components/ui";
import { TranslationSet } from "@/lib/translations";

interface ProblemStatementProps {
  t: TranslationSet;
}

export function ProblemStatement({ t }: ProblemStatementProps) {
  return (
    <section className="theme-light relative overflow-hidden bg-bgPrimary py-16 md:py-36">
      {/* Gradient fade-in from the dark sections above and below */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#06080c] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#06080c] to-transparent"
      />
      <div
        aria-hidden
        className="dot-grid pointer-events-none absolute inset-0 text-[#0d130f]/[0.06]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold-radial opacity-25 blur-3xl"
      />

      <div className="container-lux relative">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Reveal>
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-accentDeep">
                {t.problem.eyebrow}
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 text-fluid-title font-display font-light leading-[1.02] text-[#0d130f] text-safe-wrap">
                {t.problem.title}
              </h2>
            </Reveal>
          </div>

          <div className="lg:pt-4">
            <Reveal delay={0.1}>
              <span
                aria-hidden
                className="block font-display text-6xl font-light leading-none text-accentDeep/40 md:text-7xl"
              >
                &ldquo;
              </span>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-2 text-xl leading-relaxed text-[#0d130f]/75 text-pretty md:text-2xl">
                {t.problem.body}
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <span className="mt-10 block h-px w-full bg-gradient-to-r from-accentDeep/40 to-transparent" />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
