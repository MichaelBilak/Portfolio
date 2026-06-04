import { TranslationSet } from "@/lib/translations";

interface AboutProps {
  t: TranslationSet;
}

export function About({ t }: AboutProps) {
  return (
    <section className="py-16 md:py-32">
      <div className="container-lux">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accentGold">{t.about.eyebrow}</p>
          <h2 className="mt-3 text-fluid-title font-display font-light">{t.about.title}</h2>
          <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-textSecondary">
            {t.about.bio}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {t.about.pills.map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-borderSubtle bg-bgSecondary px-4 py-2 text-sm text-textPrimary"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
