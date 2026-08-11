"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "next/navigation";
import { ServiceCart, useOrderCartSelection } from "@/components/service-cart";
import { CONTACT_EMAIL } from "@/lib/contact-email";
import { TranslationSet } from "@/lib/translations";

type BusinessType = "restaurant" | "hotel" | "bar" | "other";
type SourceType = "google" | "referral" | "social" | "other";

interface FormState {
  fullName: string;
  email: string;
  businessName: string;
  businessType: BusinessType;
  siteUrl: string;
  brief: string;
  source: SourceType;
}

export interface ContactFormProps {
  t: TranslationSet;
  /** Visual density only — field set is always the same. */
  variant?: "full" | "compact";
  /** Audit submit label + intent. Overrides ?intent=audit when true. */
  auditMode?: boolean;
}

const emptyErrors = (): Record<keyof FormState, string> => ({
  fullName: "",
  email: "",
  businessName: "",
  businessType: "",
  siteUrl: "",
  brief: "",
  source: "",
});

export function ContactForm({ t, variant = "full", auditMode: auditModeProp }: ContactFormProps) {
  const searchParams = useSearchParams();
  const auditMode = auditModeProp ?? searchParams.get("intent") === "audit";
  const compact = variant === "compact";
  const cart = useOrderCartSelection(t);

  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    businessName: "",
    businessType: "restaurant",
    siteUrl: "",
    brief: "",
    source: "google",
  });
  const [errors, setErrors] = useState<Record<keyof FormState, string>>(emptyErrors);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [portalReady, setPortalReady] = useState(false);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!sent) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSent(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [sent]);

  const validate = (state: FormState) => {
    const requiredError = t.contact.form.errors.required;
    const invalidEmailError = t.contact.form.errors.invalidEmail;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const urlRegex = /^https?:\/\/.+\..+/i;

    const next: Record<keyof FormState, string> = {
      fullName: "",
      email: !state.email.trim()
        ? requiredError
        : !emailRegex.test(state.email.trim())
          ? invalidEmailError
          : "",
      businessName: state.businessName.trim() ? "" : requiredError,
      businessType: state.businessType ? "" : requiredError,
      siteUrl:
        state.siteUrl.trim() &&
        !urlRegex.test(state.siteUrl.trim()) &&
        !state.siteUrl.includes(".")
          ? t.contact.form.errors.invalidUrl
          : "",
      brief: "",
      source: state.source ? "" : requiredError,
    };
    setErrors(next);
    return Object.values(next).every((e) => e === "");
  };

  const onChange =
    (key: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = event.target.value;
      setForm((prev) => ({ ...prev, [key]: value }));
      if (errors[key]) {
        setErrors((prev) => ({ ...prev, [key]: "" }));
      }
      if (submitError) setSubmitError(false);
    };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate(form)) return;

    setLoading(true);
    setSubmitError(false);

    let response: Response;
    try {
      const serviceSlugs =
        searchParams.get("services")?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
      response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          website: "", // honeypot
          intent: auditMode ? "audit" : undefined,
          siteUrl: form.siteUrl,
          locale: t.langCode.toLowerCase(),
          selectedServices: cart.services,
          selectedServiceSlugs: serviceSlugs,
          selectedAddons: cart.addons,
        }),
      });
    } catch {
      setLoading(false);
      setSubmitError(true);
      return;
    }
    setLoading(false);

    if (response.ok) {
      const { trackEvent } = await import("@/components/analytics");
      trackEvent("contact_submit", {
        intent: auditMode ? "audit" : "contact",
        locale: t.langCode.toLowerCase(),
      });
      setSent(true);
      setForm({
        fullName: "",
        email: "",
        businessName: "",
        businessType: "restaurant",
        siteUrl: "",
        brief: "",
        source: "google",
      });
    } else {
      setSubmitError(true);
    }
  };

  const inputClass = (key: keyof FormState) =>
    `focus-outline w-full rounded-xl border bg-white/[0.02] px-4 py-3 text-base text-textPrimary placeholder:text-textMuted transition-colors hover:bg-white/[0.04] sm:text-sm ${
      errors[key] ? "border-[var(--error)]" : "border-borderCool"
    }`;

  const submitLabel = auditMode
    ? t.contact.form.submitAudit
    : t.contact.form.submit;

  const errorMessage = useMemo(
    () => t.contact.form.submitError.replace("{email}", CONTACT_EMAIL),
    [t.contact.form.submitError],
  );

  const successOverlay =
    portalReady &&
    createPortal(
      <AnimatePresence>
        {sent ? (
          <motion.div
            key="contact-success"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-success-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-5"
            onClick={() => setSent(false)}
          >
            <div className="absolute inset-0 bg-[#04060a]/92 backdrop-blur-md" />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(252,211,77,0.14), transparent 70%)",
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="relative z-10 w-full max-w-md rounded-3xl border border-[rgba(252,211,77,0.28)] bg-[#0f1620] px-7 py-9 text-center shadow-[0_40px_100px_-30px_rgba(0,0,0,0.85)]"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSent(false)}
                className="focus-outline absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-textMuted transition-colors hover:bg-white/5 hover:text-textPrimary"
                aria-label={t.contact.form.successClose}
              >
                <X size={18} />
              </button>

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/30">
                <CheckCircle2 size={34} strokeWidth={1.75} />
              </div>

              <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.22em] text-accentGold">
                DormUp Studio
              </p>
              <h2
                id="contact-success-title"
                className="text-2xl font-semibold tracking-tight text-textPrimary sm:text-[1.7rem]"
              >
                {t.contact.form.successTitle}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-textSecondary">
                {t.contact.form.success}
              </p>

              <button
                type="button"
                onClick={() => setSent(false)}
                className="focus-outline interactive mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-accentGold px-6 py-3 text-sm font-medium text-bgPrimary shadow-[0_20px_50px_-22px_rgba(252,211,77,0.65)] hover:shadow-[0_26px_60px_-22px_rgba(252,211,77,0.85)] active:scale-[0.97]"
              >
                {t.contact.form.successClose}
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>,
      document.body,
    );

  return (
    <>
      <form
        onSubmit={onSubmit}
        className={compact ? "glass-card rounded-3xl p-5" : "glass-card rounded-3xl p-5 sm:p-7"}
      >
        {/* Honeypot — hidden from users */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
          defaultValue=""
        />

        <ServiceCart t={t} />

        <div className="space-y-5">
          <Field label={t.contact.form.email} error={errors.email}>
            <input
              type="email"
              autoComplete="email"
              className={inputClass("email")}
              value={form.email}
              onChange={onChange("email")}
            />
          </Field>

          <Field
            label={`${t.contact.form.name} (${t.contact.form.optional})`}
            error={errors.fullName}
          >
            <input
              autoComplete="name"
              className={inputClass("fullName")}
              value={form.fullName}
              onChange={onChange("fullName")}
            />
          </Field>

          <Field label={t.contact.form.business} error={errors.businessName}>
            <input
              autoComplete="organization"
              className={inputClass("businessName")}
              value={form.businessName}
              onChange={onChange("businessName")}
            />
          </Field>

          <Field label={t.contact.form.businessType} error={errors.businessType}>
            <select
              className={inputClass("businessType")}
              value={form.businessType}
              onChange={onChange("businessType")}
            >
              <option value="restaurant">{t.contact.form.options.restaurant}</option>
              <option value="hotel">{t.contact.form.options.hotel}</option>
              <option value="bar">{t.contact.form.options.bar}</option>
              <option value="other">{t.contact.form.options.other}</option>
            </select>
          </Field>

          <Field
            label={`${t.contact.form.brief} (${t.contact.form.optional})`}
            error={errors.brief}
          >
            <textarea
              className={inputClass("brief")}
              rows={4}
              value={form.brief}
              onChange={onChange("brief")}
              placeholder={
                auditMode ? t.contact.form.auditBriefPlaceholder : undefined
              }
            />
          </Field>

          <Field label={t.contact.form.source} error={errors.source}>
            <select
              className={inputClass("source")}
              value={form.source}
              onChange={onChange("source")}
            >
              <option value="google">{t.contact.form.options.google}</option>
              <option value="referral">{t.contact.form.options.referral}</option>
              <option value="social">{t.contact.form.options.social}</option>
              <option value="other">{t.contact.form.options.other}</option>
            </select>
          </Field>
        </div>

        {submitError ? (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-300"
          >
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="focus-outline interactive mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-accentGold px-6 py-3 text-sm font-medium text-bgPrimary shadow-[0_20px_50px_-22px_rgba(252,211,77,0.65)] hover:shadow-[0_26px_60px_-22px_rgba(252,211,77,0.85)] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none active:scale-[0.97]"
        >
          {loading ? t.contact.form.submitting : submitLabel}
        </button>
      </form>

      {successOverlay}
    </>
  );
}

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <label className="block text-sm text-textPrimary">
      {label}
      <div className="mt-2">{children}</div>
      {error ? <p className="mt-1 text-xs text-red-400">{error}</p> : null}
    </label>
  );
}
