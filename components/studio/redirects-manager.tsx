"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type RedirectRow = {
  id?: string;
  from_path: string;
  to_path: string;
  permanent: boolean;
  enabled: boolean;
};

export function RedirectsManager({ initial }: { initial: RedirectRow[] }) {
  const router = useRouter();
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
    setMsg(res.ok ? "Saved" : "Failed");
    if (res.ok) {
      await fetch("/api/studio/revalidate", { method: "POST" });
      router.refresh();
    }
  }

  async function addRow() {
    if (!fromPath.startsWith("/") || !toPath.startsWith("/")) {
      setMsg("Paths must start with /");
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
            <th>From</th>
            <th>To</th>
            <th>301</th>
            <th>On</th>
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
                  Remove
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
          Add
        </button>
        <button type="button" className="st-btn primary" onClick={saveAll}>
          Save all
        </button>
      </div>
      {msg ? <p className="st-ok">{msg}</p> : null}
    </div>
  );
}
