"use client";

import { ArrowLeft, Check, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import {
  buildOrderQuery,
  resolveOrderCart,
  resolveOrderCartItems,
} from "@/lib/resolve-order-cart";
import type { TranslationSet } from "@/lib/translations";
import { btn } from "@/lib/ui";

interface ServiceCartProps {
  t: TranslationSet;
}

function parseList(value: string | null): string[] {
  return value?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
}

export function ServiceCart({ t }: ServiceCartProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const serviceSlugs = useMemo(
    () => parseList(searchParams.get("services")),
    [searchParams],
  );
  const addonIds = useMemo(() => parseList(searchParams.get("addons")), [searchParams]);

  const items = useMemo(
    () => resolveOrderCartItems(t, serviceSlugs, addonIds),
    [t, serviceSlugs, addonIds],
  );

  const updateCart = useCallback(
    (nextServices: string[], nextAddons: string[]) => {
      const qs = buildOrderQuery(nextServices, nextAddons);
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const removeService = useCallback(
    (slug: string) => {
      updateCart(
        serviceSlugs.filter((s) => s !== slug),
        addonIds,
      );
    },
    [addonIds, serviceSlugs, updateCart],
  );

  const removeAddon = useCallback(
    (id: string) => {
      updateCart(
        serviceSlugs,
        addonIds.filter((a) => a !== id),
      );
    },
    [addonIds, serviceSlugs, updateCart],
  );

  if (items.services.length === 0 && items.addons.length === 0) {
    return null;
  }

  const c = t.contact.cart;
  const continueHref = `/order?${buildOrderQuery(serviceSlugs, addonIds)}`;

  return (
    <div className="mb-6 rounded-2xl border border-accentGold/20 bg-accentGold/[0.04] p-5 md:p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accentGold">
        {c.eyebrow}
      </p>
      <h3 className="mt-2 text-lg font-semibold tracking-tight text-textPrimary">{c.title}</h3>

      {items.services.length > 0 ? (
        <ul className="mt-4 space-y-1.5">
          {items.services.map((item) => (
            <li
              key={item.slug}
              className="group flex items-center gap-2 rounded-xl py-1.5 pr-1 transition-colors hover:bg-white/[0.03]"
            >
              <Check size={15} className="ml-0.5 shrink-0 text-accentGold" aria-hidden />
              <span className="min-w-0 flex-1 text-sm text-textPrimary">{item.title}</span>
              <button
                type="button"
                onClick={() => removeService(item.slug)}
                aria-label={`${c.removeItem}: ${item.title}`}
                className="focus-outline inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-textMuted transition-colors hover:bg-white/[0.06] hover:text-textPrimary"
              >
                <X size={14} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {items.addons.length > 0 ? (
        <div
          className={
            items.services.length > 0 ? "mt-5 border-t border-borderSubtle pt-4" : "mt-4"
          }
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-textMuted">
            {c.addonsLabel}
          </p>
          <ul className="mt-3 space-y-1.5">
            {items.addons.map((item) => (
              <li
                key={item.id}
                className="group flex items-center gap-2 rounded-xl py-1.5 pr-1 transition-colors hover:bg-white/[0.03]"
              >
                <span
                  className="ml-2 h-1 w-1 shrink-0 rounded-full bg-accentGold/70"
                  aria-hidden
                />
                <span className="min-w-0 flex-1 text-sm text-textSecondary">{item.label}</span>
                <button
                  type="button"
                  onClick={() => removeAddon(item.id)}
                  aria-label={`${c.removeItem}: ${item.label}`}
                  className="focus-outline inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-textMuted transition-colors hover:bg-white/[0.06] hover:text-textPrimary"
                >
                  <X size={14} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-5 border-t border-borderSubtle pt-4">
        <Link href={continueHref} className={btn("ghost", "sm", "w-full justify-center")}>
          <ArrowLeft size={14} aria-hidden />
          {c.continueSearch}
        </Link>
      </div>
    </div>
  );
}

/** Hook for form submit — resolves labels from current URL selection */
export function useOrderCartSelection(t: TranslationSet) {
  const searchParams = useSearchParams();
  return useMemo(() => {
    const serviceSlugs = parseList(searchParams.get("services"));
    const addonIds = parseList(searchParams.get("addons"));
    return resolveOrderCart(t, serviceSlugs, addonIds);
  }, [searchParams, t]);
}
