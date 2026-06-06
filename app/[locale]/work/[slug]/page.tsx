import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { AuditCta } from "@/components/audit-cta";
import { BrowserMockup } from "@/components/browser-mockup";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { projectsMeta } from "@/data/projects";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Locale, translations } from "@/lib/translations";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return projectsMeta.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const safeLocale = locale as Locale;
  const t = translations[safeLocale];
  const index = projectsMeta.findIndex((p) => p.slug === slug);
  if (index === -1) return {};
  const meta = projectsMeta[index];
  const project = t.projects.find((p) => p.id === meta.id);
  if (!project) return {};
  return {
    title: `${project.name} · Bilak Michael Studio`,
    description: project.subtitle,
    openGraph: {
      title: project.name,
      description: project.subtitle,
      images: [meta.image],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const safeLocale = locale as Locale;
  const t = translations[safeLocale];

  const index = projectsMeta.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const meta = projectsMeta[index];
  const project = t.projects.find((p) => p.id === meta.id)!;
  const hasLiveSite = meta.url.startsWith("http");
  const otherProjects = projectsMeta
    .map((m) => ({ meta: m, copy: t.projects.find((p) => p.id === m.id)! }))
    .filter((p) => p.meta.slug !== slug)
    .slice(0, 3);

  return (
    <>
      <Navigation locale={safeLocale} t={t} />

      <main className="relative pt-32">
        <section className="relative overflow-hidden py-12 md:py-20">
          <div aria-hidden className="ambient-glow" />
          <div className="container-lux relative">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-textMuted transition-colors hover:text-accentGold"
            >
              <ArrowLeft size={14} />
              {t.workPage.backToWork}
            </Link>

            <div className="mt-10 grid gap-10 lg:grid-cols-[1.05fr,0.95fr] lg:items-start">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-accentGold">
                    {meta.tag}
                  </span>
                  {meta.isLive ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-300">
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]"
                      />
                      {t.workPage.liveStatus}
                    </span>
                  ) : null}
                  <span className="font-mono text-xs text-textMuted/70">{meta.index}</span>
                </div>

                <h1 className="font-display font-light text-textPrimary">
                  <span className="block text-fluid-hero">{project.name}</span>
                  {project.nameTagline ? (
                    <span className="mt-2 block text-xl font-light text-textSecondary md:text-2xl">
                      {project.nameTagline}
                    </span>
                  ) : null}
                </h1>
                <p className="max-w-xl text-lg text-textSecondary">{project.subtitle}</p>

                {hasLiveSite ? (
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <a
                      href={meta.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-outline group inline-flex items-center gap-2 rounded-full bg-accentGold px-6 py-3 text-sm font-semibold text-bgPrimary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-12px_rgba(201,169,110,0.55)]"
                    >
                      {t.workPage.visitLiveSite}
                      <ArrowUpRight
                        size={16}
                        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </a>
                    <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-borderSubtle bg-white/[0.03] px-5 py-2.5 font-mono text-xs text-textSecondary">
                      <ExternalLink size={12} className="shrink-0 text-accentGold" aria-hidden />
                      <span className="min-w-0 break-all">{meta.displayUrl}</span>
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="browser-mockup-shell glass-card-strong group relative overflow-hidden rounded-[1.75rem] p-2.5 md:p-3">
                <BrowserMockup
                  image={meta.image}
                  alt={`${project.name} — ${project.subtitle}`}
                  displayUrl={meta.displayUrl}
                  imagePosition={meta.imagePosition ?? "top"}
                  priority
                  sizes="(min-width: 1024px) 620px, 100vw"
                  href={hasLiveSite ? meta.url : undefined}
                  linkLabel={hasLiveSite ? `Open ${meta.displayUrl}` : undefined}
                  interactive
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container-lux">
            <header className="max-w-3xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accentGold">
                {t.workPage.overview}
              </p>
              <h2 className="mt-3 text-fluid-title font-display font-light">{project.name}</h2>
            </header>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <CaseStudyBlock
                index="01"
                label={t.caseStudies.fields.problem}
                value={project.problem}
              />
              <CaseStudyBlock
                index="02"
                label={t.caseStudies.fields.solution}
                value={project.solution}
              />
              <CaseStudyBlock
                index="03"
                label={t.caseStudies.fields.businessImpact}
                value={project.businessImpact}
              />
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container-lux">
            <header className="max-w-3xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accentGold">
                {t.workPage.techStack}
              </p>
            </header>
            <ul className="mt-6 flex flex-wrap gap-3">
              {meta.tech.map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center rounded-full border border-borderSubtle bg-white/[0.03] px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-textSecondary"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <AuditCta t={t} />

        {otherProjects.length > 0 ? (
          <section className="py-16 md:py-24">
            <div className="container-lux">
              <header className="max-w-3xl">
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accentGold">
                  {t.workPage.otherProjects}
                </p>
              </header>
              <div className="mt-8 grid gap-5 md:grid-cols-3">
                {otherProjects.map(({ meta: m, copy }) => {
                  const isExternalCard = m.url.startsWith("http");
                  const href = m.isLive ? `/work/${m.slug}` : m.url;
                  const CardContent = (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accentGold">
                          {m.tag}
                        </span>
                        <ArrowUpRight
                          size={14}
                          className="text-textMuted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accentGold"
                        />
                      </div>
                      <h3 className="text-2xl font-semibold tracking-tight text-textPrimary">
                        {copy.name}
                      </h3>
                      <p className="text-sm text-textSecondary">{copy.subtitle}</p>
                    </>
                  );

                  if (m.isLive) {
                    return (
                      <Link
                        key={m.id}
                        href={href}
                        className="glass-card hover-lift group flex flex-col gap-4 rounded-2xl p-6 hover:border-borderStrong"
                      >
                        {CardContent}
                      </Link>
                    );
                  }
                  return (
                    <a
                      key={m.id}
                      href={href}
                      {...(isExternalCard
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="glass-card hover-lift group flex flex-col gap-4 rounded-2xl p-6 hover:border-borderStrong"
                    >
                      {CardContent}
                    </a>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}
      </main>

      <Footer t={t} />
    </>
  );
}

interface CaseStudyBlockProps {
  index: string;
  label: string;
  value: string;
}

function CaseStudyBlock({ index, label, value }: CaseStudyBlockProps) {
  return (
    <article className="glass-card flex h-full flex-col gap-4 rounded-2xl p-6 transition-colors hover:border-borderStrong">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accentGold">
          {label}
        </span>
        <span className="font-mono text-xs text-textMuted/70">{index}</span>
      </div>
      <p className="text-base leading-relaxed text-textSecondary">{value}</p>
    </article>
  );
}
