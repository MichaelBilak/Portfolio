"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { beforeAfterCasesMeta } from "@/data/before-after-cases";
import { crossfade } from "@/lib/animations";
import { useComparisonSlider } from "@/lib/hooks/use-comparison-slider";
import { TranslationSet } from "@/lib/translations";

interface BeforeAfterProps {
  t: TranslationSet;
}

export function BeforeAfter({ t }: BeforeAfterProps) {
  const cases = t.beforeAfter.cases;
  const [active, setActive] = useState(0);
  const { sliderRef, clip, innerWidthPercent, onPointerDown, setPosition } = useComparisonSlider(52);

  const safeIndex = Math.min(active, cases.length - 1, beforeAfterCasesMeta.length - 1);
  const meta = beforeAfterCasesMeta[safeIndex]!;
  const current = cases[safeIndex]!;

  useEffect(() => {
    setPosition(52);
  }, [safeIndex, setPosition]);

  const selectCase = (i: number) => {
    setActive(i);
    setPosition(52);
  };

  return (
    <section id="before-after" className="py-24 md:py-32">
      <div className="container-lux">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accentGold">
            {t.beforeAfter.eyebrow}
          </p>
          <h2 className="text-fluid-title mt-4 max-w-4xl font-display font-light leading-tight">
            {t.beforeAfter.title}
          </h2>
          <p className="mt-5 max-w-3xl text-lg text-textSecondary">{t.beforeAfter.subtitle}</p>
        </motion.div>

        <div
          className="mt-10 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:flex-wrap md:overflow-visible [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label={t.beforeAfter.eyebrow}
        >
          {cases.map((c, i) => {
            const selected = i === safeIndex;
            return (
              <button
                key={beforeAfterCasesMeta[i]?.id ?? c.tab}
                type="button"
                role="tab"
                aria-selected={selected}
                id={`ba-tab-${i}`}
                aria-controls={`ba-panel-${i}`}
                onClick={() => selectCase(i)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                  selected
                    ? "border-accentGold/80 bg-accentGold/15 text-accentGold"
                    : "border-borderCool bg-bgPrimary/40 text-textSecondary hover:border-accentGold/35 hover:text-textPrimary"
                }`}
              >
                {c.tab}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid items-start gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="space-y-6 lg:col-span-4">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-textMuted">
              {t.beforeAfter.changesTitle}
            </p>

            <AnimatePresence mode="wait">
              <motion.div
                key={safeIndex}
                id={`ba-panel-${safeIndex}`}
                role="tabpanel"
                aria-labelledby={`ba-tab-${safeIndex}`}
                variants={crossfade}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-5"
              >
                <p className="text-lg font-medium leading-snug text-textPrimary">{current.headline}</p>
                <ul className="space-y-4">
                  {current.changes.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-textSecondary">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accentGold"
                        aria-hidden
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>

            <p className="border-t border-borderCool pt-6 text-sm text-textMuted">{t.beforeAfter.footerNote}</p>
          </div>

          <div className="lg:col-span-8">
            <div
              ref={sliderRef}
              role="slider"
              tabIndex={0}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(clip)}
              aria-label={t.beforeAfter.dragHint}
              className="glass-card-strong relative isolate aspect-[16/10] w-full min-h-[180px] cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-3xl sm:min-h-[220px]"
              onPointerDown={onPointerDown}
              onKeyDown={(event) => {
                const step = event.shiftKey ? 10 : 5;
                if (event.key === "ArrowLeft") {
                  event.preventDefault();
                  setPosition((p) => Math.max(0, p - step));
                }
                if (event.key === "ArrowRight") {
                  event.preventDefault();
                  setPosition((p) => Math.min(100, p + step));
                }
                if (event.key === "Home") {
                  event.preventDefault();
                  setPosition(0);
                }
                if (event.key === "End") {
                  event.preventDefault();
                  setPosition(100);
                }
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={meta.id}
                  className="absolute inset-0 isolate"
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <Image
                      src={meta.beforeSrc}
                      alt={current.beforeAlt}
                      fill
                      draggable={false}
                      sizes="(max-width: 1024px) 100vw, 70vw"
                      className="pointer-events-none select-none object-cover object-top"
                      priority={safeIndex === 0}
                    />
                  </div>
                  <div
                    className="absolute inset-y-0 left-0 top-0 z-10 overflow-hidden"
                    style={{ width: `${clip}%` }}
                  >
                    <div
                      className="absolute left-0 top-0 h-full overflow-hidden"
                      style={{ width: `${innerWidthPercent}%` }}
                    >
                      <Image
                        src={meta.afterSrc}
                        alt={current.afterAlt}
                        fill
                        draggable={false}
                        sizes="(max-width: 1024px) 100vw, 70vw"
                        className="pointer-events-none select-none object-cover object-top"
                        priority={safeIndex === 0}
                      />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div
                className="pointer-events-none absolute inset-y-0 z-20 w-0.5 bg-accentGold shadow-[0_0_24px_rgba(252,211,77,0.45)]"
                style={{ left: `${clip}%`, transform: "translateX(-50%)" }}
              >
                <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accentGold bg-bgPrimary text-lg text-accentGold shadow-lg">
                  ↔
                </span>
              </div>
            </div>

            <div className="mt-4 flex justify-between px-1 font-mono text-[11px] uppercase tracking-[0.2em] text-textMuted">
              <span className="text-accentGold/90">{t.beforeAfter.afterBadge}</span>
              <span>{t.beforeAfter.beforeBadge}</span>
            </div>
            <p className="mt-2 text-center text-sm text-textMuted">{t.beforeAfter.dragHint}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
