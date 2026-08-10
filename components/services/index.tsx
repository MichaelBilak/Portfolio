"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { servicesMeta } from "@/data/services";
import { Link } from "@/i18n/navigation";
import { Eyebrow, Reveal } from "@/components/ui";
import { useLiteMode } from "@/lib/hooks/use-lite-mode";
import { TranslationSet } from "@/lib/translations";

interface ServicesProps {
  t: TranslationSet;
  serviceMetas?: Array<{ id: string; slug: string; image: string }>;
}

interface CarouselItem {
  id: string;
  slug: string;
  image: string;
  title: string;
  details: string;
  description: string;
}

function useServiceItems(
  t: TranslationSet,
  metas: Array<{ id: string; slug: string; image: string }>,
): CarouselItem[] {
  return useMemo(
    () =>
      metas
        .map((meta) => {
          const copy = t.services.find((s) => s.id === meta.id);
          if (!copy) return null;
          return {
            id: meta.id,
            slug: meta.slug,
            image: meta.image,
            title: copy.title,
            details: copy.details,
            description: copy.description,
          };
        })
        .filter((item): item is CarouselItem => Boolean(item)),
    [t, metas],
  );
}

export function Services({ t, serviceMetas }: ServicesProps) {
  const metas = serviceMetas ?? servicesMeta.map(({ id, slug, image }) => ({ id, slug, image }));
  const items = useServiceItems(t, metas);
  const reduce = useReducedMotion();
  const lite = useLiteMode();
  const simplified = Boolean(reduce || lite);
  const [active, setActive] = useState(0);

  return (
    <section id="services" className="relative py-16 md:py-28">
      {simplified ? (
        <div className="container-lux">
          <ServicesIntro t={t} />
          <div className="mt-10 md:mt-12">
            <StaticCarousel items={items} active={0} />
          </div>
        </div>
      ) : (
        <ScrollCarousel
          items={items}
          active={active}
          onActiveChange={setActive}
          t={t}
        />
      )}

      <div className="container-lux mt-10 md:mt-16">
        <ServiceList
          items={items}
          viewServiceLabel={t.servicePage.viewService}
        />

        <Reveal delay={0.12} className="mt-10 flex justify-center md:mt-12">
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

function ServicesIntro({ t }: { t: TranslationSet }) {
  return (
    <div className="max-w-2xl">
      <Eyebrow>{t.nav.services}</Eyebrow>
      <h2 className="mt-5 text-fluid-title font-display font-light text-textPrimary text-safe-wrap">
        {t.servicesLabel}
      </h2>
      <span className="mt-4 block max-w-full font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-textMuted text-pretty sm:tracking-[0.24em]">
        {t.servicesLead}
      </span>
    </div>
  );
}

function ScrollCarousel({
  items,
  active,
  onActiveChange,
  t,
}: {
  items: CarouselItem[];
  active: number;
  onActiveChange: (index: number) => void;
  t: TranslationSet;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const count = items.length;

  // Rotation begins only once the composition is pinned — matching the
  // "What we build + carousel" viewport the user sees before spin starts.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // Hold still briefly after pin, then start rotating — spin begins a beat later.
  const rotateZ = useTransform(
    scrollYProgress,
    [0, 0.14, 1],
    [0, 0, -((360 * (count - 1)) / Math.max(count, 1))],
  );

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (count <= 1) {
      if (activeRef.current !== 0) {
        activeRef.current = 0;
        onActiveChange(0);
      }
      return;
    }
    const spinProgress = Math.max(0, (progress - 0.14) / 0.86);
    const next = Math.round(spinProgress * (count - 1));
    const nextActive = Math.min(count - 1, Math.max(0, next));
    if (nextActive !== activeRef.current) {
      activeRef.current = nextActive;
      onActiveChange(nextActive);
    }
  });

  const activeItem = items[active] ?? items[0];

  return (
    <div
      ref={trackRef}
      className="relative h-[180vh] sm:h-[200vh] md:h-[240vh]"
    >
      <div className="sticky top-[var(--header-offset,4.5rem)] flex h-[calc(100svh-var(--header-offset,4.5rem))] flex-col overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(48%_42%_at_50%_52%,rgba(252,211,77,0.08),transparent_70%)]"
        />

        <div className="container-lux relative z-20 shrink-0 -mt-1 pt-0 sm:-mt-1.5 md:-mt-2">
          <ServicesIntro t={t} />
        </div>

        <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center pb-8">
          <CarouselStage items={items} active={active} rotateZ={rotateZ} />

          {activeItem ? (
            <div className="relative z-10 mt-20 w-full max-w-4xl px-4 text-center sm:mt-24 sm:px-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accentGold/80">
                {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </p>
              <h3 className="mt-2 px-1 font-display text-xl font-semibold tracking-tight text-textPrimary text-safe-wrap sm:text-2xl md:whitespace-nowrap md:text-3xl">
                {activeItem.title}
              </h3>
              <p className="mt-2 px-1 font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-accentWarm/75 text-pretty sm:tracking-[0.16em] md:whitespace-nowrap">
                {activeItem.details}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function StaticCarousel({
  items,
  active,
}: {
  items: CarouselItem[];
  active: number;
}) {
  const rotateZ = useMotionValue(0);
  const activeItem = items[active] ?? items[0];

  return (
    <div className="flex flex-col items-center">
      <CarouselStage items={items} active={active} rotateZ={rotateZ} />
      {activeItem ? (
        <div className="mt-20 w-full max-w-4xl px-4 text-center sm:mt-24 sm:px-6">
          <h3 className="px-1 font-display text-xl font-semibold tracking-tight text-textPrimary text-safe-wrap sm:text-2xl md:whitespace-nowrap md:text-3xl">
            {activeItem.title}
          </h3>
          <p className="mt-2 px-1 font-mono text-[10px] uppercase tracking-[0.14em] text-accentWarm/75 text-pretty sm:tracking-[0.16em] md:whitespace-nowrap">
            {activeItem.details}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function CarouselStage({
  items,
  active,
  rotateZ,
}: {
  items: CarouselItem[];
  active: number;
  rotateZ: MotionValue<number>;
}) {
  const count = items.length;
  const step = 360 / Math.max(count, 1);
  const radii = useCarouselRadii();

  return (
    <div className="services-carousel-scene relative flex h-[clamp(16rem,42svh,22rem)] w-full max-w-4xl items-center justify-center">
      <div className="services-carousel-ring relative h-full w-full">
        {items.map((item, index) => (
          <CarouselCrystal
            key={`${item.id}-${radii.x}`}
            item={item}
            angle={index * step}
            isFront={index === active}
            ringRotateZ={rotateZ}
            radiusX={radii.x}
            radiusY={radii.y}
          />
        ))}
      </div>
    </div>
  );
}

function useCarouselRadii() {
  const [radii, setRadii] = useState({ x: 148, y: 72 });

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      // Wider, flatter ellipse — balanced fan with front crystal centered below.
      if (width >= 768) setRadii({ x: 300, y: 118 });
      else if (width >= 640) setRadii({ x: 228, y: 96 });
      else setRadii({ x: 148, y: 72 });
    };

    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  return radii;
}

const CarouselCrystal = memo(function CarouselCrystal({
  item,
  angle,
  isFront,
  ringRotateZ,
  radiusX,
  radiusY,
}: {
  item: CarouselItem;
  angle: number;
  isFront: boolean;
  ringRotateZ: MotionValue<number>;
  radiusX: number;
  radiusY: number;
}) {
  // Numeric px positions — CSS calc()/vars break Framer Motion x/y.
  // Orbit around the crystal's visual center (not its top-left).
  const x = useTransform(ringRotateZ, (phi) => {
    const radians = ((angle + phi) * Math.PI) / 180;
    return Math.sin(radians) * radiusX;
  });
  const y = useTransform(ringRotateZ, (phi) => {
    const radians = ((angle + phi) * Math.PI) / 180;
    return Math.cos(radians) * radiusY;
  });

  // 0 at the front of the ellipse → 1 at the far back.
  const depth = useTransform(ringRotateZ, (phi) => {
    const turns = (((angle + phi) % 360) + 360) % 360;
    const delta = Math.min(turns, 360 - turns) / 180;
    return delta;
  });

  // Stronger depth: front larger, back darker/smaller.
  const scale = useTransform(depth, [0, 0.35, 1], [1.38, 0.7, 0.38]);
  const opacity = useTransform(depth, [0, 0.35, 1], [1, 0.28, 0.08]);
  const zIndex = useTransform(depth, (value) => Math.round((1 - value) * 50));

  return (
    <motion.div
      className="services-carousel-item absolute left-1/2 top-1/2 will-change-transform"
      style={{
        x,
        y,
        scale,
        opacity,
        zIndex,
      }}
      transformTemplate={({ x: tx, y: ty, scale: s }) =>
        `translate(-50%, -50%) translate3d(${tx}, ${ty}, 0) scale(${s})`
      }
    >
      <Link
        href={`/services/${item.slug}`}
        aria-label={item.title}
        aria-current={isFront ? "true" : undefined}
        className="group crystal-stage focus-outline relative block"
        tabIndex={isFront ? 0 : -1}
      >
        <span
          aria-hidden
          className={`crystal-halo pointer-events-none absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[40px] sm:h-36 sm:w-36 ${
            isFront ? "bg-accentGold/25 opacity-80" : "hidden"
          }`}
        />
        <Image
          src={item.image}
          alt=""
          width={460}
          height={460}
          sizes="(max-width: 640px) 42vw, 220px"
          priority={isFront}
          loading={isFront ? "eager" : "lazy"}
          className="crystal-figure relative h-36 w-36 object-contain sm:h-44 sm:w-44 md:h-52 md:w-52"
        />
      </Link>
    </motion.div>
  );
});

function ServiceList({
  items,
  viewServiceLabel,
}: {
  items: CarouselItem[];
  viewServiceLabel: string;
}) {
  return (
    <ul className="mx-auto max-w-2xl divide-y divide-borderSubtle border-y border-borderSubtle">
      {items.map((item, index) => (
        <li key={item.id}>
          <Link
            href={`/services/${item.slug}`}
            className="group focus-outline flex items-center gap-4 py-4 text-textPrimary transition-colors duration-300 hover:text-accentGold sm:gap-6 sm:py-5"
          >
            <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.22em] text-textMuted">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-base font-semibold tracking-tight text-safe-wrap sm:text-lg">
                {item.title}
              </span>
              <span className="mt-1 block font-mono text-[10px] uppercase leading-snug tracking-[0.12em] text-textMuted text-pretty line-clamp-2 sm:tracking-[0.14em] sm:line-clamp-1">
                {item.details}
              </span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-1.5 text-sm text-textMuted transition-colors group-hover:text-accentGold">
              <span className="hidden sm:inline">{viewServiceLabel}</span>
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
