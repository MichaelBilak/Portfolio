"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { labelPriority, labelStatus, useStudioI18n } from "@/lib/studio/i18n";
import { studioPath } from "@/lib/studio/path";

export function LeadActions({
  leadId,
  status,
  priority,
  existingCaseId,
}: {
  leadId: string;
  status: string;
  priority: string;
  existingCaseId?: string | null;
}) {
  const router = useRouter();
  const { t, locale } = useStudioI18n();
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState("");
  const [msgTone, setMsgTone] = useState<"ok" | "error">("ok");
  const [converting, setConverting] = useState(false);

  function showMsg(text: string, tone: "ok" | "error" = "ok") {
    setMsgTone(tone);
    setMsg(text);
  }

  async function patch(body: Record<string, unknown>) {
    showMsg("");
    const res = await fetch(`/api/studio/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      showMsg((await res.json().catch(() => ({}))).error || t("leads.saveError"), "error");
      return;
    }
    router.refresh();
    showMsg(t("common.saved"));
  }

  async function addNote() {
    if (!note.trim()) return;
    await patch({ note });
    setNote("");
  }

  async function convertToCase() {
    showMsg("");
    setConverting(true);
    try {
      const res = await fetch(`/api/studio/leads/${leadId}/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: "{}",
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 409 && data.caseId) {
        router.push(studioPath(`/cases/${data.caseId}`));
        return;
      }
      if (!res.ok) {
        showMsg(data.error || t("leads.convertError"), "error");
        return;
      }
      if (!data.id) {
        showMsg(t("leads.convertError"), "error");
        return;
      }
      router.push(studioPath(`/cases/${data.id}`));
    } catch {
      showMsg(t("leads.convertError"), "error");
    } finally {
      setConverting(false);
    }
  }

  async function gdprExport() {
    window.open(`/api/studio/leads/${leadId}/gdpr`, "_blank");
  }

  async function gdprDelete() {
    if (!confirm(t("leads.gdprConfirm"))) return;
    const res = await fetch(`/api/studio/leads/${leadId}/gdpr`, { method: "DELETE" });
    if (res.ok) router.push(studioPath("/leads"));
    else showMsg(t("leads.deleteError"), "error");
  }

  return (
    <div className="st-form" style={{ maxWidth: 640 }}>
      <div className="st-row">
        <label className="st-label" style={{ flex: 1 }}>
          {t("leads.statusLabel")}
          <select
            className="st-select"
            defaultValue={status}
            onChange={(e) => patch({ status: e.target.value })}
          >
            {(["new", "in_progress", "won", "lost", "spam"] as const).map((value) => (
              <option key={value} value={value}>
                {labelStatus(locale, value)}
              </option>
            ))}
          </select>
        </label>
        <label className="st-label" style={{ flex: 1 }}>
          {t("leads.priorityLabel")}
          <select
            className="st-select"
            defaultValue={priority}
            onChange={(e) => patch({ priority: e.target.value })}
          >
            {(["low", "normal", "high"] as const).map((value) => (
              <option key={value} value={value}>
                {labelPriority(locale, value)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="st-label">
        {t("leads.noteLabel")}
        <textarea className="st-textarea" value={note} onChange={(e) => setNote(e.target.value)} />
      </label>
      <div className="st-row">
        {existingCaseId ? (
          <button
            type="button"
            className="st-btn primary"
            onClick={() => router.push(studioPath(`/cases/${existingCaseId}`))}
          >
            {t("leads.openCase")}
          </button>
        ) : (
          <button
            type="button"
            className="st-btn primary"
            onClick={convertToCase}
            disabled={converting}
          >
            {converting ? t("leads.creatingCase") : t("leads.createCase")}
          </button>
        )}
        <button type="button" className="st-btn" onClick={addNote}>
          {t("leads.saveNote")}
        </button>
        <button type="button" className="st-btn" onClick={gdprExport}>
          {t("leads.gdprExport")}
        </button>
        <button type="button" className="st-btn danger" onClick={gdprDelete}>
          {t("leads.gdprDelete")}
        </button>
      </div>
      {msg ? <p className={msgTone === "error" ? "st-error" : "st-ok"}>{msg}</p> : null}
    </div>
  );
}
