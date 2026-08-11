"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState("");
  const [converting, setConverting] = useState(false);

  async function patch(body: Record<string, unknown>) {
    setMsg("");
    const res = await fetch(`/api/studio/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      setMsg((await res.json()).error || "Ошибка сохранения");
      return;
    }
    router.refresh();
    setMsg("Сохранено");
  }

  async function addNote() {
    if (!note.trim()) return;
    await patch({ note });
    setNote("");
  }

  async function convertToCase() {
    setMsg("");
    setConverting(true);
    try {
      const res = await fetch(`/api/studio/leads/${leadId}/convert`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.status === 409 && data.caseId) {
        router.push(studioPath(`/cases/${data.caseId}`));
        return;
      }
      if (!res.ok) {
        setMsg(data.error || "Не удалось создать дело");
        return;
      }
      router.push(studioPath(`/cases/${data.id}`));
    } finally {
      setConverting(false);
    }
  }

  async function gdprExport() {
    window.open(`/api/studio/leads/${leadId}/gdpr`, "_blank");
  }

  async function gdprDelete() {
    if (!confirm("Удалить заявку навсегда (GDPR)?")) return;
    const res = await fetch(`/api/studio/leads/${leadId}/gdpr`, { method: "DELETE" });
    if (res.ok) router.push(studioPath("/leads"));
    else setMsg("Не удалось удалить");
  }

  return (
    <div className="st-form" style={{ maxWidth: 640 }}>
      <div className="st-row">
        <label className="st-label" style={{ flex: 1 }}>
          Статус
          <select
            className="st-select"
            defaultValue={status}
            onChange={(e) => patch({ status: e.target.value })}
          >
            <option value="new">Новая</option>
            <option value="in_progress">В работе</option>
            <option value="won">Выиграна</option>
            <option value="lost">Отказ</option>
            <option value="spam">Спам</option>
          </select>
        </label>
        <label className="st-label" style={{ flex: 1 }}>
          Приоритет
          <select
            className="st-select"
            defaultValue={priority}
            onChange={(e) => patch({ priority: e.target.value })}
          >
            <option value="low">Низкий</option>
            <option value="normal">Обычный</option>
            <option value="high">Высокий</option>
          </select>
        </label>
      </div>
      <label className="st-label">
        Заметка
        <textarea className="st-textarea" value={note} onChange={(e) => setNote(e.target.value)} />
      </label>
      <div className="st-row">
        {existingCaseId ? (
          <button
            type="button"
            className="st-btn primary"
            onClick={() => router.push(studioPath(`/cases/${existingCaseId}`))}
          >
            Открыть дело
          </button>
        ) : (
          <button
            type="button"
            className="st-btn primary"
            onClick={convertToCase}
            disabled={converting}
          >
            {converting ? "Создаём…" : "Создать дело"}
          </button>
        )}
        <button type="button" className="st-btn" onClick={addNote}>
          Сохранить заметку
        </button>
        <button type="button" className="st-btn" onClick={gdprExport}>
          Экспорт (GDPR)
        </button>
        <button type="button" className="st-btn danger" onClick={gdprDelete}>
          Удалить
        </button>
      </div>
      {msg ? <p className="st-ok">{msg}</p> : null}
    </div>
  );
}
