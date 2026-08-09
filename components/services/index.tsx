"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { type MouseEvent } from "react";
import { servicesMeta, type ServiceMeta } from "@/data/services";
import { Link } from "@/i18n/navigation";
import { Eyebrow, Reveal } from "@/components/ui";
import { useCrystalTilt } from "@/lib/hooks/use-crystal-tilt";
import { TranslationSet } from "@/lib/translations";

interface ServicesProps {
  t: TranslationSet;
}

/* ── Per-crystal tilt component ──────────────────────────────────────
   On hover the gem spins (CSS transition via .crystal-figure class).
   While the mouse moves inside, the whole stage tilts with spring
   physics — exactly like the hero mockup — creating the pop/push 3D feel.
   On leave everything springs back to zero. */
interface CrystalItemProps {
  meta: ServiceMeta;
  index: number;
  copy: { title: string; details: string; description: string };
  viewServiceLabel: string;
}

function CrystalItem({ meta, copy, viewServiceLabel }: CrystalItemProps) {
  const reduce = useReducedMotion();
  const { rotateX, rotateY, tiltHandlers } = useCrystalTilt();

  return (
    <Link
      href={`/services/${meta.slug}`}
      aria-label={copy.title}
      className="group focus-outline flex flex-col items-center rounded-3xl px-3 py-2 text-center"
    >
      {/* Tilt wrapper — springs driven by pointer (mouse/finger) + gyroscope */}
      <motion.div
        {...tiltHandlers}
        className="crystal-stage relative flex h-40 w-40 touch-pan-y items-center justify-center sm:h-48 sm:w-48 md:h-56 md:w-56"
        style={
          reduce
            ? undefined
            : { rotateX, rotateY, transformPerspective: 260 }
        }
      >
        <span
          aria-hidden
          className="crystal-halo pointer-events-none absolute h-32 w-32 rounded-full bg-emerald-500/15 opacity-70 blur-[55px]"
        />
        <Image
          src={meta.image}
          alt={copy.title}
          width={460}
          height={460}
          sizes="(max-width: 640px) 55vw, (max-width: 1024px) 30vw, 18vw"
          className="crystal-figure relative h-full w-full object-contain"
        />
      </motion.div>

      <h3 className="mt-1 text-xl font-semibold leading-tight tracking-tight text-textPrimary md:text-[1.35rem]">
        {copy.title}
      </h3>

      <p className="mt-2.5 max-w-[17rem] font-mono text-[10.5px] uppercase leading-relaxed tracking-[0.14em] text-accentWarm/80 md:hidden">
        {copy.details}
      </p>

      <p className="mt-2 line-clamp-2 max-w-[17rem] text-sm leading-relaxed text-textSecondary md:hidden">
        {copy.description}
      </p>

      {/* Short line — desktop only on homepage */}
      <p className="mt-2.5 hidden max-w-[17rem] font-mono text-[10.5px] uppercase leading-relaxed tracking-[0.14em] text-accentWarm/80 md:block">
        {copy.details}
      </p>

      {/* Main text — desktop hover; full copy lives on the service page */}
      <div className="crystal-reveal hidden w-full max-w-[18rem] md:block">
        <div>
          <p className="text-sm leading-relaxed text-textSecondary">
            {copy.description}
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm text-accentGold transition-colors group-hover:text-accentWarm">
            {viewServiceLabel}
            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function Services({ t }: ServicesProps) {
  return (
    <section id="services" className="relative py-16 md:py-32">
      <div className="container-lux">
        {/* Header: title left + decorative crystal right */}
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl flex-1">
            <Reveal>
              <Eyebrow>{t.nav.services}</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 text-fluid-title font-display font-light text-textPrimary text-safe-wrap">
                {t.servicesLabel}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <span className="mt-4 block font-mono text-[11px] uppercase tracking-[0.24em] text-textMuted">
                {t.servicesLead}
              </span>
            </Reveal>
          </div>

        </div>

        <div className="mt-14 flex flex-wrap justify-center gap-x-8 gap-y-12 md:mt-20 md:gap-x-10 md:gap-y-16">
          {servicesMeta.map((meta, index) => {
            const copy = t.services.find((s) => s.id === meta.id);
            if (!copy) return null;
            return (
              <Reveal
                key={meta.id}
                delay={(index % 3) * 0.07}
                className="w-full max-w-[19rem] sm:w-[44%] lg:w-[30%]"
              >
                <CrystalItem
                  meta={meta}
                  index={index}
                  copy={copy}
                  viewServiceLabel={t.servicePage.viewService}
                />
              </Reveal>
            );
          })}
        </div>

        {/* View all services link */}
        <Reveal delay={0.2} className="mt-14 flex justify-center md:mt-18">
          <Link
            href="/services"
            className="group inline-flex items-center gap-2.5 rounded-full border border-borderStrong bg-white/[0.04] px-7 py-3.5 text-sm font-semibold text-textPrimary backdrop-blur-sm transition-all duration-300 hover:border-accentGold/40 hover:text-accentGold"
          >
            {t.servicesPage.viewAll}
            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function HeaderCrystal({ src, alt }: { src: string; alt: string }) {
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
      className="crystal-stage relative flex h-52 w-52 items-center justify-center lg:h-64 lg:w-64"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 260 }}
    >
      <span
        aria-hidden
        className="crystal-halo pointer-events-none absolute h-36 w-36 rounded-full bg-accentGold/10 opacity-80 blur-[60px]"
      />
      <Image
        src={src}
        alt={alt}
        width={520}
        height={520}
        sizes="260px"
        className="crystal-figure relative h-full w-full object-contain"
      />
    </motion.div>
  );
}
