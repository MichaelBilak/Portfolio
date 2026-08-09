"use client";

import { ADDON_CATEGORIES } from "@/data/pricing";
import type { TranslationSet } from "@/lib/translations";
import { Reveal } from "@/components/ui";

interface PricingAddonsProps {
  t: TranslationSet["pricingAddons"];
  selectable?: boolean;
  selected?: Set<string>;
  onToggle?: (id: string) => void;
  /** Skip outer section/container/header — for embedding inside order page */
  embedded?: boolean;
}

function AddonGrid({
  t,
  selectable,
  selected,
  onToggle,
}: Omit<PricingAddonsProps, "embedded">) {
  return (
    <>
      <div className="grid gap-12 md:grid-cols-2 md:gap-x-16">
        {ADDON_CATEGORIES.map((cat, catIndex) => {
          const localized = t.categories.find((c) => c.id === cat.id);
          if (!localized) return null;

          return (
            <Reveal key={cat.id} delay={catIndex * 0.06}>
              <span className="inline-block rounded-full border border-borderStrong px-5 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-textMuted">
                {localized.title}
              </span>

              <ul className="mt-6 space-y-0">
                {cat.items.map((item) => {
                  const copy = localized.items.find((i) => i.id === item.id);
                  if (!copy) return null;

                  const isSelected = selected?.has(item.id);

                  const inner = (
                    <div className="min-w-0 flex-1 pr-4">
                      <p className="text-base font-medium text-textPrimary">{copy.label}</p>
                      <p className="mt-1 text-sm leading-relaxed text-textMuted">{copy.info}</p>
                    </div>
                  );

                  if (selectable && onToggle) {
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => onToggle(item.id)}
                          className={`focus-outline flex min-h-11 w-full items-start border-b border-borderSubtle py-4 text-left transition-colors first:border-t hover:bg-white/[0.02] ${
                            isSelected ? "bg-white/[0.03]" : ""
                          }`}
                        >
                          {inner}
                        </button>
                      </li>
                    );
                  }

                  return (
                    <li
                      key={item.id}
                      className="flex items-start border-b border-borderSubtle py-4 first:border-t"
                    >
                      {inner}
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          );
        })}
      </div>

      <p className="mt-10 max-w-3xl text-sm leading-relaxed text-textMuted">{t.footnote}</p>
    </>
  );
}

export function PricingAddons({
  t,
  selectable = false,
  selected,
  onToggle,
  embedded = false,
}: PricingAddonsProps) {
  if (embedded) {
    return (
      <AddonGrid t={t} selectable={selectable} selected={selected} onToggle={onToggle} />
    );
  }

  return (
    <section className="border-t border-borderSubtle py-16 md:py-24">
      <div className="container-lux">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accentGold">
            {t.eyebrow}
          </p>
          <h2 className="mt-3 whitespace-nowrap text-fluid-title font-display font-light text-textPrimary">
            {t.title}
          </h2>
          <p className="mt-4 max-w-2xl text-base text-textSecondary">{t.subtitle}</p>
        </Reveal>

        <div className="mt-12">
          <AddonGrid t={t} selectable={selectable} selected={selected} onToggle={onToggle} />
        </div>
      </div>
    </section>
  );
}
