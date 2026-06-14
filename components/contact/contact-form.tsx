"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
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
  /** Full form on desktop / contact page; compact on mobile homepage. */
  variant?: "full" | "compact";
  /** Force audit flow. Overrides ?intent=audit when true. */
  auditMode?: boolean;
}

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
  const [errors, setErrors] = useState<Record<keyof FormState, string>>({
    fullName: "",
    email: "",
    businessName: "",
    businessType: "",
    siteUrl: "",
    brief: "",
    source: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const briefPlaceholder = auditMode
    ? t.contact.form.auditBriefPlaceholder
    : undefined;

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
      businessName:
        compact || auditMode
          ? ""
          : state.businessName.trim()
            ? ""
            : requiredError,
      businessType: state.businessType ? "" : requiredError,
      siteUrl:
        auditMode &&
        state.siteUrl.trim() &&
        !urlRegex.test(state.siteUrl.trim()) &&
        !state.siteUrl.includes(".")
          ? t.contact.form.errors.invalidUrl
          : "",
      brief: "",
      source: compact ? "" : state.source ? "" : requiredError,
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
      response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          intent: auditMode ? "audit" : undefined,
        siteUrl: form.siteUrl,
          selectedServices: cart.services,
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

  return (
    <form
      onSubmit={onSubmit}
      className={compact ? "glass-card rounded-3xl p-5" : "glass-card rounded-3xl p-5 sm:p-7"}
    >
      {!compact ? <ServiceCart t={t} /> : null}

      <div className="space-y-5">
        {auditMode ? (
          <Field
            label={`${t.contact.form.siteUrl} (${t.contact.form.optional})`}
            error={errors.siteUrl}
          >
            <input
              type="url"
              inputMode="url"
              className={inputClass("siteUrl")}
              value={form.siteUrl}
              onChange={onChange("siteUrl")}
              placeholder="https://"
            />
          </Field>
        ) : null}

        <Field label={t.contact.form.email} error={errors.email}>
          <input
            type="email"
            className={inputClass("email")}
            value={form.email}
            onChange={onChange("email")}
          />
        </Field>

        {!compact ? (
          <>
            <Field
              label={`${t.contact.form.name} (${t.contact.form.optional})`}
              error={errors.fullName}
            >
              <input
                className={inputClass("fullName")}
                value={form.fullName}
                onChange={onChange("fullName")}
              />
            </Field>

            {!auditMode ? (
              <Field label={t.contact.form.business} error={errors.businessName}>
                <input
                  className={inputClass("businessName")}
                  value={form.businessName}
                  onChange={onChange("businessName")}
                />
              </Field>
            ) : null}
          </>
        ) : null}

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

        {!compact ? (
          <>
            <Field
              label={
                auditMode
                  ? t.contact.form.brief
                  : `${t.contact.form.brief} (${t.contact.form.optional})`
              }
              error={errors.brief}
            >
              <textarea
                className={inputClass("brief")}
                rows={4}
                value={form.brief}
                onChange={onChange("brief")}
                placeholder={briefPlaceholder}
              />
            </Field>

            {!auditMode ? (
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
            ) : null}
          </>
        ) : null}
      </div>

      {submitError ? (
        <p role="alert" className="mt-4 rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="focus-outline interactive mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-accentGold px-6 py-3 text-sm font-medium text-bgPrimary shadow-[0_20px_50px_-22px_rgba(252,211,77,0.65)] hover:shadow-[0_26px_60px_-22px_rgba(252,211,77,0.85)] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
      >
        {loading ? t.contact.form.submitting : submitLabel}
      </button>

      <AnimatePresence>
        {sent ? (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex items-center gap-2 text-sm text-emerald-300"
          >
            <CheckCircle2 size={16} />
            {t.contact.form.success}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </form>
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
