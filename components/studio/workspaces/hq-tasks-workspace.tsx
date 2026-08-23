"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckSquare2, LoaderCircle, Plus, Search } from "lucide-react";

type Task = {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  due_at?: string | null;
  company_id?: string | null;
  deal_id?: string | null;
  client_project_id?: string | null;
  estimated_minutes?: number | null;
  actual_minutes?: number | null;
};

type View = "my" | "today" | "upcoming" | "overdue" | "all";

function taskArray(value: unknown): Task[] {
  const candidate = Array.isArray(value)
    ? value
    : value && typeof value === "object" && "tasks" in value
      ? (value as { tasks?: unknown }).tasks
      : [];
  return Array.isArray(candidate) ? candidate.filter((row): row is Task => Boolean(row) && typeof row === "object" && "id" in row && "title" in row) : [];
}

async function request(endpoint: string, init?: RequestInit) {
  const response = await fetch(endpoint, init);
  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const error = payload && typeof payload === "object" && "error" in payload ? String((payload as { error: unknown }).error) : "Request failed";
    throw new Error(error);
  }
  return payload;
}

export function HqTasksWorkspace() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [view, setView] = useState<View>("today");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try { setTasks(taskArray(await request("/api/studio/tasks?limit=100"))); }
    catch (reason) { setError(reason instanceof Error ? reason.message : String(reason)); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("create") === "1") setCreating(true);
  }, []);

  const visible = useMemo(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const end = new Date(start.getTime() + 86_400_000);
    return tasks.filter((task) => {
      if (query && !task.title.toLocaleLowerCase().includes(query.toLocaleLowerCase())) return false;
      if (view === "all" || view === "my") return true;
      if (!task.due_at || task.status === "done") return false;
      const due = new Date(task.due_at);
      if (view === "today") return due >= start && due < end;
      if (view === "overdue") return due < start;
      return due >= end;
    }).sort((a, b) => {
      const priority = { urgent: 0, high: 1, normal: 2, medium: 2, low: 3 };
      const overdueA = a.due_at && new Date(a.due_at) < start ? 0 : 1;
      const overdueB = b.due_at && new Date(b.due_at) < start ? 0 : 1;
      return overdueA - overdueB || (priority[a.priority as keyof typeof priority] ?? 4) - (priority[b.priority as keyof typeof priority] ?? 4) || String(a.due_at || "9999").localeCompare(String(b.due_at || "9999"));
    });
  }, [query, tasks, view]);

  async function createTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    setError("");
    try {
      await request("/api/studio/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        title: values.title,
        description: values.description || null,
        priority: values.priority,
        dueAt: values.dueAt ? new Date(String(values.dueAt)).toISOString() : null,
        companyId: values.companyId || null,
        dealId: values.dealId || null,
        projectId: values.projectId || null,
        estimatedMinutes: values.estimatedMinutes ? Number(values.estimatedMinutes) : null,
      }) });
      setCreating(false);
      await load();
    } catch (reason) { setError(reason instanceof Error ? reason.message : String(reason)); }
  }

  async function updateStatus(id: string, status: string) {
    try {
      await request(`/api/studio/tasks/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      setTasks((rows) => rows.map((row) => row.id === id ? { ...row, status } : row));
    } catch (reason) { setError(reason instanceof Error ? reason.message : String(reason)); }
  }

  return <div className="st-hq-page">
    <div className="st-page-header"><div><p className="st-eyebrow">Delivery</p><h1 className="st-h1">Tasks</h1><p className="st-sub">The ordered list of what needs to happen next.</p></div><button className="st-btn primary" onClick={() => setCreating((value) => !value)}><Plus size={15} /> New task</button></div>
    <div className="st-tabs">{(["my", "today", "upcoming", "overdue", "all"] as View[]).map((item) => <button key={item} className={`st-tab ${view === item ? "active" : ""}`} onClick={() => setView(item)}>{item === "my" ? "My Tasks" : item[0].toUpperCase() + item.slice(1)}</button>)}</div>
    {creating ? <form className="st-card st-form st-task-quick-form" onSubmit={createTask}><div className="st-form-grid"><label className="st-label"><span>Title</span><input className="st-input" name="title" required /></label><label className="st-label"><span>Priority</span><select className="st-select" name="priority" defaultValue="normal"><option value="low">Low</option><option value="normal">Medium</option><option value="high">High</option><option value="urgent">Urgent</option></select></label><label className="st-label"><span>Due</span><input className="st-input" type="datetime-local" name="dueAt" /></label><label className="st-label"><span>Estimate, min</span><input className="st-input" type="number" min="1" name="estimatedMinutes" /></label><label className="st-label"><span>Company ID</span><input className="st-input" name="companyId" /></label><label className="st-label"><span>Deal ID</span><input className="st-input" name="dealId" /></label><label className="st-label"><span>Project ID</span><input className="st-input" name="projectId" /></label></div><label className="st-label"><span>Description</span><textarea className="st-textarea" name="description" /></label><div className="st-row"><button className="st-btn primary">Create task</button><button type="button" className="st-btn" onClick={() => setCreating(false)}>Cancel</button></div></form> : null}
    <div className="st-toolbar"><label className="st-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks…" /></label><span className="st-hq-count">{visible.length} tasks</span></div>
    {error ? <p className="st-error">{error}</p> : null}
    {loading ? <div className="st-state"><LoaderCircle className="st-spin" /><strong>Loading…</strong></div> : !visible.length ? <div className="st-state st-hq-empty"><CheckSquare2 /><strong>No tasks in this view</strong><span>Create a task or choose another time range.</span></div> : <div className="st-table-wrap"><table className="st-table"><thead><tr><th>Task</th><th>Status</th><th>Priority</th><th>Due</th><th>Relation</th><th>Time</th></tr></thead><tbody>{visible.map((task) => <tr key={task.id}><td><strong>{task.title}</strong>{task.description ? <small className="st-cell-sub">{task.description}</small> : null}</td><td><select className="st-select st-inline-select" value={task.status} onChange={(event) => void updateStatus(task.id, event.target.value)}><option value="todo">Todo</option><option value="in_progress">In Progress</option><option value="blocked">Blocked</option><option value="waiting">Waiting</option><option value="done">Done</option></select></td><td><span className={`st-status st-status-${task.priority}`}>{task.priority}</span></td><td>{task.due_at ? new Date(task.due_at).toLocaleString() : "—"}</td><td>{task.client_project_id ? "Project" : task.deal_id ? "Deal" : task.company_id ? "Company" : "—"}</td><td>{task.actual_minutes || 0}/{task.estimated_minutes || 0}m</td></tr>)}</tbody></table></div>}
  </div>;
}
