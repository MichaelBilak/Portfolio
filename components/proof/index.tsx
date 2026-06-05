import { AnimatedCounter, Eyebrow, Reveal } from "@/components/ui";
import { TranslationSet } from "@/lib/translations";

interface ProofProps {
  t: TranslationSet;
}

export function Proof({ t }: ProofProps) {
  return (
    <section className="relative overflow-hidden py-14 md:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-[40rem] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-radial opacity-[0.12] blur-3xl"
      />
      <div className="container-lux relative">
        <Reveal className="flex justify-center">
          <Eyebrow>{t.proof.eyebrow}</Eyebrow>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-y-10 sm:gap-y-12 lg:grid-cols-4">
          {t.proof.items.map((item, index) => (
            <Reveal
              key={item.label}
              delay={index * 0.08}
              className="relative px-3 text-center sm:px-6"
            >
              <span className="block font-display text-4xl font-light leading-none text-gradient-gold sm:text-6xl md:text-7xl">
                <AnimatedCounter value={item.value} />
              </span>
              <span className="mx-auto mt-4 block max-w-[14rem] text-sm leading-snug text-textSecondary">
                {item.label}
              </span>
              {index < t.proof.items.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute right-0 top-1/2 hidden h-16 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-borderStrong to-transparent lg:block"
                />
              ) : null}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
