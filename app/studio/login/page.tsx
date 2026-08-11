"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { StudioI18nProvider, StudioLanguageSelector, useStudioI18n } from "@/lib/studio/i18n";
import { studioPath } from "@/lib/studio/path";

function StudioLoginForm() {
  const router = useRouter();
  const { t } = useStudioI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const sb = createBrowserSupabaseClient();
      const { error: authError } = await sb.auth.signInWithPassword({ email, password });
      if (authError) {
        setError(authError.message);
        return;
      }
      router.replace(studioPath());
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("login.failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="st-login">
      <div className="st-login-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <div className="st-brand" style={{ paddingLeft: 0 }}>
            DormUp
          </div>
          <StudioLanguageSelector />
        </div>
        <p className="st-sub">{t("login.subtitle")}</p>
        <form className="st-form" onSubmit={onSubmit}>
          <label className="st-label">
            {t("login.email")}
            <input
              className="st-input"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="st-label">
            {t("login.password")}
            <input
              className="st-input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error ? <p className="st-error">{error}</p> : null}
          <button className="st-btn primary" type="submit" disabled={loading}>
            {loading ? t("login.loading") : t("login.submit")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function StudioLoginPage() {
  return (
    <StudioI18nProvider>
      <StudioLoginForm />
    </StudioI18nProvider>
  );
}
