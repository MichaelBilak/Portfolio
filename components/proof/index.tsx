import { AnimatedCounter, Eyebrow, Reveal } from "@/components/ui";
import { SERVICE_OFFER_COUNT } from "@/data/pricing";
import { TranslationSet } from "@/lib/translations";

interface ProofProps {
  t: TranslationSet;
}

const SERVICE_COUNT_STAT_INDEX = 3;
const VISIBLE_STAT_COUNT = 4;

/** Keep multi-part values like "2 нед." on one line */
function proofValue(value: string) {
  return value.replace(/ /g, "\u00A0");
}

function ProofLabel({ label }: { label: string }) {
  const lines = label.split("\n").filter(Boolean);
  const title = lines[0] ?? label;
  const detail = lines.slice(1).join(" · ");

  return (
    <span className="mt-4 mx-auto flex w-full max-w-[14rem] flex-col items-center gap-1.5 text-center sm:max-w-[15rem]">
      <span className="text-sm leading-snug text-textSecondary sm:text-[0.9375rem]">
        {title}
      </span>
      {detail ? (
        <span className="text-[11px] leading-snug text-textMuted text-balance sm:text-xs">
          {detail}
        </span>
      ) : null}
    </span>
  );
}

export function Proof({ t }: ProofProps) {
  const items = t.proof.items.map((item, index) =>
    index === SERVICE_COUNT_STAT_INDEX
      ? { ...item, value: String(SERVICE_OFFER_COUNT) }
      : item,
  );
  const displayItems = [
    ...items.slice(0, VISIBLE_STAT_COUNT),
    { value: t.proof.footnote.value, label: t.proof.footnote.label },
  ];

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

        <div className="mt-10 grid grid-cols-2 justify-items-center gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12 lg:flex lg:flex-wrap lg:items-start lg:justify-center lg:gap-x-6 lg:gap-y-10 xl:flex-nowrap xl:justify-between xl:gap-x-4">
          {displayItems.map((item, index) => (
            <Reveal
              key={item.label}
              delay={index * 0.08}
              className={`relative flex w-full min-w-0 shrink-0 flex-col items-center text-center lg:w-auto lg:min-w-[9.5rem] lg:px-3 xl:px-2 ${
                index === displayItems.length - 1 && displayItems.length % 2 !== 0
                  ? "col-span-2 lg:col-span-1"
                  : ""
              }`}
            >
              <span className="block w-full text-center font-display text-[clamp(2rem,11vw,2.75rem)] font-light leading-none tracking-tight text-gradient-gold sm:whitespace-nowrap sm:text-5xl sm:text-6xl lg:text-[clamp(2.75rem,3.8vw,5rem)] xl:text-[clamp(3rem,4.2vw,5.5rem)] 2xl:text-7xl">
                <AnimatedCounter value={proofValue(item.value)} />
              </span>
              <ProofLabel label={item.label} />
              {index < displayItems.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute -right-3 top-[42%] hidden h-16 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-borderStrong to-transparent sm:-right-4 lg:-right-2 lg:block xl:-right-2"
                />
              ) : null}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
