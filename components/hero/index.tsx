"use client";

import Image from "next/image";
import { ArrowUpRight, MapPin, TrendingUp } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { useCrystalTilt } from "@/lib/hooks/use-crystal-tilt";
import { useLiteMode } from "@/lib/hooks/use-lite-mode";
import { ContactLink } from "@/components/contact-link";
import { Link } from "@/i18n/navigation";
import { preventBrokenPhrases } from "@/lib/format-text";
import { TranslationSet } from "@/lib/translations";
import { btn } from "@/lib/ui";

interface HeroProps {
  t: TranslationSet;
}

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 0.61, 0.36, 1] } },
};

export function Hero({ t }: HeroProps) {
  const shouldReduceMotion = useReducedMotion();
  const headlineLines = t.hero.headline.split("\n");

  return (
    <section
      id="top"
      className="relative overflow-x-clip pt-page md:min-h-screen-dvh"
    >
      {/* Calm aurora backdrop — slow drifting orbs, no busy grid */}
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <span className="hero-orb hero-orb-gold -left-[14%] -top-[20%] h-[42rem] w-[42rem] max-w-[130vw]" />
        <span className="hero-orb hero-orb-emerald -bottom-[24%] -right-[12%] h-[40rem] w-[40rem] max-w-[130vw]" />
      </div>
      {/* Soft spotlight that lifts the headline area for readability */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(58%_50%_at_28%_38%,rgba(252,211,77,0.07),transparent_70%)]"
      />
      <div className="grain-overlay absolute inset-0" aria-hidden />

      <div className="container-wide relative grid min-h-hero min-w-0 items-center gap-12 py-8 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="min-w-0 space-y-6 sm:space-y-9"
        >
          <motion.div variants={item} className="max-w-full">
            <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-borderSubtle bg-white/[0.03] px-2.5 py-1.5 font-mono uppercase text-accentGold backdrop-blur sm:gap-2.5 sm:px-4">
              <span className="relative inline-flex h-1.5 w-1.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accentGold opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accentGold" />
              </span>
              <span className="max-w-full text-[10px] leading-tight tracking-[0.08em] hyphens-none sm:whitespace-nowrap sm:text-[11px] sm:tracking-[0.28em]">
                {preventBrokenPhrases(t.hero.eyebrow)}
              </span>
            </span>
          </motion.div>

          <h1 className="text-fluid-hero-headline max-w-full font-display font-semibold text-textPrimary text-safe-wrap">
            {headlineLines.map((line, index) => (
              <motion.span key={line} variants={item} className="block text-safe-wrap">
                {index === headlineLines.length - 1 ? (
                  <span className="text-gradient-sheen">{line}</span>
                ) : (
                  line
                )}
              </motion.span>
            ))}
          </h1>

          {t.hero.subtitle ? (
            <motion.p
              variants={item}
              className="font-mono text-[11px] uppercase tracking-[0.24em] text-textMuted"
            >
              {t.hero.subtitle}
            </motion.p>
          ) : null}

          <motion.p
            variants={item}
            className="max-w-xl text-sm leading-relaxed text-textSecondary text-pretty line-clamp-4 sm:line-clamp-none sm:text-lg"
          >
            {t.hero.lead}
          </motion.p>

          <motion.div variants={item} className="py-1">
            <div className="flex max-w-full flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3 md:flex-nowrap">
              <Link
                href="/order"
                className={btn(
                  "primary",
                  "md",
                  "w-full justify-center overflow-visible sm:w-auto sm:shrink-0 sm:whitespace-nowrap",
                )}
              >
                <span className="relative z-10">{t.hero.buyCta}</span>
                <ArrowUpRight
                  size={16}
                  className="relative z-10 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
              <ContactLink
                audit
                className={btn(
                  "secondary",
                  "md",
                  "w-full justify-center overflow-visible sm:w-auto sm:shrink-0 sm:whitespace-nowrap",
                )}
              >
                <span className="relative z-10">{t.hero.secondaryCta}</span>
                <ArrowUpRight
                  size={16}
                  className="relative z-10 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </ContactLink>
              <Link
                href="/work"
                className={btn(
                  "ghost",
                  "md",
                  "w-full justify-center overflow-visible sm:w-auto sm:shrink-0 sm:whitespace-nowrap",
                )}
              >
                {t.hero.primaryCta}
              </Link>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="flex min-w-0 items-center gap-3 text-sm text-textSecondary"
          >
            <span className="relative inline-flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/80 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            <span className="min-w-0 text-pretty hyphens-none">{preventBrokenPhrases(t.hero.socialProof)}</span>
          </motion.div>
        </motion.div>

        <HeroVisual t={t} reduce={!!shouldReduceMotion} />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-bgPrimary to-transparent"
      />
    </section>
  );
}

interface HeroVisualProps {
  t: TranslationSet;
  reduce: boolean;
}

interface FloatingChipProps {
  reduce: boolean;
  delay: number;
  duration: number;
  amplitude: number;
  drift?: number;
  className?: string;
  children: ReactNode;
}

/** Entrance fade + continuous levitation on a separate layer so transforms don't fight. */
function FloatingChip({
  reduce,
  delay,
  duration,
  amplitude,
  drift = 0,
  className,
  children,
}: FloatingChipProps) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 0.61, 0.36, 1] }}
      className={className}
    >
      <motion.div
        animate={
          reduce
            ? undefined
            : {
                y: [0, -amplitude, 0],
                x: drift ? [0, drift, 0, -drift, 0] : 0,
              }
        }
        transition={
          reduce
            ? undefined
            : {
                y: {
                  duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: delay + 0.35,
                },
                x: drift
                  ? {
                      duration: duration * 1.35,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: delay + 0.5,
                    }
                  : undefined,
              }
        }
        className="hero-float-chip-inner"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function HeroVisual({ t, reduce }: HeroVisualProps) {
  const liteMode = useLiteMode();
  const simplified = reduce || liteMode;

  if (simplified) {
    return <HeroVisualStatic t={t} />;
  }

  return <HeroVisualAnimated t={t} />;
}

function HeroVisualStatic({ t }: { t: TranslationSet }) {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <ContactLink
        audit
        aria-label={t.hero.secondaryCta}
        className="group focus-outline interactive glass-card-strong relative block overflow-hidden rounded-[1.75rem] p-3"
      >
        <div className="relative mb-3 flex items-center gap-1.5 px-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-3 inline-flex flex-1 items-center justify-center truncate rounded-md bg-bgPrimary/60 px-3 py-1 font-mono text-[10px] tracking-[0.04em] text-textMuted">
            your.perfect.business.card.it
          </span>
        </div>
        <HeroSiteCarousel reduce />
      </ContactLink>
    </div>
  );
}

function HeroVisualAnimated({ t }: { t: TranslationSet }) {
  const { scrollY } = useScroll();
  const parallax = useTransform(scrollY, [0, 700], [0, -70]);

  const { rotateX, rotateY, tiltHandlers } = useCrystalTilt({
    angleX: 10,
    angleY: 10,
    stiffness: 150,
    damping: 16,
    gyroX: 7,
    gyroY: 7,
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1], delay: 0.15 }}
      style={{ y: parallax }}
      className="relative mx-auto w-full max-w-xl"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[118%] w-[118%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-accentGold/15"
        style={{ animation: "spinSlow 60s linear infinite" }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 translate-y-6 rounded-full bg-gold-radial opacity-30 blur-3xl"
      />

      <motion.div
        {...tiltHandlers}
        className="touch-pan-y"
        style={{ rotateX, rotateY, transformPerspective: 900 }}
      >
        <ContactLink
          audit
          aria-label={t.hero.secondaryCta}
          className="group focus-outline interactive glass-card-strong relative block overflow-hidden rounded-[1.75rem] p-3 transition-all duration-300 hover:border-accentGold/50 hover:shadow-[0_28px_70px_-28px_rgba(252,211,77,0.45)]"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-gradient opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-70"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-accentGold/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
          />

          <div className="relative mb-3 flex items-center gap-1.5 px-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
            <span className="ml-3 inline-flex flex-1 items-center justify-center truncate rounded-md bg-bgPrimary/60 px-3 py-1 font-mono text-[10px] tracking-[0.04em] text-textMuted">
              your.perfect.business.card.it
            </span>
          </div>

          <HeroSiteCarousel reduce={false} />
        </ContactLink>
      </motion.div>

      {/* Floating UI chips — levitate over the mockup */}
      <FloatingChip
        reduce={false}
        delay={0.4}
        duration={5.2}
        amplitude={16}
        drift={3}
        className="absolute -left-3 top-[22%] z-10 max-sm:hidden"
      >
        <div className="glass-card-strong flex items-center gap-3 rounded-2xl px-4 py-3 max-sm:px-3 max-sm:py-2.5">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300 max-sm:h-8 max-sm:w-8">
            <TrendingUp size={16} />
          </span>
          <span className="leading-tight whitespace-nowrap">
            <span className="block font-display text-xl font-medium text-textPrimary max-sm:text-lg">+32%</span>
            <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-textMuted">
              direct bookings
            </span>
          </span>
        </div>
      </FloatingChip>

      <FloatingChip
        reduce={false}
        delay={0.75}
        duration={6.4}
        amplitude={18}
        drift={4}
        className="absolute -right-2 bottom-[16%] z-10 max-sm:hidden"
      >
        <div className="glass-card-strong flex items-center gap-2.5 rounded-2xl px-4 py-3 max-sm:px-3 max-sm:py-2.5">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accentGold/15 text-accentGold max-sm:h-8 max-sm:w-8">
            <MapPin size={16} />
          </span>
          <span className="leading-tight whitespace-nowrap">
            <span className="block text-sm font-medium text-textPrimary max-sm:text-[13px]">Emilia-Romagna, IT</span>
            <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-textMuted">
              digital studio
            </span>
          </span>
        </div>
      </FloatingChip>
    </motion.div>
  );
}

// Possible website directions, shown blurred and slowly cross-fading —
// "your site could look like any of these; the direction is yours."
const SITE_IMAGES = [
  "/images/site-restaurant.png",
  "/images/site-hotel.png",
  "/images/site-bar.png",
  "/images/site-cafe.png",
];

function HeroSiteCarousel({ reduce }: { reduce: boolean }) {
  const [index, setIndex] = useState(0);
  const staticImage = SITE_IMAGES[0];

  useEffect(() => {
    if (reduce) return;

    let id: number | undefined;

    const start = () => {
      if (id) return;
      id = window.setInterval(() => {
        setIndex((i) => (i + 1) % SITE_IMAGES.length);
      }, 3800);
    };

    const stop = () => {
      if (!id) return;
      window.clearInterval(id);
      id = undefined;
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduce]);

  useEffect(() => {
    if (reduce) return;
    SITE_IMAGES.slice(1).forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, [reduce]);

  if (reduce) {
    return (
      <div className="relative aspect-[900/680] overflow-hidden rounded-2xl bg-bgPrimary">
        <Image
          src={staticImage}
          alt=""
          aria-hidden
          fill
          sizes="(max-width: 1024px) 90vw, 40vw"
          className="scale-[1.12] object-cover blur-[8px]"
          priority
        />
        <span aria-hidden className="pointer-events-none absolute inset-0 bg-[#06080c]/35" />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06080c]/75 via-transparent to-[#06080c]/15"
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-[900/680] overflow-hidden rounded-2xl bg-bgPrimary">
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={SITE_IMAGES[index]}
            alt=""
            aria-hidden
            fill
            sizes="(max-width: 1024px) 90vw, 40vw"
            className="scale-[1.12] object-cover blur-[8px] transition-transform duration-700 group-hover:scale-[1.18]"
            priority={index === 0}
          />
        </motion.div>
      </AnimatePresence>

      {/* Tint + vignette: premium depth and keeps the content intentionally unreadable */}
      <span aria-hidden className="pointer-events-none absolute inset-0 bg-[#06080c]/35" />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06080c]/75 via-transparent to-[#06080c]/15"
      />

      {/* Progress dots */}
      <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {SITE_IMAGES.map((src, i) => (
          <span
            key={src}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === index ? "w-5 bg-accentGold" : "w-1.5 bg-white/35"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
