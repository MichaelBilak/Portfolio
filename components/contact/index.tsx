"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Mail, MessageCircle, Signal } from "lucide-react";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { TranslationSet } from "@/lib/translations";
import { ContactErrorBoundary } from "./contact-error-boundary";

interface ContactProps {
  t: TranslationSet;
}

type BusinessType = "restaurant" | "hotel" | "bar" | "other";
type SourceType = "google" | "referral" | "social" | "other";

interface FormState {
  fullName: string;
  businessName: string;
  businessType: BusinessType;
  brief: string;
  source: SourceType;
}

export function Contact({ t }: ContactProps) {
  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="container-lux grid gap-10 lg:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accentGold">{t.contact.label}</p>
          <h2 className="mt-3 text-fluid-title font-display font-light">{t.contact.title}</h2>
          <p className="mt-6 max-w-xl text-lg text-textSecondary">{t.contact.body}</p>
          <div className="mt-8 space-y-4 text-sm">
            <p className="flex items-center gap-3">
              <Mail size={16} className="text-accentGold" /> {t.contact.emailLabel}:{" "}
              <a className="text-textPrimary underline-offset-2 hover:underline" href="mailto:hello@bilakstudio.com">
                hello@bilakstudio.com
              </a>
            </p>
            <p className="flex items-center gap-3">
              <MessageCircle size={16} className="text-accentGold" /> {t.contact.whatsappLabel}:{" "}
              <a className="text-textPrimary underline-offset-2 hover:underline" href="https://wa.me/393333333333">
                +39 333 333 3333
              </a>
            </p>
            <p className="flex items-center gap-3">
              <Signal size={16} className="text-accentGold" /> {t.contact.availability}
            </p>
          </div>
        </div>

        <ContactErrorBoundary>
          <ContactForm t={t} />
        </ContactErrorBoundary>
      </div>
    </section>
  );
}

function ContactForm({ t }: ContactProps) {
  const [form, setForm] = useState<FormState>({
    fullName: "",
    businessName: "",
    businessType: "restaurant",
    brief: "",
    source: "google",
  });
  const [errors, setErrors] = useState<Record<keyof FormState, string>>({
    fullName: "",
    businessName: "",
    businessType: "",
    brief: "",
    source: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const hasErrors = useMemo(
    () => Object.values(errors).some((error) => error.length > 0),
    [errors],
  );

  const validate = (state: FormState) => {
    const requiredError = t.contact.form.errors.required;
    const next: Record<keyof FormState, string> = {
      fullName: state.fullName.trim() ? "" : requiredError,
      businessName: state.businessName.trim() ? "" : requiredError,
      businessType: "",
      brief: state.brief.trim() ? "" : requiredError,
      source: "",
    };
    setErrors(next);
    return !next.fullName && !next.businessName && !next.brief;
  };

  const onChange =
    (key: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = event.target.value;
      setForm((prev) => ({ ...prev, [key]: value }));
      if (errors[key]) {
        setErrors((prev) => ({ ...prev, [key]: "" }));
      }
    };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate(form)) {
      return;
    }

    setLoading(true);
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);

    if (response.ok) {
      setSent(true);
      setForm({
        fullName: "",
        businessName: "",
        businessType: "restaurant",
        brief: "",
        source: "google",
      });
    }
  };

  const inputClass = (key: keyof FormState) =>
    `focus-outline w-full rounded-xl border bg-white/[0.02] px-4 py-3 text-sm text-textPrimary placeholder:text-textMuted transition-colors hover:bg-white/[0.04] ${
      errors[key] ? "border-[var(--error)]" : "border-borderCool"
    }`;

  return (
    <form onSubmit={onSubmit} className="glass-card rounded-3xl p-7">
      <div className="space-y-5">
        <Field label={t.contact.form.name} error={errors.fullName}>
          <input className={inputClass("fullName")} value={form.fullName} onChange={onChange("fullName")} />
        </Field>

        <Field label={t.contact.form.business} error={errors.businessName}>
          <input
            className={inputClass("businessName")}
            value={form.businessName}
            onChange={onChange("businessName")}
          />
        </Field>

        <Field label={t.contact.form.businessType}>
          <select className={inputClass("businessType")} value={form.businessType} onChange={onChange("businessType")}>
            <option value="restaurant">{t.contact.form.options.restaurant}</option>
            <option value="hotel">{t.contact.form.options.hotel}</option>
            <option value="bar">{t.contact.form.options.bar}</option>
            <option value="other">{t.contact.form.options.other}</option>
          </select>
        </Field>

        <Field label={t.contact.form.brief} error={errors.brief}>
          <textarea className={inputClass("brief")} rows={4} value={form.brief} onChange={onChange("brief")} />
        </Field>

        <Field label={t.contact.form.source}>
          <select className={inputClass("source")} value={form.source} onChange={onChange("source")}>
            <option value="google">{t.contact.form.options.google}</option>
            <option value="referral">{t.contact.form.options.referral}</option>
            <option value="social">{t.contact.form.options.social}</option>
            <option value="other">{t.contact.form.options.other}</option>
          </select>
        </Field>
      </div>

      <button
        type="submit"
        disabled={loading || hasErrors}
        className="focus-outline interactive mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-accentGold px-6 py-3 text-sm font-medium text-bgPrimary shadow-[0_20px_50px_-22px_rgba(252,211,77,0.65)] hover:shadow-[0_26px_60px_-22px_rgba(252,211,77,0.85)] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
      >
        {loading ? t.contact.form.submitting : t.contact.form.submit}
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

interface FieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
}

function Field({ label, children, error }: FieldProps) {
  return (
    <label className="block text-sm text-textPrimary">
      {label}
      <div className="mt-2">{children}</div>
      {error ? <p className="mt-1 text-xs text-red-400">{error}</p> : null}
    </label>
  );
}
