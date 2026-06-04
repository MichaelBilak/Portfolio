"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { ProcessStepMeta, processStepsMeta } from "@/data/process";
import { LocalizedProcessStep, TranslationSet } from "@/lib/translations";

interface ProcessProps {
  t: TranslationSet;
}

export function Process({ t }: ProcessProps) {
  const shouldReduceMotion = useReducedMotion();
  const reduce = Boolean(shouldReduceMotion);

  return (
    <section id="process" className="relative py-16 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-glow opacity-20 blur-3xl"
      />

      <div className="container-lux relative">
        <header className="max-w-3xl">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="font-mono text-[11px] uppercase tracking-[0.28em] text-accentGold"
          >
            {t.processSection.eyebrow}
          </motion.p>
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="mt-4 text-fluid-title font-display font-light text-textPrimary"
          >
            {t.processSection.title}
          </motion.h2>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mt-5 max-w-2xl text-lg text-textSecondary"
          >
            {t.processSection.subtitle}
          </motion.p>
        </header>

        <div className="relative mt-16 md:mt-20">
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-4 left-6 top-4 w-px bg-gradient-to-b from-transparent via-borderStrong to-transparent md:left-10"
          />

          <ol className="space-y-6 md:space-y-8">
            {processStepsMeta.map((meta, index) => (
              <Step
                key={meta.id}
                meta={meta}
                copy={t.process[index]}
                stepLabel={t.processSection.stepLabel}
                reduce={reduce}
                position={index}
              />
            ))}
          </ol>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-14 max-w-3xl text-base leading-relaxed text-textSecondary md:mt-16"
          >
            {t.processSection.footerNote}
          </motion.p>
        </div>
      </div>
    </section>
  );
}

interface StepProps {
  meta: ProcessStepMeta;
  copy: LocalizedProcessStep;
  stepLabel: string;
  reduce: boolean;
  position: number;
}

function Step({ meta, copy, stepLabel, reduce, position }: StepProps) {
  const Icon: LucideIcon = meta.icon;

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, x: -24 }}
      whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.55,
        ease: [0.25, 0.1, 0.25, 1],
        delay: position * 0.06,
      }}
      className="relative pl-16 md:pl-24"
    >
      <span
        aria-hidden
        className="absolute left-6 top-6 -translate-x-1/2 md:left-10"
      >
        <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-borderStrong bg-bgElevated shadow-[0_0_0_5px_var(--bg-primary)]">
          <Icon size={16} className="text-accentGold" />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full bg-accentGold/0 transition-colors duration-300 group-hover/step:bg-accentGold/10"
          />
        </span>
      </span>

      <article className="glass-card group/step rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-borderStrong md:p-7">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-textMuted">
            {stepLabel} {meta.number}
          </span>
          <span className="font-mono text-xs text-accentGold">{meta.number}</span>
        </div>
        <h3 className="mt-3 font-display text-3xl font-light text-textPrimary md:text-4xl">
          {copy.title}
        </h3>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-textMuted">
          {copy.summary}
        </p>
        <p className="mt-4 leading-relaxed text-textSecondary">{copy.description}</p>
      </article>
    </motion.li>
  );
}
