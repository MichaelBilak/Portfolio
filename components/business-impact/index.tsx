"use client";

import { motion } from "framer-motion";
import { Eyebrow, Reveal, useTilt } from "@/components/ui";
import { TranslationSet } from "@/lib/translations";

interface BusinessImpactProps {
  t: TranslationSet;
}

export function BusinessImpact({ t }: BusinessImpactProps) {
  return (
    <section className="relative overflow-hidden bg-bgElevated py-20 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gold-radial opacity-20 blur-3xl"
      />
      <div className="container-lux relative">
        <Reveal>
          <Eyebrow>{t.impact.label}</Eyebrow>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {t.impact.items.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08}>
              <ImpactCard item={item} index={index} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

interface ImpactItem {
  title: string;
  body: string;
  note: string;
}

function ImpactCard({ item, index }: { item: ImpactItem; index: number }) {
  const { tiltStyle, onTiltMove, onTiltLeave } = useTilt(8);

  return (
    <motion.article
      onMouseMove={onTiltMove}
      onMouseLeave={onTiltLeave}
      style={tiltStyle}
      className="glass-card spotlight-card group relative flex h-full flex-col overflow-hidden rounded-3xl p-7 transition-colors duration-300 hover:border-borderStrong md:p-8"
    >
      <h3 className="relative text-2xl font-semibold leading-snug tracking-tight text-textPrimary md:text-[1.55rem]">
        {item.title}
      </h3>
      <p className="relative mt-4 leading-relaxed text-textSecondary">{item.body}</p>
      <p className="relative mt-6 border-t border-borderCool pt-4 font-mono text-[11px] uppercase tracking-[0.08em] text-textMuted">
        {item.note}
      </p>
      <span
        aria-hidden
        className="mt-auto block pt-7 text-right font-display text-[4.75rem] font-bold leading-[0.78] text-accentGold/[0.12] md:text-[5.75rem]"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
    </motion.article>
  );
}
