"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type UserRow = { id: string; email: string; name: string | null; role: string };

export function UsersManager({ initial }: { initial: UserRow[] }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("editor");
  const [msg, setMsg] = useState("");

  async function invite() {
    setMsg("");
    const res = await fetch("/api/studio/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, role }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(data.error || "Failed");
      return;
    }
    setMsg("User created");
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
    else setMsg("Role update failed");
  }

  return (
    <div className="st-form" style={{ maxWidth: 720 }}>
      <table className="st-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
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
                  <option value="owner">owner</option>
                  <option value="editor">editor</option>
                  <option value="sales">sales</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ fontSize: "1.05rem" }}>Invite user</h2>
      <label className="st-label">
        Email
        <input className="st-input" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label className="st-label">
        Temporary password
        <input className="st-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <label className="st-label">
        Name
        <input className="st-input" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label className="st-label">
        Role
        <select className="st-select" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="editor">editor</option>
          <option value="sales">sales</option>
          <option value="owner">owner</option>
        </select>
      </label>
      <button type="button" className="st-btn primary" onClick={invite}>
        Create user
      </button>
      {msg ? <p className="st-ok">{msg}</p> : null}
    </div>
  );
}
