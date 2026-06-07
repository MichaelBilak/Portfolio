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
    <section id="work" className="relative py-20 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/4 top-32 h-72 w-72 rounded-full bg-gold-radial opacity-20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-20 right-1/4 h-72 w-72 rounded-full bg-emerald-glow opacity-20 blur-3xl"
      />

      <div className="container-lux relative">
        {!hideHeading && (
          <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <Reveal>
                <Eyebrow>{t.workPage.eyebrow}</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-5 text-fluid-title font-display font-light text-textPrimary text-balance">
                  {t.caseStudies.label}
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.1}>
              <Link
                href="/work"
                className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-accentGold transition-colors hover:text-accentWarm"
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
              liveStatus={t.workPage.liveStatus}
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
  const formattedCount = String(count).padStart(2, "0");
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
        className="glass-card group relative flex items-center justify-between gap-5 overflow-hidden rounded-3xl px-6 py-6 transition-colors duration-300 hover:border-accentGold/40 md:px-10 md:py-8"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-amber-gradient opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-60"
        />
        <div className="relative flex items-center gap-5 md:gap-8">
          <span className="font-display text-5xl font-light leading-none text-gradient-gold transition-transform duration-300 group-hover:-translate-y-1 md:text-6xl">
            {formattedCount}
          </span>
          <span aria-hidden className="hidden h-14 w-px bg-borderCool md:block" />
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accentGold">
              {eyebrow}
            </span>
            <span className="font-display text-xl font-light leading-tight text-textPrimary md:text-2xl">
              {title}
            </span>
          </div>
        </div>

        <span className="relative inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-borderCool bg-white/[0.03] text-textPrimary transition-all duration-300 group-hover:border-accentGold group-hover:bg-accentGold/10 group-hover:text-accentGold md:h-16 md:w-16">
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
  liveStatus: string;
}

function ProjectCard({ meta, copy, viewCta, liveStatus }: ProjectCardProps) {
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
      className="glass-card spotlight-card group relative flex h-full flex-col gap-6 overflow-hidden rounded-3xl p-5 transition-colors duration-300 hover:border-borderStrong md:p-6"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-amber-gradient opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-70"
      />

      <header className="relative flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-accentGold/30 bg-accentGold/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-accentGold">
            {meta.tag}
          </span>
          {meta.isLive ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-emerald-300">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]"
              />
              {liveStatus}
            </span>
          ) : null}
        </div>
        <span className="font-mono text-xs text-textMuted/70">{meta.index}</span>
      </header>

      <BrowserMockup
        image={meta.image}
        alt={`${copy.name} — ${copy.subtitle}`}
        displayUrl={meta.displayUrl}
        imagePosition={meta.imagePosition ?? "top"}
        loaded={loaded}
        onLoad={() => setLoaded(true)}
        sizes="(min-width: 1024px) 420px, 100vw"
      />

      <div className="relative space-y-2">
        <p className="text-lg font-semibold leading-snug tracking-tight text-textPrimary md:text-xl">
          {copy.subtitle}
        </p>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-textMuted">
          {copy.name}{copy.nameTagline ? ` · ${copy.nameTagline}` : ""}
        </p>
      </div>

      <div className="relative mt-auto flex items-center justify-between gap-4 border-t border-borderCool pt-4">
        <span className="inline-flex items-center gap-2 text-sm text-accentGold transition-colors group-hover:text-accentWarm">
          {viewCta}
          <ArrowUpRight
            size={14}
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
        <span className="max-w-[55%] text-right font-mono text-[10px] uppercase tracking-[0.14em] text-textMuted">
          {meta.tech.join(" · ")}
        </span>
      </div>
    </MotionLink>
  );
}
