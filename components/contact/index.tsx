"use client";

import { Mail } from "lucide-react";
import { Suspense } from "react";
import { MailtoLink } from "@/components/mailto-link";
import { Eyebrow, Reveal, useSpotlight } from "@/components/ui";
import { CONTACT_EMAIL } from "@/lib/contact-email";
import { TranslationSet } from "@/lib/translations";
import { ContactErrorBoundary } from "./contact-error-boundary";
import { ContactForm } from "./contact-form";

interface ContactProps {
  t: TranslationSet;
}

export function Contact({ t }: ContactProps) {
  const onMove = useSpotlight();
  return (
    <section id="contact" className="relative overflow-hidden py-14 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-gold-radial opacity-15 blur-3xl"
      />
      <div className="container-lux relative grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1">
          <Reveal>
            <Eyebrow>{t.contact.label}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-fluid-title font-display font-light text-textPrimary text-safe-wrap">
              {t.contact.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-lg text-textSecondary text-pretty">{t.contact.body}</p>
          </Reveal>

          <div className="mt-9 space-y-3">
            <MailtoLink
              onMouseMove={onMove}
              className="glass-card spotlight-card interactive focus-outline group flex items-center gap-4 rounded-2xl px-5 py-4 hover:-translate-y-0.5 hover:border-borderStrong md:hidden"
            >
              <EmailCardContent emailLabel={t.contact.emailLabel} />
            </MailtoLink>
            <div
              onMouseMove={onMove}
              className="glass-card spotlight-card hidden items-center gap-4 rounded-2xl px-5 py-4 md:flex"
            >
              <EmailCardContent emailLabel={t.contact.emailLabel} copyable />
            </div>
          </div>
        </div>

        <ContactErrorBoundary>
          <Suspense fallback={null}>
            <div className="order-1 lg:order-2">
              <ContactForm t={t} variant="full" />
            </div>
          </Suspense>
        </ContactErrorBoundary>
      </div>
    </section>
  );
}

function EmailCardContent({
  emailLabel,
  copyable = false,
}: {
  emailLabel: string;
  copyable?: boolean;
}) {
  return (
    <>
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-400/10 text-emerald-400">
        <Mail size={16} aria-hidden />
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-textMuted">
          {emailLabel}
        </span>
        <span
          className={`block text-sm text-textPrimary ${copyable ? "cursor-text select-all" : ""}`}
        >
          {CONTACT_EMAIL}
        </span>
      </span>
    </>
  );
}
