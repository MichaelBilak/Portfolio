import { AboutLogoMark } from "@/components/about/about-logo-mark";
import { Eyebrow, Reveal } from "@/components/ui";
import { TranslationSet } from "@/lib/translations";

interface AboutProps {
  t: TranslationSet;
  /** Use h1 on the dedicated About page; h2 when embedded. */
  headingLevel?: "h1" | "h2";
}

export function About({ t, headingLevel = "h2" }: AboutProps) {
  const Heading = headingLevel;

  return (
    <section className="relative overflow-hidden py-14 md:py-32">
      <div className="container-lux">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow>{t.about.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <Heading className="mt-5 font-display text-fluid-title font-light text-textPrimary text-safe-wrap">
                {t.about.title}
              </Heading>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-textSecondary text-pretty">
                {t.about.bio}
              </p>
            </Reveal>
            {t.about.entity ? (
              <Reveal delay={0.15}>
                <div className="mt-10 border-t border-white/10 pt-8">
                  <h3 className="font-display text-xl font-medium text-textPrimary">
                    {t.about.entity.title}
                  </h3>
                  <dl className="mt-5 space-y-3">
                    {t.about.entity.rows.map((row) => (
                      <div key={row.label} className="grid gap-1 sm:grid-cols-[10rem_1fr] sm:gap-4">
                        <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-textMuted">
                          {row.label}
                        </dt>
                        <dd className="text-sm leading-relaxed text-textSecondary">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            ) : null}
          </div>

          <Reveal delay={0.1}>
            <AboutLogoMark />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
