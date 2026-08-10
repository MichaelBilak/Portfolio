import { Marquee } from "@/components/ui";
import { preventBrokenPhrases } from "@/lib/format-text";
import { TranslationSet } from "@/lib/translations";

interface TrustStripProps {
  t: TranslationSet;
}

export function TrustStrip({ t }: TrustStripProps) {
  const items = t.trust.map((label, index) => (
    <span key={`${label}-${index}`} className="flex items-center">
      <span className="font-display text-xl font-light tracking-tight text-textPrimary/90 whitespace-nowrap sm:text-3xl md:text-4xl">
        {preventBrokenPhrases(label)}
      </span>
      <span
        aria-hidden
        className="mx-5 inline-block h-2 w-2 rotate-45 bg-accentGold/70 sm:mx-7 md:mx-10"
      />
    </span>
  ));

  return (
    <section className="relative border-y border-borderCool bg-bgSecondary/50 py-7 backdrop-blur-sm md:py-9">
      <Marquee items={items} itemClassName="text-textPrimary" />
    </section>
  );
}
