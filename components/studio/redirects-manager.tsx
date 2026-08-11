"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStudioI18n } from "@/lib/studio/i18n";

type RedirectRow = {
  id?: string;
  from_path: string;
  to_path: string;
  permanent: boolean;
  enabled: boolean;
};

export function RedirectsManager({ initial }: { initial: RedirectRow[] }) {
  const router = useRouter();
  const { t } = useStudioI18n();
  const [rows, setRows] = useState(initial);
  const [fromPath, setFrom] = useState("");
  const [toPath, setTo] = useState("");
  const [msg, setMsg] = useState("");

  async function saveAll() {
    const res = await fetch("/api/studio/redirects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows }),
    });
    setMsg(res.ok ? t("redirects.saved") : t("redirects.failed"));
    if (res.ok) {
      await fetch("/api/studio/revalidate", { method: "POST" });
      router.refresh();
    }
  }

  async function addRow() {
    if (!fromPath.startsWith("/") || !toPath.startsWith("/")) {
      setMsg(t("redirects.pathError"));
      return;
    }
    setRows((r) => [...r, { from_path: fromPath, to_path: toPath, permanent: true, enabled: true }]);
    setFrom("");
    setTo("");
  }

  return (
    <div className="st-form" style={{ maxWidth: 900 }}>
      <table className="st-table">
        <thead>
          <tr>
            <th>{t("redirects.from")}</th>
            <th>{t("redirects.to")}</th>
            <th>{t("redirects.permanent")}</th>
            <th>{t("redirects.enabled")}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id || i}>
              <td>
                <input
                  className="st-input"
                  value={row.from_path}
                  onChange={(e) =>
                    setRows((all) => all.map((r, idx) => (idx === i ? { ...r, from_path: e.target.value } : r)))
                  }
                />
              </td>
              <td>
                <input
                  className="st-input"
                  value={row.to_path}
                  onChange={(e) =>
                    setRows((all) => all.map((r, idx) => (idx === i ? { ...r, to_path: e.target.value } : r)))
                  }
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={row.permanent}
                  onChange={(e) =>
                    setRows((all) => all.map((r, idx) => (idx === i ? { ...r, permanent: e.target.checked } : r)))
                  }
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={row.enabled}
                  onChange={(e) =>
                    setRows((all) => all.map((r, idx) => (idx === i ? { ...r, enabled: e.target.checked } : r)))
                  }
                />
              </td>
              <td>
                <button type="button" className="st-btn danger" onClick={() => setRows((all) => all.filter((_, idx) => idx !== i))}>
                  {t("common.remove")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="st-row">
        <input className="st-input" placeholder="/old" value={fromPath} onChange={(e) => setFrom(e.target.value)} style={{ width: 180 }} />
        <input className="st-input" placeholder="/new" value={toPath} onChange={(e) => setTo(e.target.value)} style={{ width: 180 }} />
        <button type="button" className="st-btn" onClick={addRow}>
          {t("redirects.add")}
        </button>
        <button type="button" className="st-btn primary" onClick={saveAll}>
          {t("redirects.saveAll")}
        </button>
      </div>
      {msg ? <p className="st-ok">{msg}</p> : null}
    </div>
  );
}
