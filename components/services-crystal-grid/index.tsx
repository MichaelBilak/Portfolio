"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { useCrystalTilt } from "@/lib/hooks/use-crystal-tilt";

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
  const { rotateX, rotateY, tiltHandlers } = useCrystalTilt();

  return (
    <Link
      href={`/services/${meta.slug}`}
      className="group focus-outline flex flex-col items-center text-center"
      aria-label={title}
    >
      <motion.div
        {...tiltHandlers}
        className="crystal-stage relative flex h-28 w-full touch-pan-y items-center justify-center sm:h-36 md:h-44"
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

      <h3 className="mt-3 max-w-[16rem] text-balance text-base font-semibold leading-tight tracking-tight text-textPrimary md:text-lg">
        {title}
      </h3>

      <span className="mt-2.5 inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-textMuted transition-colors duration-300 group-hover:text-accentGold/80">
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
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-10 sm:gap-x-6 md:gap-y-14">
      {metas.map((meta, i) => (
        <div
          key={meta.id}
          className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)]"
        >
          <CrystalCard
            meta={meta}
            title={titles[i]}
            viewServiceLabel={viewServiceLabel}
          />
        </div>
      ))}
    </div>
  );
}
