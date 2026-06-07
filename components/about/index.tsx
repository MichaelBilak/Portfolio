import { AboutLogoMark } from "@/components/about/about-logo-mark";
import { Eyebrow, Reveal } from "@/components/ui";
import { TranslationSet } from "@/lib/translations";

interface AboutProps {
  t: TranslationSet;
}

export function About({ t }: AboutProps) {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="container-lux">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow>{t.about.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 whitespace-nowrap font-display font-light text-textPrimary [font-size:clamp(1.2rem,6vw,2rem)] md:whitespace-normal md:text-fluid-title">
                {t.about.title}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-textSecondary text-pretty">
                {t.about.bio}
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-wrap gap-3">
                {t.about.pills.map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-borderSubtle bg-white/[0.03] px-4 py-2 text-sm text-textPrimary"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <AboutLogoMark />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
