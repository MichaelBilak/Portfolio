"use client";

import { ArrowUpRight, Check } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { servicesMeta } from "@/data/services";
import { Link } from "@/i18n/navigation";
import { TranslationSet } from "@/lib/translations";
import { btn } from "@/lib/ui";

interface OrderServicesProps {
  t: TranslationSet;
}

export function OrderServices({ t }: OrderServicesProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const selectedSlugs = servicesMeta
    .filter((m) => selected.has(m.id))
    .map((m) => m.slug);

  const contactHref =
    selectedSlugs.length > 0
      ? `/contact?services=${selectedSlugs.join(",")}`
      : "/contact";

  return (
    <section className="py-12 md:py-20">
      <div className="container-lux">
        <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
          {servicesMeta.map((meta, index) => {
            const copy = t.services[index];
            const isSelected = selected.has(meta.id);
            const price = t.orderPage.prices[meta.id];

            return (
              <button
                key={meta.id}
                type="button"
                onClick={() => toggle(meta.id)}
                className={`focus-outline glass-card group relative flex flex-col overflow-hidden rounded-3xl p-6 text-left transition-colors duration-300 md:p-7 ${
                  isSelected
                    ? "border-accentGold/50 ring-1 ring-accentGold/30"
                    : "hover:border-borderStrong"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-borderSubtle bg-bgPrimary">
                    <Image
                      src={meta.image}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <span
                    className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      isSelected
                        ? "border-accentGold bg-accentGold text-bgPrimary"
                        : "border-borderStrong bg-white/[0.03] text-textMuted"
                    }`}
                    aria-hidden
                  >
                    {isSelected ? <Check size={16} /> : null}
                  </span>
                </div>

                <h2 className="mt-5 text-xl font-semibold tracking-tight text-textPrimary md:text-2xl">
                  {copy.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-textSecondary">{copy.description}</p>

                <p className="mt-5 font-display text-2xl font-medium text-accentGold">
                  {t.orderPage.fromLabel} {price}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <p className="max-w-xl text-sm text-textMuted">{t.orderPage.footnote}</p>
          <Link
            href={contactHref}
            className={btn("primary", "lg", "w-full md:w-auto")}
          >
            {t.orderPage.proceedCta}
            <ArrowUpRight size={18} />
          </Link>
        </div>

        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-textMuted">
          {t.orderPage.selectHint}
        </p>
      </div>
    </section>
  );
}
