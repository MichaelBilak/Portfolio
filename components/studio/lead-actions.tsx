"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { labelPriority, labelStatus, useStudioI18n } from "@/lib/studio/i18n";
import { studioPath } from "@/lib/studio/path";

type ProfileOption = { id: string; name: string | null };
type StageOption = { id: string; name: string; key: string };

export function LeadActions({
  leadId,
  status,
  priority,
  assigneeId,
  nextActionAt,
  lostReason,
  existingCaseId,
  users,
  stages,
  currentUserId,
}: {
  leadId: string;
  status: string;
  priority: string;
  assigneeId?: string | null;
  nextActionAt?: string | null;
  lostReason?: string | null;
  existingCaseId?: string | null;
  users: ProfileOption[];
  stages: StageOption[];
  currentUserId: string;
}) {
  const router = useRouter();
  const { t, locale } = useStudioI18n();
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState("");
  const [msgTone, setMsgTone] = useState<"ok" | "error">("ok");
  const [converting, setConverting] = useState(false);
  const [localLostReason, setLocalLostReason] = useState(lostReason || "");
  const [stageId, setStageId] = useState(stages[0]?.id || "");
  const [ownerId, setOwnerId] = useState(currentUserId);

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
        body: JSON.stringify({
          stageId: stageId || undefined,
          ownerId: ownerId || undefined,
        }),
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

  function toLocalInput(value?: string | null) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const pad = (part: number) => String(part).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  return (
    <div className="st-form st-lead-actions">
      <div className="st-lead-action-block">
        <p className="st-lead-action-label">{t("leads.qualifySection")}</p>
        <label className="st-label">
          {t("leads.statusLabel")}
          <select
            className="st-select"
            defaultValue={status}
            onChange={(e) => {
              const next = e.target.value;
              if (next === "lost") {
                void patch({ status: next, lostReason: localLostReason || undefined });
              } else {
                void patch({ status: next });
              }
            }}
          >
            {(["new", "in_progress", "won", "lost", "spam"] as const).map((value) => (
              <option key={value} value={value}>
                {labelStatus(locale, value)}
              </option>
            ))}
          </select>
        </label>
        <label className="st-label">
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
        <label className="st-label">
          {t("crm.assignee")}
          <select
            className="st-select"
            defaultValue={assigneeId || ""}
            onChange={(e) => patch({ assigneeId: e.target.value || null })}
          >
            <option value="">{t("leads.unassigned")}</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name || user.id.slice(0, 8)}
              </option>
            ))}
          </select>
        </label>
        <label className="st-label">
          {t("leads.nextAction")}
          <input
            className="st-input"
            type="datetime-local"
            defaultValue={toLocalInput(nextActionAt)}
            onChange={(e) =>
              patch({
                nextActionAt: e.target.value ? new Date(e.target.value).toISOString() : null,
              })
            }
          />
        </label>
        <label className="st-label">
          {t("leads.lostReason")}
          <input
            className="st-input"
            value={localLostReason}
            onChange={(e) => setLocalLostReason(e.target.value)}
            onBlur={() => {
              if (localLostReason !== (lostReason || "")) {
                void patch({ lostReason: localLostReason || null });
              }
            }}
            placeholder={t("leads.lostReasonPlaceholder")}
          />
        </label>
        <button
          type="button"
          className="st-btn"
          onClick={() => patch({ assigneeId: currentUserId, status: "in_progress" })}
        >
          {t("leads.claim")}
        </button>
      </div>

      <div className="st-lead-action-block">
        <p className="st-lead-action-label">{t("leads.noteLabel")}</p>
        <label className="st-label">
          <textarea
            className="st-textarea"
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("leads.noteLabel")}
          />
        </label>
        <button type="button" className="st-btn" onClick={addNote}>
          {t("leads.saveNote")}
        </button>
      </div>

      <div className="st-lead-action-block">
        <p className="st-lead-action-label">{t("leads.convertSection")}</p>
        {!existingCaseId ? (
          <>
            <label className="st-label">
              {t("crm.stage")}
              <select
                className="st-select"
                value={stageId}
                onChange={(e) => setStageId(e.target.value)}
              >
                {stages.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="st-label">
              {t("crm.owner")}
              <select
                className="st-select"
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name || user.id.slice(0, 8)}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="st-btn primary"
              onClick={convertToCase}
              disabled={converting}
            >
              {converting ? t("leads.creatingCase") : t("leads.createCase")}
            </button>
          </>
        ) : (
          <button
            type="button"
            className="st-btn primary"
            onClick={() => router.push(studioPath(`/cases/${existingCaseId}`))}
          >
            {t("leads.openCase")}
          </button>
        )}
      </div>

      <div className="st-lead-action-block st-lead-action-danger">
        <p className="st-lead-action-label">{t("leads.gdprSection")}</p>
        <div className="st-row" style={{ flexWrap: "wrap", gap: "0.5rem" }}>
          <button type="button" className="st-btn" onClick={gdprExport}>
            {t("leads.gdprExport")}
          </button>
          <button type="button" className="st-btn danger" onClick={gdprDelete}>
            {t("leads.gdprDelete")}
          </button>
        </div>
      </div>

      {msg ? <p className={msgTone === "error" ? "st-error" : "st-ok"}>{msg}</p> : null}
    </div>
  );
}
