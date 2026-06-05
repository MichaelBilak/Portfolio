"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { type MouseEvent } from "react";
import { Link } from "@/i18n/navigation";

interface ServiceItem {
  id: string;
  slug: string;
  image: string;
}

interface ServicesCrystalGridProps {
  metas: ServiceItem[];
  titles: string[];
  viewServiceLabel: string;
}

function CrystalCard({
  meta,
  title,
  viewServiceLabel,
}: {
  meta: ServiceItem;
  title: string;
  viewServiceLabel: string;
}) {
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
    <Link
      href={`/services/${meta.slug}`}
      className="group focus-outline flex flex-col items-center text-center"
      aria-label={title}
    >
      {/* Tilt stage */}
      <motion.div
        className="crystal-stage relative flex h-28 w-full items-center justify-center sm:h-36 md:h-44"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 260 }}
      >
        <span
          aria-hidden
          className="crystal-halo pointer-events-none absolute h-28 w-28 rounded-full bg-emerald-500/15 opacity-70 blur-[50px] transition-all duration-500 group-hover:bg-accentGold/15"
        />
        <Image
          src={meta.image}
          alt={title}
          width={420}
          height={420}
          sizes="(max-width: 640px) 40vw, (max-width: 768px) 28vw, 200px"
          className="crystal-figure relative h-full w-full object-contain"
        />
      </motion.div>

      {/* Label */}
      <h3 className="mt-3 text-base font-semibold leading-tight tracking-tight text-textPrimary md:text-lg">
        {title}
      </h3>

      {/* CTA */}
      <span className="mt-2 inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-accentGold/70 transition-colors duration-300 group-hover:text-accentGold">
        {viewServiceLabel}
        <ArrowUpRight
          size={11}
          className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}

export function ServicesCrystalGrid({
  metas,
  titles,
  viewServiceLabel,
}: ServicesCrystalGridProps) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-5 md:gap-x-6">
      {metas.map((meta, i) => (
        <CrystalCard
          key={meta.id}
          meta={meta}
          title={titles[i]}
          viewServiceLabel={viewServiceLabel}
        />
      ))}
    </div>
  );
}
