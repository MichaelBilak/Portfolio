"use client";

import { ArrowUpRight, Check } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { PricingAddons } from "@/components/pricing-addons";
import { servicesMeta } from "@/data/services";
import {
  SERVICE_BASE_PRICES,
  SERVICE_MONTHLY,
  type ServiceId,
} from "@/data/pricing";
import { PriceDisplay } from "@/components/price-display";
import { Link } from "@/i18n/navigation";
import { Locale, TranslationSet } from "@/lib/translations";
import { btn } from "@/lib/ui";

interface OrderServicesProps {
  t: TranslationSet;
  locale: Locale;
}

function parseList(value: string | null): string[] {
  return value?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
}

function slugsToServiceIds(slugs: string[]): Set<string> {
  const ids = new Set<string>();
  for (const slug of slugs) {
    const meta = servicesMeta.find((m) => m.slug === slug);
    if (meta) ids.add(meta.id);
  }
  return ids;
}

export function OrderServices({ t, locale }: OrderServicesProps) {
  const searchParams = useSearchParams();

  const [selected, setSelected] = useState<Set<string>>(() =>
    slugsToServiceIds(parseList(searchParams.get("services"))),
  );
  const [addons, setAddons] = useState<Set<string>>(
    () => new Set(parseList(searchParams.get("addons"))),
  );

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAddon(id: string) {
    setAddons((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const selectedSlugs = servicesMeta
    .filter((m) => selected.has(m.id))
    .map((m) => m.slug);

  const estimatedTotal = useMemo(() => {
    let total = 0;
    for (const id of Array.from(selected)) {
      total += SERVICE_BASE_PRICES[id as ServiceId] ?? 0;
    }
    return total;
  }, [selected]);

  const params = new URLSearchParams();
  if (selectedSlugs.length > 0) params.set("services", selectedSlugs.join(","));
  if (addons.size > 0) params.set("addons", Array.from(addons).join(","));
  const contactHref = params.size > 0 ? `/contact?${params.toString()}` : "/contact";

  const op = t.orderPage;
  const hasSelection = selected.size > 0;

  return (
    <>
      <section className="py-12 md:py-20">
        <div className="container-lux">
          <aside className="glass-card mb-8 rounded-2xl border border-borderSubtle p-5 md:p-6 lg:float-right lg:mb-0 lg:ml-8 lg:w-72 lg:sticky lg:top-[var(--header-offset)]">
            <ul className="space-y-3 text-sm text-textSecondary">
              <li>{op.trust.timeline}</li>
              <li>{op.trust.deposit}</li>
              <li>
                <Link href="/services/premium-website#process" className="text-accentGold hover:text-accentWarm">
                  {op.trust.processLink} →
                </Link>
              </li>
            </ul>
            <p className="mt-4 border-t border-borderCool pt-4 text-sm italic leading-relaxed text-textMuted">
              {op.trust.testimonial}
            </p>
          </aside>

          <div className="grid gap-5 md:grid-cols-2 lg:gap-6 lg:clear-none">
            {servicesMeta.map((meta, index) => {
              const copy = t.services[index];
              const isSelected = selected.has(meta.id);
              const base = SERVICE_BASE_PRICES[meta.id as ServiceId];
              const monthly = SERVICE_MONTHLY[meta.id as ServiceId];

              return (
                <div
                  key={meta.id}
                  className={`glass-card group relative flex flex-col overflow-hidden rounded-3xl transition-colors duration-300 ${
                    isSelected
                      ? "border-accentGold/50 ring-1 ring-accentGold/30"
                      : "hover:border-borderStrong"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggle(meta.id)}
                    className="focus-outline flex min-h-[3.25rem] flex-1 flex-col p-5 text-left sm:p-6 md:p-7 md:pb-5"
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
                        className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors ${
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
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-textSecondary">
                      {copy.description}
                    </p>
                  </button>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-borderSubtle px-6 py-4 md:px-7">
                    <PriceDisplay
                      amount={base}
                      locale={locale}
                      prefixLabel={op.fromLabel}
                      monthly={monthly}
                      size="md"
                    />
                    <Link
                      href={`/services/${meta.slug}`}
                      className={btn("ghost", "sm", "shrink-0")}
                    >
                      {op.aboutServiceCta}
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <section className="mt-12 border-t border-borderSubtle pt-8 md:mt-16">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-accentGold">
              {op.addonsSectionTitle}
            </h2>
            <div className="mt-4">
              <PricingAddons
                t={t.pricingAddons}
                selectable
                selected={addons}
                onToggle={toggleAddon}
                embedded
              />
            </div>
          </section>

          {estimatedTotal > 0 ? (
            <div className="mt-8 hidden flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-borderSubtle pt-6 md:flex">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-textMuted">
                {op.estimatedLabel}
              </span>
              <PriceDisplay
                amount={estimatedTotal}
                locale={locale}
                prefixLabel={op.fromLabel}
                size="md"
              />
            </div>
          ) : null}

          <div className="mt-10 hidden flex-col items-start gap-4 md:flex md:flex-row md:items-center md:justify-between">
            <p className="max-w-xl text-sm text-textMuted">{op.footnote}</p>
            <Link
              href={contactHref}
              className={btn("primary", "lg", "w-full md:w-auto")}
            >
              {op.proceedCta}
              <ArrowUpRight size={18} />
            </Link>
          </div>

          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-textMuted md:mt-4">
            {op.selectHint}
          </p>

          {/* Mobile bottom padding when sticky bar is visible */}
          {hasSelection ? <div className="h-24 md:hidden" aria-hidden /> : null}
        </div>
      </section>

      {hasSelection ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-borderStrong bg-[rgba(6,8,12,0.92)] backdrop-blur-xl md:hidden">
          <div className="container-lux flex items-center gap-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-textMuted">
                {op.estimatedLabel}
              </p>
              <PriceDisplay
                amount={estimatedTotal}
                locale={locale}
                prefixLabel={op.fromLabel}
                size="md"
              />
            </div>
            <Link href={contactHref} className={btn("primary", "md", "shrink-0")}>
              {op.proceedCta}
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
