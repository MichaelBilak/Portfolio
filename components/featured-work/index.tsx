"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { ProjectMeta, projectsMeta } from "@/data/projects";
import { Link } from "@/i18n/navigation";
import { fadeUp, sectionStagger } from "@/lib/animations";
import { LocalizedProject, TranslationSet } from "@/lib/translations";

const MotionLink = motion(Link);

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
    <section id="work" className="relative py-24 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/4 top-32 h-72 w-72 rounded-full bg-violet-glow opacity-25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/4 bottom-20 h-72 w-72 rounded-full bg-cyan-glow opacity-25 blur-3xl"
      />

      <div className="container-lux relative">
        {!hideHeading && (
          <h2 className="text-fluid-title mb-14 font-display font-light">
            {t.caseStudies.label}
          </h2>
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
  return (
    <motion.div
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      className="mt-12 md:mt-16"
    >
      <Link
        href="/work"
        aria-label={`${title} (${count})`}
        className="glass-card group relative flex items-center justify-between gap-5 overflow-hidden rounded-3xl px-6 py-6 transition-all duration-300 hover:-translate-y-1 hover:border-accentGold/40 md:px-10 md:py-8"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-amber-gradient opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-60"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-violet-glow opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
        />

        <div className="relative flex items-center gap-5 md:gap-8">
          <span className="font-display text-5xl font-light leading-none text-accentGold transition-transform duration-300 group-hover:-translate-y-1 md:text-6xl">
            {formattedCount}
          </span>
          <span
            aria-hidden
            className="hidden h-14 w-px bg-borderCool md:block"
          />
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

  return (
    <MotionLink
      variants={fadeUp}
      href={`/work/${meta.slug}`}
      aria-label={`${copy.name} — ${viewCta}`}
      className="glass-card group relative flex h-full flex-col gap-7 overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-borderStrong md:p-8"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-amber-gradient opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-70"
      />

      <header className="relative flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accentGold">
            {meta.tag}
          </span>
          {meta.isLive ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-emerald-300">
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
        loaded={loaded}
        onLoad={() => setLoaded(true)}
      />

      <div className="relative space-y-2">
        <h3 className="font-display text-3xl font-light leading-tight text-textPrimary md:text-4xl">
          {copy.name}
        </h3>
        <p className="text-sm text-textSecondary">{copy.subtitle}</p>
      </div>

      <div className="relative mt-auto flex items-center justify-between gap-4 pt-2">
        <span className="inline-flex items-center gap-2 rounded-full border border-borderCool bg-white/[0.03] px-4 py-2 text-sm text-textPrimary transition-colors group-hover:border-accentGold group-hover:text-accentGold">
          {viewCta}
          <ArrowUpRight
            size={14}
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-textMuted">
          {meta.tech.slice(0, 2).join(" · ")}
        </span>
      </div>
    </MotionLink>
  );
}

interface BrowserMockupProps {
  image: string;
  alt: string;
  displayUrl: string;
  loaded: boolean;
  onLoad: () => void;
}

function BrowserMockup({ image, alt, displayUrl, loaded, onLoad }: BrowserMockupProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-borderCool bg-bgElevated shadow-[0_24px_60px_-32px_rgba(0,0,0,0.7)]">
      <div className="flex items-center gap-2 border-b border-borderCool bg-white/[0.025] px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        <span className="ml-3 inline-flex flex-1 items-center justify-center truncate rounded-md bg-bgPrimary/60 px-3 py-1 font-mono text-[10px] tracking-[0.04em] text-textMuted">
          {displayUrl}
        </span>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden">
        {!loaded ? (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-bgSecondary via-bgElevated to-bgSecondary" />
        ) : null}
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 560px, 100vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
          onLoad={onLoad}
        />
      </div>
    </div>
  );
}
