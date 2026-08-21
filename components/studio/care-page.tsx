"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { HeartHandshake, LoaderCircle, Plus, RefreshCw } from "lucide-react";
import { formatStudioDate, useStudioI18n } from "@/lib/studio/i18n";
import { studioPath } from "@/lib/studio/path";

type CareRow = {
  id: string;
  case_id: string | null;
  client_name: string | null;
  company_name: string | null;
  client_email: string | null;
  monthly_amount: number;
  currency: string;
  status: string;
  next_review_at: string | null;
  notes: string | null;
};

export function CarePage() {
  const { t, locale } = useStudioI18n();
  const [items, setItems] = useState<CareRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/studio/care?limit=100", {
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("common.error"));
      setItems((data.items || []) as CareRow[]);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  async function createCare(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const form = new FormData(event.currentTarget);
      const res = await fetch("/api/studio/care", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: form.get("companyName"),
          clientName: form.get("clientName"),
          clientEmail: form.get("clientEmail"),
          monthlyAmount: Number(form.get("monthlyAmount") || 0),
          currency: form.get("currency") || "EUR",
          caseId: String(form.get("caseId") || "") || undefined,
          nextReviewAt: form.get("nextReviewAt")
            ? new Date(String(form.get("nextReviewAt"))).toISOString()
            : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("common.failed"));
      setShowCreate(false);
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setBusy(false);
    }
  }

  async function patchStatus(id: string, status: string) {
    setError("");
    try {
      const res = await fetch("/api/studio/care", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("common.failed"));
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    }
  }

  const active = items.filter((row) => row.status === "active");
  const mrr = active.reduce((sum, row) => sum + Number(row.monthly_amount || 0), 0);

  return (
    <div className="st-care-page">
      <div className="st-page-header">
        <div>
          <p className="st-eyebrow">{t("care.eyebrow")}</p>
          <h1 className="st-h1">{t("care.title")}</h1>
          <p className="st-sub">{t("care.subtitle")}</p>
        </div>
        <div className="st-row" style={{ gap: "0.5rem" }}>
          <button type="button" className="st-icon-btn" onClick={() => void load()}>
            <RefreshCw size={16} />
          </button>
          <button type="button" className="st-btn primary" onClick={() => setShowCreate(true)}>
            <Plus size={16} /> {t("care.create")}
          </button>
        </div>
      </div>

      <div className="st-metrics" style={{ marginBottom: "1.25rem" }}>
        <div className="st-metric">
          <span className="st-metric-icon">
            <HeartHandshake size={18} />
          </span>
          <div>
            <small>{t("care.activeCount")}</small>
            <strong>{active.length}</strong>
            <em>
              MRR {mrr.toLocaleString()} EUR
            </em>
          </div>
        </div>
      </div>

      {error ? <p className="st-error">{error}</p> : null}
      {loading ? (
        <div className="st-state">
          <LoaderCircle className="st-spin" />
          <strong>{t("common.loading")}</strong>
        </div>
      ) : !items.length ? (
        <div className="st-state">
          <HeartHandshake />
          <strong>{t("care.empty")}</strong>
        </div>
      ) : (
        <ul className="st-leads-list">
          {items.map((row) => (
            <li key={row.id} className="st-leads-row">
              <div className="st-leads-row-main">
                <div className="st-leads-row-title">
                  <strong>{row.company_name || row.client_name || t("care.title")}</strong>
                  <span className={`st-status st-status-${row.status}`}>{row.status}</span>
                </div>
                <div className="st-leads-row-meta">
                  <span>
                    {Number(row.monthly_amount || 0).toLocaleString()} {row.currency}/mo
                  </span>
                  <span>{row.client_email || "—"}</span>
                  <span>
                    {t("care.nextReview")}:{" "}
                    {row.next_review_at
                      ? formatStudioDate(row.next_review_at, locale, true)
                      : "—"}
                  </span>
                  {row.case_id ? (
                    <span>
                      <Link href={studioPath(`/cases/${row.case_id}`)}>{t("nav.cases")}</Link>
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="st-leads-row-actions">
                {row.status !== "active" ? (
                  <button
                    type="button"
                    className="st-btn subtle"
                    onClick={() => void patchStatus(row.id, "active")}
                  >
                    {t("care.activate")}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="st-btn subtle"
                    onClick={() => void patchStatus(row.id, "paused")}
                  >
                    {t("care.pause")}
                  </button>
                )}
                {row.status !== "ended" ? (
                  <button
                    type="button"
                    className="st-btn subtle"
                    onClick={() => void patchStatus(row.id, "ended")}
                  >
                    {t("care.end")}
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}

      {showCreate ? (
        <div className="st-modal-backdrop" onClick={() => setShowCreate(false)}>
          <div className="st-modal" onClick={(event) => event.stopPropagation()}>
            <h2>{t("care.create")}</h2>
            <form className="st-form" onSubmit={createCare}>
              <label className="st-label">
                {t("leads.business")}
                <input className="st-input" name="companyName" required />
              </label>
              <label className="st-label">
                {t("leads.client")}
                <input className="st-input" name="clientName" />
              </label>
              <label className="st-label">
                {t("leads.email")}
                <input className="st-input" name="clientEmail" type="email" />
              </label>
              <label className="st-label">
                {t("care.monthlyAmount")}
                <input
                  className="st-input"
                  name="monthlyAmount"
                  type="number"
                  min={0}
                  step="0.01"
                  defaultValue={300}
                  required
                />
              </label>
              <label className="st-label">
                {t("crm.currency")}
                <input className="st-input" name="currency" defaultValue="EUR" />
              </label>
              <label className="st-label">
                {t("care.caseIdOptional")}
                <input className="st-input" name="caseId" placeholder="uuid" />
              </label>
              <label className="st-label">
                {t("care.nextReview")}
                <input className="st-input" name="nextReviewAt" type="date" />
              </label>
              <div className="st-row">
                <button className="st-btn primary" type="submit" disabled={busy}>
                  {busy ? t("common.loading") : t("common.save")}
                </button>
                <button type="button" className="st-btn" onClick={() => setShowCreate(false)}>
                  {t("common.cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
