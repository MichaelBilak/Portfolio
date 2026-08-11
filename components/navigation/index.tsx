"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ScrollProgress } from "@/components/ui";
import { Link, usePathname } from "@/i18n/navigation";
import { BRAND_FULL } from "@/lib/brand";
import { useIsDesktop } from "@/lib/hooks/use-is-desktop";
import { useLiteMode } from "@/lib/hooks/use-lite-mode";
import { useNavScroll } from "@/lib/hooks/use-nav-scroll";
import { usePastHero } from "@/lib/hooks/use-past-hero";
import { Locale, TranslationSet } from "@/lib/translations";
import { btn, cn } from "@/lib/ui";

interface NavigationProps {
  locale: Locale;
  t: TranslationSet;
}

function OrderCtaLink({
  t,
  fullWidth = false,
  className,
  onClick,
}: {
  t: TranslationSet;
  fullWidth?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href="/order"
      onClick={onClick}
      aria-label={t.hero.buyCta}
      className={btn(
        "primary",
        fullWidth ? "md" : "sm",
        fullWidth
          ? `amber-pulse w-full ${className ?? ""}`
          : cn("amber-pulse order-cta-lift", className),
      )}
    >
      <span className="relative z-10">{t.hero.buyCta}</span>
      <ArrowUpRight
        size={14}
        className="relative z-10 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </Link>
  );
}

export function Navigation({ locale, t }: NavigationProps) {
  const shouldReduceMotion = useReducedMotion();
  const liteMode = useLiteMode();
  const isDesktop = useIsDesktop();
  const [open, setOpen] = useState(false);
  const { direction, scrolled } = useNavScroll(24);
  const pathname = usePathname();
  const pastHero = usePastHero();
  const onOrderPage = pathname === "/order" || pathname.endsWith("/order");
  const onContactPage = pathname === "/contact" || pathname.endsWith("/contact");
  const navHidden = isDesktop && direction === "down" && scrolled && !open;
  const showOrderCta = !onOrderPage;
  const showMobileFab = showOrderCta && !open && !navHidden && pastHero && !onContactPage;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const navLinks: { href: string; label: string }[] = [
    { href: "/work", label: t.nav.work },
    { href: "/services", label: t.nav.services },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <>
      {!liteMode ? <ScrollProgress /> : null}
      <motion.header
        initial={false}
        animate={{ y: navHidden ? -120 : 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: [0.22, 0.61, 0.36, 1] }}
        className="safe-top fixed inset-x-0 top-0 z-50 px-3 md:px-5"
      >
        <nav
          className={`interactive mx-auto flex h-16 w-full max-w-[88rem] items-center justify-between rounded-2xl px-4 md:h-[4.25rem] md:px-6 ${
            scrolled
              ? "nav-scrolled-blur border border-borderCool bg-[rgba(6,8,12,0.72)] shadow-[0_24px_60px_-34px_rgba(0,0,0,0.85)] backdrop-blur-2xl"
              : "border border-transparent bg-transparent"
          }`}
        >
          <Link
            href="/"
            aria-label={BRAND_FULL}
            className="interactive focus-outline inline-flex min-w-0 max-w-[58vw] shrink items-center rounded-xl sm:max-w-none"
          >
            <BrandLogo
              priority
              showTagline
              wordmarkClassName="text-base sm:text-2xl"
              taglineClassName="hidden sm:inline"
            />
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="interactive focus-outline group relative rounded-full px-3.5 py-2 text-sm text-textPrimary/85 hover:text-accentGold"
              >
                {link.label}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-3.5 bottom-1 h-px origin-left scale-x-0 bg-accentGold/70 transition-transform duration-300 group-hover:scale-x-100"
                />
              </Link>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
            {showOrderCta && !open && !navHidden ? (
              <span className="hidden lg:inline-flex">
                <OrderCtaLink t={t} />
              </span>
            ) : null}
            <LanguageSwitcher locale={locale} />
            <button
              type="button"
              className="focus-outline inline-flex h-11 w-11 items-center justify-center rounded-full border border-borderSubtle text-accentGold lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((prev) => !prev)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="nav-mobile-menu fixed inset-0 z-[49] flex flex-col bg-bgPrimary/96 px-6 backdrop-blur-xl pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[calc(var(--header-height)+max(0.75rem,var(--safe-top))+1.75rem)] lg:hidden"
          >
            <div aria-hidden className="ambient-glow opacity-60" />
            <div
              aria-hidden
              className="relative mb-8 h-px w-full bg-gradient-to-r from-transparent via-borderStrong to-transparent"
            />
            <div className="relative flex flex-col gap-6 text-[clamp(1.65rem,6.5vw,2.35rem)] font-display font-light sm:gap-7">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: shouldReduceMotion ? 0 : 0.06 + index * 0.07,
                    duration: shouldReduceMotion ? 0 : 0.45,
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="interactive flex min-h-11 items-baseline gap-3 py-1 text-textPrimary hover:text-accentGold"
                  >
                    <span className="font-mono text-xs text-accentGold/60">
                      0{index + 1}
                    </span>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: shouldReduceMotion ? 0 : 0.4, duration: 0.45 }}
              className="relative mt-auto flex flex-col gap-3 pt-8"
            >
              <Link
                href="/contact?intent=audit"
                onClick={() => setOpen(false)}
                className={btn("primary", "md", "w-full justify-center")}
              >
                {t.audit.cta}
                <ArrowUpRight size={16} />
              </Link>
              <OrderCtaLink
                t={t}
                fullWidth
                onClick={() => setOpen(false)}
                className="justify-center"
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {showOrderCta && !open && navHidden ? (
        <motion.span
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-none fixed top-5 right-5 z-[48] hidden lg:inline-flex"
        >
          <OrderCtaLink t={t} className="pointer-events-auto" />
        </motion.span>
      ) : null}

      <AnimatePresence>
        {showMobileFab ? (
          <motion.div
            key="mobile-order-fab"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.92, y: 10 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.22 }}
            className="fixed bottom-[max(1rem,var(--safe-bottom))] right-4 z-40 lg:hidden"
          >
            <OrderCtaLink
              t={t}
              className="shadow-[0_16px_40px_-12px_rgba(252,211,77,0.55)]"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
