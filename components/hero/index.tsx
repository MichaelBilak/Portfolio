"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { fadeUp, sectionStagger, slideFromRight } from "@/lib/animations";
import { TranslationSet } from "@/lib/translations";

interface HeroProps {
  t: TranslationSet;
}

export function Hero({ t }: HeroProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="top" className="relative min-h-screen-dvh overflow-hidden pt-24">
      <div className="ambient-glow" aria-hidden />
      <div className="grain-overlay absolute inset-0" aria-hidden />

      <div className="container-lux relative grid min-h-hero items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <motion.div
          variants={sectionStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-6 sm:space-y-8"
        >
          <motion.p
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-borderSubtle bg-white/[0.03] px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-accentGold backdrop-blur"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accentGold" />
            {t.hero.eyebrow}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="text-fluid-hero font-display font-light text-textPrimary"
          >
            {t.hero.headline.split("\n").map((line, index, arr) => (
              <span key={line} className="block">
                {index === arr.length - 1 ? (
                  <span className="bg-gradient-to-br from-accentGold via-accentWarm to-accentGold bg-clip-text text-transparent">
                    {line}
                  </span>
                ) : (
                  line
                )}
              </span>
            ))}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-textMuted"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.p variants={fadeUp} className="max-w-2xl text-lg leading-relaxed text-textSecondary">
            {t.hero.lead}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col gap-3 sm:flex-row">
            <a
              href="#contact"
              className="focus-outline interactive group relative inline-flex w-full items-center justify-center overflow-hidden rounded-full bg-accentGold px-6 py-3.5 text-center text-sm font-medium text-bgPrimary shadow-[0_18px_40px_-18px_rgba(252,211,77,0.55)] hover:shadow-[0_22px_50px_-18px_rgba(252,211,77,0.75)] sm:w-auto"
            >
              <span className="relative z-10">{t.hero.secondaryCta}</span>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              />
            </a>
            <a
              href="#work"
              className="focus-outline interactive inline-flex w-full items-center justify-center rounded-full border border-borderStrong bg-white/[0.02] px-6 py-3.5 text-center text-sm font-medium text-accentGold hover:bg-white/[0.05] sm:w-auto"
            >
              {t.hero.primaryCta}
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center gap-3 text-sm text-textSecondary">
            <span className="relative inline-flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/80 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            {t.hero.socialProof}
          </motion.div>
        </motion.div>

        <motion.div
          variants={slideFromRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          className="relative mx-auto w-full max-w-xl"
        >
          <div
            aria-hidden
            className="absolute inset-0 -z-10 translate-y-6 rounded-full bg-[radial-gradient(circle,rgba(252,211,77,0.22)_0%,rgba(252,211,77,0)_70%)] blur-3xl"
          />
          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : { y: [0, -10, 0], rotate: [0, 0.6, 0] }
            }
            transition={{
              duration: 8,
              repeat: shouldReduceMotion ? 0 : Infinity,
              ease: "easeInOut",
            }}
          >
            <Link
              href="/#contact"
              aria-label={t.hero.secondaryCta}
              className="group focus-outline interactive glass-card-strong relative block overflow-hidden rounded-3xl p-3 transition-all duration-300 hover:-translate-y-1 hover:border-accentGold/50 hover:shadow-[0_28px_70px_-28px_rgba(252,211,77,0.45)]"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-gradient opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-70"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-accentGold/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              />
              <span className="pointer-events-none absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-accentGold/40 bg-bgPrimary/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-accentGold opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                {t.nav.audit}
                <ArrowUpRight
                  size={12}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
              <div className="relative mb-3 flex items-center gap-1.5 px-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
              </div>
              <div className="relative">
                <Image
                  src="/images/hero-mockup.svg"
                  alt=""
                  aria-hidden
                  width={900}
                  height={680}
                  className="h-auto w-full rounded-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                  priority
                />
                <p
                  aria-hidden
                  className={`pointer-events-none absolute left-[8%] top-[14%] whitespace-nowrap font-mono font-normal uppercase tracking-[0.14em] text-[#E8DCC8]/65 ${
                    t.hero.mockupCaptionSm
                      ? "text-[clamp(0.3rem,0.6vw,0.4rem)]"
                      : "text-[clamp(0.4rem,0.85vw,0.55rem)]"
                  }`}
                >
                  {t.hero.mockupCaption}
                </p>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
