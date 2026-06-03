import { Link } from "@/i18n/navigation";
import { TranslationSet } from "@/lib/translations";

interface AuditCtaProps {
  t: TranslationSet;
}

export function AuditCta({ t }: AuditCtaProps) {
  return (
    <section className="py-24 md:py-32">
      <div className="container-lux">
        <div className="relative overflow-hidden rounded-3xl border border-borderStrong bg-bgSecondary px-8 py-16 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-glow opacity-60 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 right-1/4 h-64 w-64 rounded-full bg-cyan-glow opacity-50 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-amber-gradient opacity-40"
          />

          <div className="relative">
            <h2 className="text-fluid-title font-display font-light text-textPrimary">
              {t.audit.title}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-textSecondary">
              {t.audit.body}
            </p>
            <Link
              href="/#contact"
              className="amber-pulse focus-outline interactive mt-10 inline-flex min-h-12 items-center justify-center rounded-full bg-accentGold px-8 py-3.5 text-base font-medium text-bgPrimary shadow-[0_24px_60px_-24px_rgba(252,211,77,0.65)] hover:shadow-[0_30px_70px_-22px_rgba(252,211,77,0.85)]"
            >
              {t.audit.cta}
            </Link>
            <p className="mt-5 font-mono text-xs uppercase tracking-[0.18em] text-textMuted">
              {t.audit.meta}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
