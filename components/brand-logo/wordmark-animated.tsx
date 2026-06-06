"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { LOGO_D_SRC } from "@/components/brand-logo/wordmark-core";

const D_WIDTH = 661;
const D_HEIGHT = 615;

const EASE = [0.22, 1, 0.36, 1] as const;
const STAGGER = 0.1;
const DURATION = 0.38;

interface AnimatedWordmarkProps {
  className?: string;
  groupClassName?: string;
  priority?: boolean;
}

export function AnimatedWordmark({
  className = "",
  groupClassName = "text-[0.72em] font-normal tracking-[0.04em] text-textPrimary/90",
  priority = false,
}: AnimatedWordmarkProps) {
  const reduce = useReducedMotion();

  const step = (index: number) =>
    reduce
      ? { duration: 0 }
      : { duration: DURATION, delay: STAGGER * index, ease: EASE };

  return (
    <span
      aria-hidden
      className={`inline-flex items-baseline whitespace-nowrap font-brand font-light leading-none tracking-tight text-textPrimary ${className}`}
    >
      <motion.span
        className="inline-block shrink-0 leading-none"
        initial={reduce ? false : { opacity: 0, x: "-1.1em" }}
        animate={{ opacity: 1, x: 0 }}
        transition={step(0)}
      >
        <Image
          src={LOGO_D_SRC}
          alt=""
          aria-hidden
          width={D_WIDTH}
          height={D_HEIGHT}
          priority={priority}
          className="h-[1em] w-auto self-baseline"
        />
      </motion.span>

      <motion.span
        className="inline-block leading-none"
        initial={reduce ? false : { opacity: 0, scale: 0.35 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={step(1)}
        style={{ transformOrigin: "left center" }}
      >
        orm
      </motion.span>

      <motion.span
        className="inline-block leading-none text-accentGold"
        initial={reduce ? false : { opacity: 0, y: "-0.55em" }}
        animate={{ opacity: 1, y: 0 }}
        transition={step(2)}
      >
        Up
      </motion.span>

      <motion.span
        className={`inline-block leading-none ${groupClassName}`}
        initial={reduce ? false : { opacity: 0, x: "0.9em" }}
        animate={{ opacity: 1, x: 0 }}
        transition={step(3)}
      >
        {" Group"}
      </motion.span>
    </span>
  );
}
