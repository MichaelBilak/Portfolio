import { MapPin } from "lucide-react";
import { Eyebrow, Reveal } from "@/components/ui";
import { TranslationSet } from "@/lib/translations";

interface AboutProps {
  t: TranslationSet;
}

const LOCALITY: Record<
  string,
  { title: string; rows: { k: string; v: string }[] }
> = {
  IT: {
    title: "Rimini, Italia",
    rows: [
      { k: "Base", v: "Rimini · Emilia-Romagna" },
      { k: "Area servita", v: "Italia · Hospitality e brand locali" },
      { k: "Lingue", v: "IT · EN · FR · RU · DE" },
    ],
  },
  EN: {
    title: "Rimini, Italy",
    rows: [
      { k: "Base", v: "Rimini · Emilia-Romagna" },
      { k: "Area served", v: "Italy · Hospitality & local brands" },
      { k: "Languages", v: "IT · EN · FR · RU · DE" },
    ],
  },
  FR: {
    title: "Rimini, Italie",
    rows: [
      { k: "Base", v: "Rimini · Émilie-Romagne" },
      { k: "Zone couverte", v: "Italie · Hospitalité & marques locales" },
      { k: "Langues", v: "IT · EN · FR · RU · DE" },
    ],
  },
  RU: {
    title: "Римини, Италия",
    rows: [
      { k: "База", v: "Римини · Эмилия-Романья" },
      { k: "Зона работы", v: "Италия · Hospitality и локальные бренды" },
      { k: "Языки", v: "IT · EN · FR · RU · DE" },
    ],
  },
  DE: {
    title: "Rimini, Italien",
    rows: [
      { k: "Standort", v: "Rimini · Emilia-Romagna" },
      { k: "Tätigkeitsgebiet", v: "Italien · Hospitality & lokale Marken" },
      { k: "Sprachen", v: "IT · EN · FR · RU · DE" },
    ],
  },
};

export function About({ t }: AboutProps) {
  const locality = LOCALITY[t.langCode] ?? LOCALITY.EN;
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="container-lux">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow>{t.about.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 whitespace-nowrap font-display font-light text-textPrimary [font-size:clamp(1.2rem,6vw,2rem)] md:whitespace-normal md:text-fluid-title">
                {t.about.title}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-textSecondary text-pretty">
                {t.about.bio}
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-wrap gap-3">
                {t.about.pills.map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-borderSubtle bg-white/[0.03] px-4 py-2 text-sm text-textPrimary"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Locality / ecosystem — starts in Rimini, scales across Italy */}
          <Reveal delay={0.1}>
            <div className="spotlight-card group relative overflow-hidden rounded-3xl border border-borderSubtle bg-bgCard p-7 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.65)] transition-all duration-300 hover:-translate-y-1 hover:border-borderStrong md:p-9">
              <span
                aria-hidden
                className="pointer-events-none absolute -right-10 top-10 h-44 w-44 rounded-full bg-gold-radial opacity-20 blur-3xl"
              />

              <div className="relative z-10 flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-accentGold/40 bg-accentGold/10 text-accentGold">
                  <MapPin size={18} />
                </span>
                <div>
                  <p className="text-2xl font-semibold leading-none tracking-tight text-textPrimary">
                    {locality.title}
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.24em] text-textMuted">
                    44.06° N · 12.57° E
                  </p>
                </div>
              </div>

              <ul className="relative z-10 mt-8 space-y-4">
                {locality.rows.map((row, index) => (
                  <li
                    key={row.k}
                    className="flex items-center justify-between gap-4 border-t border-borderCool pt-4 first:border-t-0 first:pt-0"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-textMuted">
                      {String(index + 1).padStart(2, "0")} · {row.k}
                    </span>
                    <span className="text-right text-sm text-textPrimary">{row.v}</span>
                  </li>
                ))}
              </ul>

              <div className="relative z-10 mt-8 flex items-center gap-2 text-sm text-textSecondary">
                <span className="relative inline-flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/80 opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                {t.about.pills[t.about.pills.length - 1]}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
