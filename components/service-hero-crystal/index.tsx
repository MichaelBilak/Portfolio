"use client";

import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { type MouseEvent } from "react";

interface ServiceHeroCrystalProps {
  src: string;
  alt: string;
}

export function ServiceHeroCrystal({ src, alt }: ServiceHeroCrystalProps) {
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
      className="crystal-stage relative hidden shrink-0 items-center justify-center md:flex"
      style={{
        width: 260,
        height: 260,
        ...(reduce ? {} : { rotateX, rotateY, transformPerspective: 260 }),
      }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
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
      <span
        aria-hidden
        className="crystal-halo pointer-events-none absolute h-40 w-40 rounded-full bg-accentGold/10 opacity-80 blur-[65px]"
      />
      <Image
        src={src}
        alt={alt}
        width={520}
        height={520}
        sizes="260px"
        priority
        className="crystal-figure relative h-full w-full object-contain"
      />
    </motion.div>
  );
}
