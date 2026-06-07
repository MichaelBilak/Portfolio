"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { ContactLink } from "@/components/contact-link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ScrollProgress } from "@/components/ui";
import { Link, usePathname } from "@/i18n/navigation";
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
  compact = false,
  fullWidth = false,
  className,
  onClick,
}: {
  t: TranslationSet;
  compact?: boolean;
  fullWidth?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <span
      className={cn(
        "order-cta-lift",
        fullWidth ? "flex w-full" : "inline-flex shrink-0",
      )}
    >
      <Link
        href="/order"
        onClick={onClick}
        aria-label={t.hero.buyCta}
        className={btn(
          "primary",
          fullWidth ? "md" : "sm",
          cn("order-cta-glow whitespace-nowrap", fullWidth && "w-full", className),
        )}
      >
        <span className="relative z-10">{compact ? t.hero.buyCta.split(" ")[0] : t.hero.buyCta}</span>
        <ArrowUpRight
          size={14}
          className="relative z-10 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </Link>
    </span>
  );
}

export function Navigation({ locale, t }: NavigationProps) {
  const shouldReduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const { direction, scrolled } = useNavScroll();
  const pastHero = usePastHero();
  const pathname = usePathname();
  const onOrderPage = pathname === "/order" || pathname.endsWith("/order");
  const navHidden = direction === "down" && scrolled && !open;
  const showOrderCta = !onOrderPage;
  const showMobileOrderCta = pastHero || pathname !== "/";

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
    { href: "/#contact", label: t.nav.contact },
  ];

  return (
    <>
      <ScrollProgress />
      <motion.header
        initial={false}
        animate={{ y: navHidden ? -120 : 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: [0.22, 0.61, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5 md:pt-4"
      >
        <nav
          className={`interactive mx-auto flex h-16 w-full max-w-[88rem] items-center justify-between rounded-2xl px-4 md:h-[4.25rem] md:px-6 ${
            scrolled
              ? "border border-borderCool bg-[rgba(6,8,12,0.72)] shadow-[0_24px_60px_-34px_rgba(0,0,0,0.85)] backdrop-blur-2xl"
              : "border border-transparent bg-transparent"
          }`}
        >
          <Link
            href="/"
            aria-label="DormUp Group"
            className="interactive focus-outline inline-flex min-w-0 max-w-[58vw] shrink items-center rounded-xl sm:max-w-none"
          >
            <BrandLogo priority showTagline={false} wordmarkClassName="text-lg sm:text-2xl" />
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) =>
              link.href === "/#contact" ? (
                <Link
                  key={link.href}
                  href="/#contact"
                  className="interactive focus-outline group relative rounded-full px-3.5 py-2 text-sm text-textPrimary/85 hover:text-accentGold"
                >
                  {link.label}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-3.5 bottom-1 h-px origin-left scale-x-0 bg-accentGold/70 transition-transform duration-300 group-hover:scale-x-100"
                  />
                </Link>
              ) : (
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
              ),
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
            {showOrderCta && !open && !navHidden ? (
              <span className="hidden lg:inline-flex">
                <OrderCtaLink t={t} />
              </span>
            ) : null}
            <span className="hidden md:block">
              <LanguageSwitcher locale={locale} />
            </span>
            <span className="md:hidden">
              <LanguageSwitcher locale={locale} />
            </span>
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
            className="fixed inset-0 z-[45] flex flex-col bg-bgPrimary/96 px-7 pt-28 backdrop-blur-xl lg:hidden"
          >
            <div aria-hidden className="ambient-glow opacity-60" />
            <div className="relative flex flex-col gap-6 text-4xl font-display font-light">
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
                  {link.href === "/#contact" ? (
                    <ContactLink
                      onClick={() => setOpen(false)}
                      desktopClassName="hidden md:inline lg:hidden"
                      className="interactive flex items-baseline gap-3 text-textPrimary hover:text-accentGold"
                    >
                      <span className="font-mono text-xs text-accentGold/60">
                        0{index + 1}
                      </span>
                      {link.label}
                    </ContactLink>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="interactive flex items-baseline gap-3 text-textPrimary hover:text-accentGold"
                    >
                      <span className="font-mono text-xs text-accentGold/60">
                        0{index + 1}
                      </span>
                      {link.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: shouldReduceMotion ? 0 : 0.4, duration: 0.45 }}
              className="relative mt-auto pb-10"
            >
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

      {showOrderCta && !open && showMobileOrderCta ? (
        <motion.span
          initial={false}
          animate={{
            opacity: pastHero ? 1 : 0,
            y: pastHero ? 0 : 16,
          }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.35,
            ease: [0.22, 0.61, 0.36, 1],
          }}
          className={cn(
            "pointer-events-none fixed right-4 z-[48] inline-flex lg:hidden",
            "bottom-[max(1.25rem,env(safe-area-inset-bottom))]",
            pastHero ? "pointer-events-auto" : "pointer-events-none",
          )}
        >
          <OrderCtaLink t={t} compact className="pointer-events-auto shadow-[0_18px_42px_-14px_rgba(0,0,0,0.65)]" />
        </motion.span>
      ) : null}
    </>
  );
}
