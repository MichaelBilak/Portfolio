"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { ProjectMeta, projectsMeta } from "@/data/projects";
import { Link } from "@/i18n/navigation";
import { fadeUp, sectionStagger } from "@/lib/animations";
import { BrowserMockup } from "@/components/browser-mockup";
import { Eyebrow, Reveal, useSpotlight, useTilt } from "@/components/ui";
import { LocalizedProject, TranslationSet } from "@/lib/translations";

const MotionLink = motion.create(Link);

const HOME_LIMIT = 3;

interface FeaturedWorkProps {
  t: TranslationSet;
  variant?: "home" | "all";
  hideHeading?: boolean;
}

export function FeaturedWork({ t, variant = "home", hideHeading = false }: FeaturedWorkProps) {
  const shouldReduceMotion = useReducedMotion();
  const isHome = variant === "home";

  const totalCount = projectsMeta.length;
  const visibleProjects = isHome ? projectsMeta.slice(0, HOME_LIMIT) : projectsMeta;
  const hasMore = isHome && totalCount > HOME_LIMIT;

  return (
    <section id="work" className="relative py-16 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/4 top-32 h-72 w-72 rounded-full bg-gold-radial opacity-20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-20 right-1/4 h-72 w-72 rounded-full bg-gold-radial opacity-20 blur-3xl"
      />

      <div className="container-lux relative">
        {!hideHeading && (
          <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0 shrink-0">
              <Reveal>
                <Eyebrow>{t.workPage.eyebrow}</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-5 whitespace-nowrap text-fluid-title font-display font-light text-textPrimary">
                  {t.caseStudies.label}
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.1} className="shrink-0">
              <Link
                href="/work"
                className="group inline-flex whitespace-nowrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-accentGold transition-colors hover:text-accentWarm"
              >
                {t.workPage.viewAll}
                <ArrowUpRight
                  size={14}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </Reveal>
          </div>
        )}

        <motion.div
          variants={sectionStagger}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "visible"}
          viewport={{ once: true, margin: "-100px" }}
          className={
            isHome
              ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7"
              : "grid gap-8 lg:grid-cols-2"
          }
        >
          {visibleProjects.map((meta) => (
            <ProjectCard
              key={meta.id}
              meta={meta}
              copy={t.projects.find((p) => p.id === meta.id)!}
              viewCta={t.caseStudies.viewCaseStudy}
            />
          ))}
        </motion.div>

        {hasMore ? (
          <ViewAllCard
            count={totalCount}
            eyebrow={t.workPage.eyebrow}
            title={t.workPage.viewAll}
            shouldReduceMotion={!!shouldReduceMotion}
          />
        ) : null}
      </div>
    </section>
  );
}

interface ViewAllCardProps {
  count: number;
  eyebrow: string;
  title: string;
  shouldReduceMotion: boolean;
}

function ViewAllCard({ count, eyebrow, title, shouldReduceMotion }: ViewAllCardProps) {
  const { tiltStyle, onTiltMove, onTiltLeave } = useTilt(5);
  return (
    <motion.div
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      className="mt-12 md:mt-16"
    >
      <motion.div
        onMouseMove={onTiltMove}
        onMouseLeave={onTiltLeave}
        style={tiltStyle}
      >
      <Link
        href="/work"
        aria-label={`${title} (${count})`}
        className="glass-card group relative flex flex-col items-start justify-between gap-5 overflow-hidden rounded-3xl px-6 py-6 transition-colors duration-300 hover:border-accentGold/40 sm:flex-row sm:items-center md:px-10 md:py-8"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-amber-gradient opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-60"
        />
        <div className="relative flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accentGold">
            {eyebrow}
          </span>
          <span className="font-display text-xl font-light leading-tight text-textPrimary md:text-2xl">
            {title}
          </span>
        </div>

        <span className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center self-end rounded-full border border-borderCool bg-white/[0.03] text-textPrimary transition-all duration-300 group-hover:border-accentGold group-hover:bg-accentGold/10 group-hover:text-accentGold sm:h-14 sm:w-14 md:h-16 md:w-16">
          <ArrowUpRight
            size={22}
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
      </Link>
      </motion.div>
    </motion.div>
  );
}

interface ProjectCardProps {
  meta: ProjectMeta;
  copy: LocalizedProject;
  viewCta: string;
}

function ProjectCard({ meta, copy, viewCta }: ProjectCardProps) {
  const [loaded, setLoaded] = useState(false);
  const onMove = useSpotlight();
  const { tiltStyle, onTiltMove, onTiltLeave } = useTilt(7);

  return (
    <MotionLink
      variants={fadeUp}
      href={`/work/${meta.slug}`}
      aria-label={`${copy.name} — ${viewCta}`}
      onMouseMove={(e) => { onMove(e); onTiltMove(e); }}
      onMouseLeave={onTiltLeave}
      style={tiltStyle}
      className="glass-card spotlight-card group relative flex h-full flex-col gap-4 overflow-hidden rounded-3xl p-4 transition-colors duration-300 hover:border-borderStrong sm:gap-6 sm:p-5 md:p-6"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-amber-gradient opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-70"
      />

      <header className="relative flex items-start justify-end">
        <span className="font-mono text-xs text-textMuted/70">{meta.index}</span>
      </header>

      <BrowserMockup
        image={meta.image}
        alt={`${copy.name} — ${copy.subtitle}`}
        imagePosition={meta.imagePosition ?? "top"}
        loaded={loaded}
        onLoad={() => setLoaded(true)}
        sizes="(min-width: 1024px) 420px, 100vw"
      />

      <div className="relative space-y-2">
        <p className="text-base font-semibold leading-snug tracking-tight text-textPrimary sm:text-lg md:text-xl">
          {copy.subtitle}
        </p>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-textMuted">
          {copy.name}{copy.nameTagline ? ` · ${copy.nameTagline}` : ""}
        </p>
      </div>

      <div className="relative mt-auto flex items-center border-t border-borderCool pt-4">
        <span className="inline-flex whitespace-nowrap items-center gap-2 text-sm text-accentGold transition-colors group-hover:text-accentWarm">
          {viewCta}
          <ArrowUpRight
            size={14}
            className="shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </MotionLink>
  );
}
