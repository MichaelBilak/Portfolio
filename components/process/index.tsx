"use client";

import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { type MouseEvent } from "react";
import { LucideIcon } from "lucide-react";
import { ProcessStepMeta, processStepsMeta } from "@/data/process";
import { Eyebrow, Reveal } from "@/components/ui";
import { LocalizedProcessStep, TranslationSet } from "@/lib/translations";

interface ProcessProps {
  t: TranslationSet;
}

export function Process({ t }: ProcessProps) {
  const shouldReduceMotion = useReducedMotion();
  const reduce = Boolean(shouldReduceMotion);

  return (
    <section id="process" className="relative py-20 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-gold-radial opacity-15 blur-3xl"
      />

      <div className="container-lux relative">
        <div className="flex items-center justify-between gap-10">
          <header className="max-w-3xl flex-1">
            <Reveal>
              <Eyebrow>{t.processSection.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 text-fluid-title font-display font-light text-textPrimary text-balance">
                {t.processSection.title}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-2xl text-lg text-textSecondary text-pretty">
                {t.processSection.subtitle}
              </p>
            </Reveal>
          </header>

          <Reveal delay={0.15} className="hidden shrink-0 md:block">
            <QuestionFigure />
          </Reveal>
        </div>

        <div className="relative mt-14 md:mt-20">
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-6 left-6 top-6 w-px bg-gradient-to-b from-transparent via-borderStrong to-transparent md:left-10"
          />

          <ol className="space-y-5 md:space-y-6">
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

          <Reveal delay={0.1}>
            <p className="mt-14 max-w-3xl text-base leading-relaxed text-textSecondary md:mt-16">
              {t.processSection.footerNote}
            </p>
          </Reveal>
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
      className="group/step relative pl-16 md:pl-24"
    >
      <span aria-hidden className="absolute left-6 top-6 -translate-x-1/2 md:left-10">
        <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-borderStrong bg-bgElevated shadow-[0_0_0_5px_var(--bg-primary)] transition-colors duration-300 group-hover/step:border-accentGold">
          <Icon size={16} className="text-accentGold" />
        </span>
      </span>

      <article className="glass-card relative overflow-hidden rounded-2xl p-6 md:p-7">
        {/* Ghost number — bottom-right decorative accent */}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-3 right-4 select-none font-display text-[3rem] font-bold leading-none text-textPrimary/[0.04] sm:text-[5rem] md:text-[5.5rem] lg:text-[7rem]"
        >
          {meta.number}
        </span>
        <div className="relative flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-textMuted">
            {stepLabel} {meta.number}
          </span>
        </div>
        <h3 className="relative mt-3 text-2xl font-semibold tracking-tight text-textPrimary md:text-[1.6rem]">
          {copy.title}
        </h3>
        <p className="relative mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-textMuted">
          {copy.summary}
        </p>
        <p className="relative mt-4 pr-20 leading-relaxed text-textSecondary sm:pr-24 md:pr-0">{copy.description}</p>
      </article>
    </motion.li>
  );
}

function QuestionFigure() {
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 220, damping: 12 });
  const rotateY = useSpring(ry, { stiffness: 220, damping: 12 });

  function onMove(e: MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - rect.left) / rect.width - 0.5) * 42);
    rx.set(-((e.clientY - rect.top) / rect.height - 0.5) * 34);
  }

  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.div
      className="crystal-stage relative flex h-56 w-56 items-center justify-center lg:h-64 lg:w-64"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 260 }}
      animate={reduce ? {} : {
        y: [0, -12, 4, -8, 0],
        x: [0, 6, -4, 5, 0],
      }}
      transition={{
        duration: 7,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror",
      }}
    >
      {/* Outer soft glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute h-52 w-52 rounded-full bg-emerald-400/20 blur-[70px]"
      />
      {/* Inner warm halo */}
      <span
        aria-hidden
        className="crystal-halo pointer-events-none absolute h-32 w-32 rounded-full bg-accentGold/25 blur-[38px] opacity-90"
      />
      <Image
        src="/images/question.png"
        alt="Process"
        width={520}
        height={520}
        sizes="260px"
        className="crystal-figure relative h-full w-full object-contain"
      />
    </motion.div>
  );
}
