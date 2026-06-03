import { BadgeCheck, Building2, Smartphone, Ticket } from "lucide-react";
import { TranslationSet } from "@/lib/translations";

const icons = [BadgeCheck, Building2, Ticket, Smartphone];

interface TrustStripProps {
  t: TranslationSet;
}

export function TrustStrip({ t }: TrustStripProps) {
  return (
    <section className="relative border-y border-borderCool bg-bgSecondary/60 py-10 backdrop-blur-sm">
      <div className="container-lux grid gap-8 md:grid-cols-4">
        {t.trust.map((item, index) => {
          const Icon = icons[index];
          return (
            <div
              key={item}
              className="relative flex items-center gap-3 md:flex-col md:items-start"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-borderSubtle bg-white/[0.03]">
                <Icon size={16} className="text-accentGold" />
              </span>
              <p className="text-sm leading-snug text-textPrimary">{item}</p>
              {index < t.trust.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute right-0 top-1/2 hidden h-10 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-borderStrong to-transparent md:block"
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
