import { AnimatedCounter, Eyebrow, Reveal } from "@/components/ui";
import { SERVICE_OFFER_COUNT } from "@/data/pricing";
import { TranslationSet } from "@/lib/translations";

interface ProofProps {
  t: TranslationSet;
}

const SERVICE_COUNT_STAT_INDEX = 3;

/** Keep multi-part values like "2 нед." on one line */
function proofValue(value: string) {
  return value.replace(/ /g, "\u00A0");
}

export function Proof({ t }: ProofProps) {
  const items = t.proof.items.map((item, index) =>
    index === SERVICE_COUNT_STAT_INDEX
      ? { ...item, value: String(SERVICE_OFFER_COUNT) }
      : item,
  );

  return (
    <section className="relative overflow-x-clip py-14 md:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-[40rem] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-radial opacity-[0.12] blur-3xl"
      />
      <div className="container-wide relative">
        <Reveal className="flex justify-center">
          <Eyebrow>{t.proof.eyebrow}</Eyebrow>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 justify-items-center gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12 lg:flex lg:flex-wrap lg:items-start lg:justify-center lg:gap-x-5 lg:gap-y-10 xl:flex-nowrap xl:justify-between xl:gap-x-6">
          {items.map((item, index) => (
            <Reveal
              key={item.label}
              delay={index * 0.08}
              className="relative flex w-full max-w-[11rem] shrink-0 flex-col items-center text-center sm:max-w-none lg:w-auto lg:px-2 xl:px-3 [&:nth-child(5)]:col-span-2 lg:[&:nth-child(5)]:col-span-1"
            >
              <span className="inline-block whitespace-nowrap font-display text-5xl font-light leading-none tracking-tight text-gradient-gold sm:text-6xl lg:text-[clamp(3rem,4.2vw,5.5rem)] xl:text-[clamp(3.5rem,4.8vw,6.25rem)] 2xl:text-7xl">
                <AnimatedCounter value={proofValue(item.value)} />
              </span>
              <span className="mt-4 max-w-[12.5rem] text-pretty text-sm leading-snug text-textSecondary sm:max-w-[13.5rem] sm:text-[0.9375rem] lg:max-w-[10.5rem] xl:max-w-[12rem]">
                {item.label}
              </span>
              {index < items.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute -right-3 top-[42%] hidden h-16 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-borderStrong to-transparent sm:-right-4 lg:-right-2 lg:block xl:-right-3"
                />
              ) : null}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
