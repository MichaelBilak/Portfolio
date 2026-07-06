import { AtSign, Globe, type LucideIcon } from "lucide-react";
import type { SVGProps } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { MailtoLink } from "@/components/mailto-link";
import { Link } from "@/i18n/navigation";
import { INSTAGRAM_URL, SITE_URL } from "@/lib/brand";
import { CONTACT_EMAIL, contactMailtoHref } from "@/lib/contact-email";
import { TranslationSet } from "@/lib/translations";
import { cn } from "@/lib/ui";

interface FooterProps {
  t: TranslationSet;
  className?: string;
}

function InstagramIcon({ size = 16, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Footer({ t, className }: FooterProps) {
  const year = new Date().getFullYear();

  const quickLinks: { href: string; label: string }[] = [
    { href: "/work", label: t.nav.work },
    { href: "/services", label: t.nav.services },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ];

  type SocialLink =
    | { href: string; label: string; Icon: LucideIcon; external: true }
    | { href: string; label: string; Icon: typeof InstagramIcon; external: true }
    | { href: string; label: string; Icon: typeof AtSign; mailto: true };

  const socials: SocialLink[] = [
    { href: SITE_URL, label: "Website", Icon: Globe, external: true },
    { href: INSTAGRAM_URL, label: "Instagram: @dormup.studio", Icon: InstagramIcon, external: true },
    { href: contactMailtoHref(), label: `Email: ${CONTACT_EMAIL}`, Icon: AtSign, mailto: true },
  ];

  return (
    <footer className={cn("relative overflow-hidden border-t border-borderStrong bg-bgSecondary pt-16 pb-fab-clearance lg:pb-0", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/3 h-72 w-72 rounded-full bg-gold-radial opacity-20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-1/4 h-72 w-72 rounded-full bg-gold-radial opacity-15 blur-3xl"
      />

      <div className="container-lux relative grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <BrandLogo priority wordmarkClassName="text-3xl" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-textSecondary">
            {t.footer.description}
          </p>
          <div className="mt-5 flex gap-3">
            {socials.map((item) => {
              const { href, label, Icon } = item;
              if ("mailto" in item) {
                return (
                  <MailtoLink
                    key={label}
                    href={href}
                    aria-label={label}
                    className="focus-outline interactive inline-flex h-11 w-11 items-center justify-center rounded-full border border-borderSubtle text-accentGold hover:-translate-y-0.5 hover:border-accentGold/50 hover:bg-accentGold/10"
                  >
                    <Icon size={16} />
                  </MailtoLink>
                );
              }
              return (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-outline interactive inline-flex h-11 w-11 items-center justify-center rounded-full border border-borderSubtle text-accentGold hover:-translate-y-0.5 hover:border-accentGold/50 hover:bg-accentGold/10"
                  aria-label={label}
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accentGold">
            {t.footer.links}
          </p>
          <div className="mt-4 space-y-1 text-sm text-textPrimary">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="interactive block w-fit min-h-11 py-2.5 hover:text-accentGold"
              >
                {link.label}
              </Link>
            ))}
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
          <MailtoLink className="interactive mt-4 block w-fit text-sm text-textPrimary hover:text-accentGold">
            {CONTACT_EMAIL}
          </MailtoLink>
        </div>
      </div>

      <div className="relative border-t border-borderCool">
        <div className="container-lux flex flex-col items-start justify-between gap-3 py-5 pb-safe text-sm text-textMuted md:flex-row md:items-center">
          <p className="max-w-full text-pretty text-xs leading-relaxed sm:text-sm">
            <span className="block sm:inline">{year} © DormUp Group</span>
            <span className="hidden sm:inline"> · </span>
            <span className="block sm:inline">{t.footer.location}</span>
            <span className="hidden sm:inline"> · </span>
            <span className="block sm:inline">{t.footer.built}</span>
          </p>
          <Link href="/privacy" className="hover:text-accentGold">
            {t.footer.privacy}
          </Link>
        </div>
      </div>
    </footer>
  );
}
