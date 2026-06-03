"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Link } from "@/i18n/navigation";
import { useScrollDirection } from "@/lib/hooks/use-scroll-direction";
import { Locale, TranslationSet } from "@/lib/translations";

interface NavigationProps {
  locale: Locale;
  t: TranslationSet;
}

export function Navigation({ locale, t }: NavigationProps) {
  const shouldReduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const direction = useScrollDirection();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const hidden = direction === "down" && scrolled && !open;

  const navLinks: { href: string; label: string }[] = [
    { href: "/work", label: t.nav.work },
    { href: "/#services", label: t.nav.services },
    { href: "/#process", label: t.nav.process },
    { href: "/#contact", label: t.nav.contact },
  ];

  return (
    <>
    <motion.header
      initial={false}
      animate={{ y: hidden ? -96 : 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <nav
        className={`interactive flex h-20 w-full items-center justify-between px-6 md:px-10 lg:px-14 ${
          scrolled
            ? "border-b border-borderCool bg-[rgba(7,9,15,0.78)] shadow-[0_18px_50px_-30px_rgba(0,0,0,0.7)] backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <Link
          href="/"
          className="interactive focus-outline flex items-center gap-3"
        >
          <BrandLogo
            imageSize={40}
            priority
            taglineClassName="hidden md:flex"
            separatorClassName="hidden h-7 w-px bg-borderSubtle md:block"
          />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="interactive text-sm text-textPrimary/90 hover:text-accentGold"
            >
              {link.label}
            </Link>
          ))}
          <span className="h-5 w-px bg-borderSubtle" aria-hidden />
          <LanguageSwitcher locale={locale} />
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <LanguageSwitcher locale={locale} />
          <button
            type="button"
            className="focus-outline inline-flex h-11 w-11 items-center justify-center rounded-full border border-borderSubtle text-accentGold"
            aria-label="Open menu"
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
            className="fixed inset-0 z-40 flex flex-col bg-bgPrimary/95 px-8 pt-28 md:hidden"
          >
            <div className="flex flex-col gap-7 text-3xl font-display">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: shouldReduceMotion ? 0 : index * 0.08,
                    duration: shouldReduceMotion ? 0 : 0.45,
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="interactive text-textPrimary hover:text-accentGold"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>

    {!open ? (
      <Link
        href="/#contact"
        className="interactive focus-outline fixed bottom-5 right-5 z-[35] inline-flex min-h-11 max-w-[min(100vw-2.5rem,20rem)] items-center justify-center rounded-full border border-accentGold bg-[rgba(15,23,42,0.92)] px-4 py-2.5 text-center text-xs font-medium text-accentGold shadow-[0_14px_44px_-18px_rgba(0,0,0,0.85)] backdrop-blur-md transition-colors hover:bg-accentGold hover:text-bgPrimary sm:text-sm md:bottom-8 md:right-8 md:px-5"
      >
        {t.nav.audit}
      </Link>
    ) : null}
    </>
  );
}
