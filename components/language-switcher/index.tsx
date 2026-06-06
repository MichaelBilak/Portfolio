"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Globe } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { localeMeta, localeOrder } from "@/lib/locale-meta";
import { Locale } from "@/lib/translations";

interface LanguageSwitcherProps {
  locale: Locale;
  variant?: "compact" | "full";
}

const SCROLL_PRESERVE_KEY = "intl-locale-switch-scroll-y";

export function LanguageSwitcher({ locale, variant = "compact" }: LanguageSwitcherProps) {
  const shouldReduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = sessionStorage.getItem(SCROLL_PRESERVE_KEY);
    if (raw === null) return;
    sessionStorage.removeItem(SCROLL_PRESERVE_KEY);
    const y = Number.parseFloat(raw);
    if (!Number.isFinite(y)) return;
    const restore = () => window.scrollTo(0, y);
    restore();
    requestAnimationFrame(restore);
    requestAnimationFrame(() => requestAnimationFrame(restore));
  }, [locale]);

  const current = localeMeta[locale];

  const switchTo = (next: Locale) => {
    setOpen(false);
    if (next === locale) {
      return;
    }

    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    const suffix =
      typeof window !== "undefined"
        ? `${window.location.search}${window.location.hash}`
        : "";
    const href = `${pathname}${suffix}`;

    if (typeof window !== "undefined") {
      sessionStorage.setItem(SCROLL_PRESERVE_KEY, String(scrollY));
    }

    startTransition(() => {
      router.replace(href, { locale: next, scroll: false });
    });
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={current.selectorLabel}
        className="focus-outline interactive group inline-flex min-h-11 items-center gap-2 rounded-full border border-borderSubtle bg-bgSecondary/60 px-3.5 py-2 text-xs font-medium uppercase tracking-[0.18em] text-textPrimary backdrop-blur hover:border-borderStrong md:min-h-0"
      >
        <Globe size={14} className="text-accentGold" />
        <span className="text-accentGold">{current.langCode}</span>
        <svg
          aria-hidden
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          className={`text-textSecondary transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M1 3.5L5 7.5L9 3.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.18, ease: "easeOut" }}
            className={`absolute z-50 mt-3 ${
              variant === "full" ? "left-0 w-56" : "right-0 w-44"
            } overflow-hidden rounded-2xl border border-borderStrong bg-bgElevated/95 p-1.5 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)] backdrop-blur-xl`}
          >
            {localeOrder.map((code) => {
              const item = localeMeta[code];
              const active = code === locale;
              return (
                <li key={code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => switchTo(code)}
                    className={`interactive flex min-h-11 w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm ${
                      active
                        ? "bg-[rgba(201,169,110,0.1)] text-accentGold"
                        : "text-textPrimary hover:bg-[rgba(255,255,255,0.04)] hover:text-accentGold"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`inline-flex h-6 w-9 items-center justify-center rounded-md border font-mono text-[10px] tracking-[0.18em] ${
                          active
                            ? "border-accentGold/60 bg-accentGold/15 text-accentGold"
                            : "border-borderSubtle text-textSecondary"
                        }`}
                      >
                        {item.langCode}
                      </span>
                      <span>{item.langName}</span>
                    </span>
                    {active ? <Check size={14} className="text-accentGold" /> : null}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
