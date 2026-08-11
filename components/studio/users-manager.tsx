"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStudioI18n, type StudioMessageKey } from "@/lib/studio/i18n";

type UserRow = { id: string; email: string; name: string | null; role: string };

const ROLES = ["owner", "editor", "sales"] as const;

export function UsersManager({ initial }: { initial: UserRow[] }) {
  const router = useRouter();
  const { t } = useStudioI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("editor");
  const [msg, setMsg] = useState("");

  function roleLabel(value: string) {
    return t(`role.${value}` as StudioMessageKey);
  }

  async function invite() {
    setMsg("");
    const res = await fetch("/api/studio/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, role }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(data.error || t("users.createFailed"));
      return;
    }
    setMsg(t("users.created"));
    setEmail("");
    setPassword("");
    setName("");
    router.refresh();
  }

  async function setUserRole(id: string, nextRole: string) {
    const res = await fetch("/api/studio/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role: nextRole }),
    });
    if (res.ok) router.refresh();
    else setMsg(t("users.roleFailed"));
  }

  return (
    <div className="st-form" style={{ maxWidth: 720 }}>
      <table className="st-table">
        <thead>
          <tr>
            <th>{t("users.email")}</th>
            <th>{t("users.name")}</th>
            <th>{t("users.role")}</th>
          </tr>
        </thead>
        <tbody>
          {initial.map((u) => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.name}</td>
              <td>
                <select
                  className="st-select"
                  value={u.role}
                  onChange={(e) => setUserRole(u.id, e.target.value)}
                >
                  {ROLES.map((value) => (
                    <option key={value} value={value}>
                      {roleLabel(value)}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ fontSize: "1.05rem" }}>{t("users.invite")}</h2>
      <label className="st-label">
        {t("users.email")}
        <input className="st-input" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label className="st-label">
        {t("users.tempPassword")}
        <input className="st-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <label className="st-label">
        {t("users.name")}
        <input className="st-input" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label className="st-label">
        {t("users.role")}
        <select className="st-select" value={role} onChange={(e) => setRole(e.target.value)}>
          {ROLES.map((value) => (
            <option key={value} value={value}>
              {roleLabel(value)}
            </option>
          ))}
        </select>
      </label>
      <button type="button" className="st-btn primary" onClick={invite}>
        {t("users.create")}
      </button>
      {msg ? <p className="st-ok">{msg}</p> : null}
    </div>
  );
}
