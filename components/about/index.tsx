import { AboutLogoMark } from "@/components/about/about-logo-mark";
import { FitHeading } from "@/components/ui/fit-heading";
import { Eyebrow, Reveal } from "@/components/ui";
import { phraseText } from "@/lib/format-text";
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
              <FitHeading as={Heading} text={t.about.title} max="4.5rem" min="1.6rem" className="mt-5" />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-textSecondary text-pretty">
                {phraseText(t.about.bio)}
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
