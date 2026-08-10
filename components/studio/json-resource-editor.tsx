"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function JsonResourceEditor({
  endpoint,
  initial,
  title,
}: {
  endpoint: string;
  initial: unknown;
  title?: string;
}) {
  const router = useRouter();
  const [text, setText] = useState(() => JSON.stringify(initial, null, 2));
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  async function save() {
    setMsg("");
    setError("");
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      setError("Неверный JSON");
      return;
    }
    const res = await fetch(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Ошибка сохранения");
      return;
    }
    setMsg("Сохранено");
    await fetch("/api/studio/revalidate", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="st-form" style={{ maxWidth: 900 }}>
      {title ? <h2 style={{ margin: 0, fontSize: "1.05rem" }}>{title}</h2> : null}
      <textarea
        className="st-textarea"
        style={{ minHeight: 360, fontFamily: "ui-monospace, monospace", fontSize: "0.82rem" }}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="st-row">
        <button type="button" className="st-btn primary" onClick={save}>
          Сохранить
        </button>
      </div>
      {error ? <p className="st-error">{error}</p> : null}
      {msg ? <p className="st-ok">{msg}</p> : null}
    </div>
  );
}
