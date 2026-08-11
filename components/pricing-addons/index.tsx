"use client";

import { Check } from "lucide-react";
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
  categories?: typeof ADDON_CATEGORIES;
}

function AddonGrid({
  t,
  selectable,
  selected,
  onToggle,
  categories = ADDON_CATEGORIES,
}: Omit<PricingAddonsProps, "embedded">) {
  return (
    <>
      <div className="grid gap-12 md:grid-cols-2 md:gap-x-16">
        {categories.map((cat, catIndex) => {
          const localized = t.categories.find((c) => c.id === cat.id);
          if (!localized) return null;

          return (
            <Reveal key={cat.id} delay={catIndex * 0.06}>
              <span className="inline-block rounded-full border border-borderStrong px-5 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-textMuted">
                {localized.title}
              </span>

              <ul className="mt-6 space-y-2">
                {cat.items.map((item) => {
                  const copy = localized.items.find((i) => i.id === item.id);
                  if (!copy) return null;

                  const isSelected = selected?.has(item.id);

                  if (selectable && onToggle) {
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => onToggle(item.id)}
                          aria-pressed={isSelected}
                          className={`focus-outline flex min-h-11 w-full items-start gap-3 rounded-2xl border px-3.5 py-3.5 text-left transition-all duration-200 ${
                            isSelected
                              ? "border-accentGold/55 bg-accentGold/[0.1] shadow-[inset_3px_0_0_0_rgba(252,211,77,0.9)] ring-1 ring-accentGold/25"
                              : "border-transparent hover:border-borderSubtle hover:bg-white/[0.03]"
                          }`}
                        >
                          <div className="min-w-0 flex-1 pr-1">
                            <p
                              className={`text-base font-medium transition-colors ${
                                isSelected ? "text-accentGold" : "text-textPrimary"
                              }`}
                            >
                              {copy.label}
                            </p>
                            <p
                              className={`mt-1 text-sm leading-relaxed transition-colors ${
                                isSelected ? "text-textSecondary" : "text-textMuted"
                              }`}
                            >
                              {copy.info}
                            </p>
                          </div>
                          <span
                            aria-hidden
                            className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors ${
                              isSelected
                                ? "border-accentGold bg-accentGold text-bgPrimary shadow-[0_0_20px_-4px_rgba(252,211,77,0.65)]"
                                : "border-borderStrong bg-white/[0.03] text-transparent"
                            }`}
                          >
                            <Check size={14} strokeWidth={2.5} />
                          </span>
                        </button>
                      </li>
                    );
                  }

                  return (
                    <li
                      key={item.id}
                      className="flex items-start border-b border-borderSubtle py-4 first:border-t"
                    >
                      <div className="min-w-0 flex-1 pr-4">
                        <p className="text-base font-medium text-textPrimary">{copy.label}</p>
                        <p className="mt-1 text-sm leading-relaxed text-textMuted">{copy.info}</p>
                      </div>
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
  categories,
}: PricingAddonsProps) {
  if (embedded) {
    return (
      <AddonGrid
        t={t}
        selectable={selectable}
        selected={selected}
        onToggle={onToggle}
        categories={categories}
      />
    );
  }

  return (
    <section className="border-t border-borderSubtle py-16 md:py-24">
      <div className="container-lux">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accentGold">
            {t.eyebrow}
          </p>
          <h2 className="mt-3 text-fluid-title font-display font-light text-textPrimary text-safe-wrap">
            {t.title}
          </h2>
          <p className="mt-4 max-w-2xl text-base text-textSecondary">{t.subtitle}</p>
        </Reveal>

        <div className="mt-12">
          <AddonGrid
            t={t}
            selectable={selectable}
            selected={selected}
            onToggle={onToggle}
            categories={categories}
          />
        </div>
      </div>
    </section>
  );
}
