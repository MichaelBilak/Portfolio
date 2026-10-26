"use client";

import { Suspense } from "react";
import { Eyebrow, Reveal } from "@/components/ui";
import { FitHeading } from "@/components/ui/fit-heading";
import { TranslationSet } from "@/lib/translations";
import { ContactForm } from "./contact-form";
import { ContactErrorBoundary } from "./contact-error-boundary";

interface ContactCompactProps {
  t: TranslationSet;
}

/** Mobile homepage inline form after AuditCta — same fields as /contact. */
export function ContactCompact({ t }: ContactCompactProps) {
  return (
    <section id="contact-compact" className="border-t border-borderSubtle py-14 md:hidden">
      <div className="container-lux">
        <Reveal>
          <Eyebrow>{t.audit.meta}</Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <FitHeading as="h2" text={t.contact.compactTitle} max="1.75rem" min="1rem" className="mt-4" />
        </Reveal>
        <ContactErrorBoundary>
          <Suspense fallback={null}>
            <div className="mt-6">
              <ContactForm t={t} variant="compact" auditMode />
            </div>
          </Suspense>
        </ContactErrorBoundary>
      </div>
    </section>
  );
}
