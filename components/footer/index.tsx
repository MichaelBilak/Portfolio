import { AtSign, Globe, MessageCircle } from "lucide-react";
import { TranslationSet } from "@/lib/translations";

interface FooterProps {
  t: TranslationSet;
}

export function Footer({ t }: FooterProps) {
  const quickLinks: { href: string; label: string }[] = [
    { href: "#work", label: t.nav.work },
    { href: "#services", label: t.nav.services },
    { href: "#process", label: t.nav.process },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-borderStrong bg-bgSecondary pt-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/3 h-72 w-72 rounded-full bg-cyan-glow opacity-40 blur-3xl"
      />
      <div className="container-lux relative grid gap-8 pb-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <p className="font-display text-3xl leading-none tracking-tight">
              Dorm<span className="text-accentGold">Up</span>
            </p>
            <span className="h-8 w-px bg-borderSubtle" aria-hidden />
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold leading-none tracking-[0.18em] text-textPrimary/90 uppercase">Group</span>
              <span className="text-[9px] font-medium leading-none tracking-[0.22em] text-accentGold/70 uppercase">Digital Agency</span>
            </div>
          </div>
          <p className="mt-3 max-w-sm text-sm text-textSecondary">{t.footer.description}</p>
          <div className="mt-4 flex gap-3">
            <a
              href="#"
              className="focus-outline inline-flex h-11 w-11 items-center justify-center rounded-full border border-borderSubtle text-accentGold"
              aria-label="Website"
            >
              <Globe size={16} />
            </a>
            <a
              href="mailto:dormup.it@gmail.com"
              className="focus-outline inline-flex h-11 w-11 items-center justify-center rounded-full border border-borderSubtle text-accentGold"
              aria-label="Email: dormup.it@gmail.com"
            >
              <AtSign size={16} />
            </a>
            <a
              href="https://wa.me/393333333333"
              className="focus-outline inline-flex h-11 w-11 items-center justify-center rounded-full border border-borderSubtle text-accentGold"
              aria-label="WhatsApp"
            >
              <MessageCircle size={16} />
            </a>
          </div>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accentGold">{t.footer.links}</p>
          <div className="mt-3 space-y-2 text-sm text-textPrimary">
            {quickLinks.map((link) => (
              <a key={link.href} href={link.href} className="block hover:text-accentGold">
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accentGold">{t.footer.location}</p>
          <p className="mt-3 flex items-center gap-2 text-sm text-textSecondary">
            <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
            {t.footer.status}
          </p>
        </div>
      </div>

      <div className="relative border-t border-borderCool">
        <div className="container-lux flex flex-col items-start justify-between gap-3 py-4 text-sm text-textMuted md:flex-row md:items-center">
          <p>
            2025 © DormUp Group · {t.footer.location} · {t.footer.built}
          </p>
          <a href="#" className="hover:text-accentGold">
            {t.footer.privacy}
          </a>
        </div>
      </div>
    </footer>
  );
}
