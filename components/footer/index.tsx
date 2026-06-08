import { AtSign, Globe } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { MailtoLink } from "@/components/mailto-link";
import { Link } from "@/i18n/navigation";
import { CONTACT_EMAIL, contactMailtoHref } from "@/lib/contact-email";
import { TranslationSet } from "@/lib/translations";
import { cn } from "@/lib/ui";

interface FooterProps {
  t: TranslationSet;
  className?: string;
}

export function Footer({ t, className }: FooterProps) {
  const quickLinks: { href: string; label: string }[] = [
    { href: "/work", label: t.nav.work },
    { href: "/services", label: t.nav.services },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ];

  const socials = [
    { href: "#", label: "Website", Icon: Globe, mailto: false },
    { href: contactMailtoHref(), label: `Email: ${CONTACT_EMAIL}`, Icon: AtSign, mailto: true },
  ] as const;

  return (
    <footer className={cn("relative overflow-hidden border-t border-borderStrong bg-bgSecondary pt-16 pb-fab-clearance lg:pb-0", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/3 h-72 w-72 rounded-full bg-emerald-glow opacity-30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-1/4 h-72 w-72 rounded-full bg-gold-radial opacity-20 blur-3xl"
      />

      <div className="container-lux relative grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
            <BrandLogo priority wordmarkClassName="text-3xl" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-textSecondary">
            {t.footer.description}
          </p>
          <div className="mt-5 flex gap-3">
            {socials.map(({ href, label, Icon, mailto }) =>
              mailto ? (
                <MailtoLink
                  key={label}
                  href={href}
                  aria-label={label}
                  className="focus-outline interactive inline-flex h-11 w-11 items-center justify-center rounded-full border border-borderSubtle text-accentGold hover:-translate-y-0.5 hover:border-accentGold/50 hover:bg-accentGold/10"
                >
                  <Icon size={16} />
                </MailtoLink>
              ) : (
                <a
                  key={label}
                  href={href}
                  className="focus-outline interactive inline-flex h-11 w-11 items-center justify-center rounded-full border border-borderSubtle text-accentGold hover:-translate-y-0.5 hover:border-accentGold/50 hover:bg-accentGold/10"
                  aria-label={label}
                >
                  <Icon size={16} />
                </a>
              ),
            )}
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
          <p className="max-w-full text-pretty">2025 © DormUp Group · {t.footer.location} · {t.footer.built}</p>
          <a href="#" className="hover:text-accentGold">
            {t.footer.privacy}
          </a>
        </div>
      </div>
    </footer>
  );
}
