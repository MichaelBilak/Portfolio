import { AboutLogoMark } from "@/components/about/about-logo-mark";
import { Eyebrow, Reveal } from "@/components/ui";
import { TranslationSet } from "@/lib/translations";

interface AboutProps {
  t: TranslationSet;
}

export function About({ t }: AboutProps) {
  return (
    <section className="relative overflow-hidden py-14 md:py-32">
      <div className="container-lux">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow>{t.about.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 font-display text-fluid-title font-light text-textPrimary text-safe-wrap">
                {t.about.title}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-textSecondary text-pretty">
                {t.about.bio}
              </p>
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
