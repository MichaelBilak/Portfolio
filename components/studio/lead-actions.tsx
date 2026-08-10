"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { studioPath } from "@/lib/studio/path";

export function LeadActions({
  leadId,
  status,
  priority,
}: {
  leadId: string;
  status: string;
  priority: string;
}) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState("");

  async function patch(body: Record<string, unknown>) {
    setMsg("");
    const res = await fetch(`/api/studio/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      setMsg((await res.json()).error || "Failed");
      return;
    }
    router.refresh();
    setMsg("Saved");
  }

  async function addNote() {
    if (!note.trim()) return;
    await patch({ note });
    setNote("");
  }

  async function gdprExport() {
    window.open(`/api/studio/leads/${leadId}/gdpr`, "_blank");
  }

  async function gdprDelete() {
    if (!confirm("Permanently delete this lead (GDPR)?")) return;
    const res = await fetch(`/api/studio/leads/${leadId}/gdpr`, { method: "DELETE" });
    if (res.ok) router.push(studioPath("/leads"));
    else setMsg("Delete failed");
  }

  return (
    <div className="st-form" style={{ maxWidth: 640 }}>
      <div className="st-row">
        <label className="st-label" style={{ flex: 1 }}>
          Status
          <select
            className="st-select"
            defaultValue={status}
            onChange={(e) => patch({ status: e.target.value })}
          >
            {["new", "in_progress", "won", "lost", "spam"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="st-label" style={{ flex: 1 }}>
          Priority
          <select
            className="st-select"
            defaultValue={priority}
            onChange={(e) => patch({ priority: e.target.value })}
          >
            {["low", "normal", "high"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="st-label">
        Add note
        <textarea className="st-textarea" value={note} onChange={(e) => setNote(e.target.value)} />
      </label>
      <div className="st-row">
        <button type="button" className="st-btn primary" onClick={addNote}>
          Save note
        </button>
        <button type="button" className="st-btn" onClick={gdprExport}>
          GDPR export
        </button>
        <button type="button" className="st-btn danger" onClick={gdprDelete}>
          GDPR delete
        </button>
      </div>
      {msg ? <p className="st-ok">{msg}</p> : null}
    </div>
  );
}
