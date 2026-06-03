import { TranslationSet } from "@/lib/translations";

interface BusinessImpactProps {
  t: TranslationSet;
}

export function BusinessImpact({ t }: BusinessImpactProps) {
  return (
    <section className="relative overflow-hidden bg-bgSecondary py-24 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-glow opacity-50 blur-3xl"
      />
      <div className="container-lux relative">
        <h2 className="text-fluid-title mb-12 font-display font-light">{t.impact.label}</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {t.impact.items.map((item) => (
            <article
              key={item.title}
              className="glass-card hover-lift rounded-3xl p-7"
            >
              <h3 className="font-display text-3xl font-light leading-snug text-textPrimary">
                {item.title}
              </h3>
              <p className="mt-4 text-textSecondary">{item.body}</p>
              <p className="mt-6 border-t border-borderCool pt-4 text-xs text-textMuted">
                {item.note}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
