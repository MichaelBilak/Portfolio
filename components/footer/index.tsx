import { ArrowUpRight, AtSign, Globe } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { ContactLink } from "@/components/contact-link";
import { Link } from "@/i18n/navigation";
import { TranslationSet } from "@/lib/translations";

interface FooterProps {
  t: TranslationSet;
}

export function Footer({ t }: FooterProps) {
  const quickLinks: { href: string; label: string }[] = [
    { href: "/work", label: t.nav.work },
    { href: "/#services", label: t.nav.services },
    { href: "/#process", label: t.nav.process },
    { href: "/#contact", label: t.nav.contact },
  ];

  const socials = [
    { href: "#", label: "Website", Icon: Globe },
    { href: "mailto:dormup.it@gmail.com", label: "Email: dormup.it@gmail.com", Icon: AtSign },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-borderStrong bg-bgSecondary pt-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/3 h-72 w-72 rounded-full bg-emerald-glow opacity-30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-1/4 h-72 w-72 rounded-full bg-gold-radial opacity-20 blur-3xl"
      />

      {/* Big closing CTA line */}
      <div className="container-lux relative">
        <div className="flex flex-col items-start justify-between gap-6 border-b border-borderCool pb-12 md:flex-row md:items-end">
          <p className="max-w-xl text-fluid-title font-display font-light leading-[1.05] text-textPrimary">
            {t.contact.title}
          </p>
          <ContactLink
            desktopClassName="hidden md:inline-flex"
            className="group inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.24em] text-accentGold transition-colors hover:text-accentWarm"
          >
            {t.nav.audit}
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-borderStrong transition-colors group-hover:border-accentGold group-hover:bg-accentGold/10">
              <ArrowUpRight
                size={18}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </span>
          </ContactLink>
        </div>
      </div>

      <div className="container-lux relative grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
            <BrandLogo
              priority
              wordmarkClassName="text-3xl"
              separatorClassName="h-[0.68em] w-px bg-borderSubtle"
              agencyClassName="text-[9px] font-medium leading-none tracking-[0.22em] text-accentGold/70 uppercase"
            />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-textSecondary">
            {t.footer.description}
          </p>
          <div className="mt-5 flex gap-3">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                className="focus-outline interactive inline-flex h-11 w-11 items-center justify-center rounded-full border border-borderSubtle text-accentGold hover:-translate-y-0.5 hover:border-accentGold/50 hover:bg-accentGold/10"
                aria-label={label}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accentGold">
            {t.footer.links}
          </p>
          <div className="mt-4 space-y-1 text-sm text-textPrimary">
            {quickLinks.map((link) =>
              link.href === "/#contact" ? (
                <ContactLink
                  key={link.href}
                  desktopClassName="hidden md:block"
                  className="interactive block w-fit py-1.5 hover:text-accentGold"
                >
                  {link.label}
                </ContactLink>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="interactive block w-fit py-1.5 hover:text-accentGold"
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accentGold">
            {t.footer.location}
          </p>
          <p className="mt-4 flex items-center gap-2 text-sm text-textSecondary">
            <span className="relative inline-flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/80 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            {t.footer.status}
          </p>
          <a
            href="mailto:dormup.it@gmail.com"
            className="interactive mt-4 block w-fit text-sm text-textPrimary hover:text-accentGold"
          >
            dormup.it@gmail.com
          </a>
        </div>
      </div>

      <div className="relative border-t border-borderCool">
        <div className="container-lux flex flex-col items-start justify-between gap-3 py-5 text-sm text-textMuted md:flex-row md:items-center">
          <p>2025 © DormUp Group · {t.footer.location} · {t.footer.built}</p>
          <a href="#" className="hover:text-accentGold">
            {t.footer.privacy}
          </a>
        </div>
      </div>
    </footer>
  );
}
