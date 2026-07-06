"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  type Variants,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/ui";
import { useLiteMode } from "@/lib/hooks/use-lite-mode";

/* ── useTilt: pointer-driven 3D press-into-screen effect ───── */

export function useTilt(intensity = 8) {
  const reduce = useReducedMotion();
  const liteMode = useLiteMode();
  const disabled = reduce || liteMode;
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 200, damping: 18 });
  const rotateY = useSpring(ry, { stiffness: 200, damping: 18 });

  const tiltStyle = disabled ? undefined : { rotateX, rotateY, transformPerspective: 900 };

  function onTiltMove(e: MouseEvent<HTMLElement>) {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - rect.left) / rect.width - 0.5) * intensity);
    rx.set(-((e.clientY - rect.top) / rect.height - 0.5) * intensity);
  }

  function onTiltLeave() {
    rx.set(0);
    ry.set(0);
  }

  return { tiltStyle, onTiltMove, onTiltLeave };
}

/* ── Spotlight: cursor-following glow for cards (pairs with .spotlight-card) ── */

export function useSpotlight() {
  return useCallback((event: MouseEvent<HTMLElement>) => {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    el.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }, []);
}

/* ── Scroll progress bar (top of viewport) ─────────────────── */

export function ScrollProgress() {
  const liteMode = useLiteMode();
  const { scrollYProgress } = useScroll();

  if (liteMode) {
    return null;
  }

  return (
    <motion.div
      aria-hidden
      style={{ scaleX: scrollYProgress }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-accentGold via-accentWarm to-accentWarm"
    />
  );
}

/* ── Reveal: scroll-in fade/slide wrapper ──────────────────── */

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      delay: custom,
      ease: [0.22, 0.61, 0.36, 1],
    },
  }),
};

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "span";
}

export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const liteMode = useLiteMode();
  const MotionTag = motion[as];

  if (shouldReduceMotion || liteMode) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      variants={revealVariants}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </MotionTag>
  );
}

/* ── Eyebrow: mono kicker with leading dot ─────────────────── */

interface EyebrowProps {
  children: ReactNode;
  className?: string;
  withDot?: boolean;
}

export function Eyebrow({ children, className, withDot = true }: EyebrowProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.3em] text-accentGold hyphens-none text-safe-wrap sm:text-[11px]",
        className,
      )}
    >
      {withDot ? (
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-accentGold shadow-[0_0_10px_rgba(252,211,77,0.8)]"
        />
      ) : null}
      {children}
    </span>
  );
}

/* ── Tag / badge ───────────────────────────────────────────── */

interface TagProps {
  children: ReactNode;
  className?: string;
  tone?: "default" | "gold" | "emerald";
}

export function Tag({ children, className, tone = "default" }: TagProps) {
  const tones: Record<string, string> = {
    default: "border-borderCool bg-white/[0.03] text-textSecondary",
    gold: "border-accentGold/35 bg-accentGold/10 text-accentGold",
    emerald: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ── Section heading: eyebrow + big editorial title ────────── */

interface SectionHeadingProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
      ) : null}
      <Reveal delay={0.05}>
        <h2 className="mt-5 text-fluid-title font-display font-light text-textPrimary text-safe-wrap">
          {title}
        </h2>
      </Reveal>
      {description ? (
        <Reveal delay={0.1}>
          <p
            className={cn(
              "mt-5 text-lg leading-relaxed text-textSecondary text-pretty",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

/* ── Animated counter: counts up when scrolled into view ───── */

interface AnimatedCounterProps {
  value: string;
  className?: string;
  durationMs?: number;
}

/** Splits a string like "20%", "4", "24h", "€100k" into prefix/number/suffix
    and animates only the numeric part. */
export function AnimatedCounter({ value, className, durationMs = 1500 }: AnimatedCounterProps) {
  const shouldReduceMotion = useReducedMotion();
  const liteMode = useLiteMode();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  // Always start with the real value so SSR / crawlers / social previews
  // see the correct number — not a zero placeholder.
  const [display, setDisplay] = useState(value);

  const match = value.match(/^(\D*)(\d[\d.,]*)(.*)$/);
  const prefix = match?.[1] ?? "";
  const numberRaw = match?.[2] ?? "";
  const suffix = match?.[3] ?? "";
  const target = Number(numberRaw.replace(/[.,]/g, ""));
  const hasNumber = match !== null && Number.isFinite(target);

  useEffect(() => {
    if (!inView || shouldReduceMotion || liteMode || !hasNumber) return;
    setDisplay(`${prefix}0${suffix}`);
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      setDisplay(`${prefix}${current.toLocaleString("en-US").replace(/,/g, "\u202f")}${suffix}`);
      if (progress < 1) raf = requestAnimationFrame(tick);
      else setDisplay(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, shouldReduceMotion, liteMode, hasNumber, target, durationMs, prefix, suffix, value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

/* ── Marquee: infinite horizontal scroller ─────────────────── */

interface MarqueeProps {
  items: ReactNode[];
  reverse?: boolean;
  className?: string;
  itemClassName?: string;
}

export function Marquee({ items, reverse, className, itemClassName }: MarqueeProps) {
  const doubled = [...items, ...items];
  return (
    <div className={cn("mask-fade-x overflow-hidden", className)}>
      <div className={cn("marquee", reverse && "marquee-reverse")}>
        {doubled.map((item, i) => (
          <span
            key={i}
            className={cn("flex shrink-0 items-center", itemClassName)}
            aria-hidden={i >= items.length}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Small arrow chip used on cards/links ──────────────────── */

export function ArrowChip({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-borderCool bg-white/[0.03] text-textPrimary transition-all duration-300 group-hover:border-accentGold group-hover:bg-accentGold/10 group-hover:text-accentGold",
        className,
      )}
    >
      <ArrowUpRight
        size={18}
        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </span>
  );
}
