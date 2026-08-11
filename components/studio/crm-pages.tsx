"use client";

import Link from "next/link";
import {
  AlertCircle, Archive, ArrowRight, Bell, BriefcaseBusiness, CalendarClock,
  CheckCircle2, CheckSquare2, Clock3, FileText, FolderOpen, History, LayoutGrid,
  List, LoaderCircle, Paperclip, Pencil, Plus, RefreshCw, RotateCcw, Search, Settings2, Timer,
  Trash2, Users, WalletCards, Workflow, X, type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { studioPath } from "@/lib/studio/path";
import {
  formatStudioDate,
  labelPriority,
  labelStatus,
  useStudioI18n,
  type StudioLocale,
  type StudioMessageKey,
} from "@/lib/studio/i18n";

type Row = Record<string, unknown>;
type ModuleKind = "tasks" | "automations" | "inbox";
type CreateKind = "case" | "task" | "automation" | "document" | "note" | "finance" | "time";

type CrmCopyKey = "cases" | "casesSub" | "tasks" | "tasksSub" | "documents" | "documentsSub" | "automations" | "automationsSub" | "inbox" | "inboxSub" | "reports" | "reportsSub" | "newCase" | "newTask" | "newAutomation" | "newDocument" | "markRead" | "upload" | "noCases" | "noTasks" | "noCompletedTasks" | "noDeletedTasks" | "noDocuments" | "noAutomations" | "noInbox" | "client" | "owner" | "deadline" | "status" | "priority" | "case" | "updated" | "type" | "due" | "assignee" | "title" | "description" | "search" | "create" | "close" | "cancel" | "openCase" | "active" | "won" | "delivery" | "done" | "trash" | "deleteTask" | "restoreTask" | "confirmDeleteTask" | "deletedAt" | "overview" | "timeline" | "materials" | "specification" | "team" | "finance" | "time" | "settings" | "workspace" | "backCases" | "saveChanges" | "addNote" | "addFinance" | "addTime" | "addItem" | "publishVersion" | "section" | "item" | "acceptance" | "requestFailed" | "saved" | "empty" | "amount" | "minutes" | "actions" | "trigger" | "name" | "dueWithin" | "notificationTitle" | "taskDueTrigger" | "stage" | "file" | "category" | "documentType" | "documentGeneric" | "versions" | "integrations" | "available" | "unavailable" | "general" | "pipelines" | "workspaceName" | "timezone" | "currency" | "revenue" | "teamLoad" | "totalPipeline" | "openTasks" | "overdue" | "loggedHours" | "unread" | "taskBreakdown" | "financeBreakdown" | "timeBreakdown" | "billable" | "nonBillable" | "addMember" | "memberRole" | "addStage" | "stageKey" | "color" | "order" | "daysBadge" | "eyebrow";
const CRM_COPY_KEYS = ["cases", "casesSub", "tasks", "tasksSub", "documents", "documentsSub", "automations", "automationsSub", "inbox", "inboxSub", "reports", "reportsSub", "newCase", "newTask", "newAutomation", "newDocument", "markRead", "upload", "noCases", "noTasks", "noCompletedTasks", "noDeletedTasks", "noDocuments", "noAutomations", "noInbox", "client", "owner", "deadline", "status", "priority", "case", "updated", "type", "due", "assignee", "title", "description", "search", "create", "close", "cancel", "openCase", "active", "won", "delivery", "done", "trash", "deleteTask", "restoreTask", "confirmDeleteTask", "deletedAt", "overview", "timeline", "materials", "specification", "team", "finance", "time", "settings", "workspace", "backCases", "saveChanges", "addNote", "addFinance", "addTime", "addItem", "publishVersion", "section", "item", "acceptance", "requestFailed", "saved", "empty", "amount", "minutes", "actions", "trigger", "name", "dueWithin", "notificationTitle", "taskDueTrigger", "stage", "file", "category", "documentType", "documentGeneric", "versions", "integrations", "available", "unavailable", "general", "pipelines", "workspaceName", "timezone", "currency", "revenue", "teamLoad", "totalPipeline", "openTasks", "overdue", "loggedHours", "unread", "taskBreakdown", "financeBreakdown", "timeBreakdown", "billable", "nonBillable", "addMember", "memberRole", "addStage", "stageKey", "color", "order", "daysBadge", "eyebrow"] as const satisfies readonly CrmCopyKey[];

function useCrmCopy() {
  const { t } = useStudioI18n();
  return Object.fromEntries(
    CRM_COPY_KEYS.map((key) => [key, t(("crm." + key) as StudioMessageKey)]),
  ) as Record<CrmCopyKey, string>;
}
function text(value: unknown, fallback = "—") {
  return typeof value === "string" || typeof value === "number" ? String(value) : fallback;
}
function nested(value: unknown, key: string, fallback = "—") {
  return value && typeof value === "object" && !Array.isArray(value) ? text((value as Row)[key], fallback) : fallback;
}
function rowsFrom(payload: unknown): Row[] {
  if (Array.isArray(payload)) return payload.filter((row): row is Row => Boolean(row) && typeof row === "object");
  if (!payload || typeof payload !== "object") return [];
  const row = payload as Row;
  for (const key of ["data", "items", "cases", "tasks", "documents", "automations", "notifications", "events"]) {
    if (Array.isArray(row[key])) return row[key] as Row[];
  }
  return [];
}
function date(value: unknown, locale: StudioLocale, withTime = false) {
  return formatStudioDate(value == null ? null : String(value), locale, withTime);
}
function localDate(value: unknown) { return value ? String(value).slice(0, 10) : ""; }
function localDateTime(value: unknown) {
  if (!value) return "";
  const dateValue = new Date(String(value));
  if (Number.isNaN(dateValue.getTime())) return "";
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${dateValue.getFullYear()}-${pad(dateValue.getMonth() + 1)}-${pad(dateValue.getDate())}T${pad(dateValue.getHours())}:${pad(dateValue.getMinutes())}`;
}
function caseStage(row: Row) { return nested(row.pipeline_stages, "key", "active"); }
function caseOwner(row: Row) { return nested(row.profiles, "name", text(row.owner_name)); }

async function requestJson(endpoint: string, init?: RequestInit) {
  const response = await fetch(endpoint, init);
  if (!response.ok) {
    let detail = "";
    try { detail = text(((await response.json()) as Row).error, ""); } catch { /* response was not JSON */ }
    throw new Error(detail || `${response.status} ${response.statusText}`.trim());
  }
  return response.status === 204 ? null : response.json();
}

function useApi(endpoint: string, enabled = true) {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    if (!enabled || !endpoint) { setLoading(false); return; }
    setLoading(true); setError("");
    try { setData(await requestJson(endpoint, { headers: { Accept: "application/json" } })); }
    catch (reason) { setError(reason instanceof Error ? reason.message : String(reason)); }
    finally { setLoading(false); }
  }, [enabled, endpoint]);
  useEffect(() => { void load(); }, [load]);
  return { data, loading, error, reload: load };
}

function PageHeader(props: { eyebrow: string; title: string; subtitle: string; action?: React.ReactNode }) {
  return <div className="st-page-header"><div><p className="st-eyebrow">{props.eyebrow}</p><h1 className="st-h1">{props.title}</h1><p className="st-sub">{props.subtitle}</p></div>{props.action}</div>;
}
function StatusBadge({ value, kind = "status" }: { value: unknown; kind?: "status" | "priority" }) {
  const { locale } = useStudioI18n();
  const raw = text(value, kind === "priority" ? "normal" : "active");
  const label = kind === "priority" ? labelPriority(locale, raw) : labelStatus(locale, raw);
  return <span className={`st-status st-status-${raw.replaceAll("_", "-")}`}>{label}</span>;
}
function StateView(props: { loading: boolean; error: string; empty: boolean; onRetry: () => void; emptyText?: string; children: React.ReactNode }) {
  const c = useCrmCopy();
  const { t } = useStudioI18n();
  if (props.loading) return <div className="st-state"><LoaderCircle className="st-spin" /><strong>{t("common.loading")}</strong></div>;
  if (props.error) return <div className="st-state st-state-error"><AlertCircle /><strong>{c.requestFailed}</strong><span>{props.error}</span><button className="st-btn" onClick={props.onRetry}><RefreshCw size={15} />{t("common.retry")}</button></div>;
  if (props.empty) return <div className="st-state"><Archive /><strong>{props.emptyText || c.empty}</strong></div>;
  return <>{props.children}</>;
}

const priorities = ["low", "normal", "high", "urgent"];
function PriorityField({ defaultValue = "normal" }: { defaultValue?: string }) {
  const c = useCrmCopy();
  const { locale } = useStudioI18n();
  return <label className="st-label"><span>{c.priority}</span><select className="st-select" name="priority" defaultValue={defaultValue}>{priorities.map((value) => <option key={value} value={value}>{labelPriority(locale, value)}</option>)}</select></label>;
}

function CreateModal({ kind, endpoint, caseId, cases = [], onClose, onSaved }: {
  kind: CreateKind; endpoint: string; caseId?: string; cases?: Row[]; onClose: () => void; onSaved: () => void;
}) {
  const c = useCrmCopy();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const titles: Record<CreateKind, string> = {
    case: c.newCase, task: c.newTask, automation: c.newAutomation, document: c.newDocument,
    note: c.addNote, finance: c.addFinance, time: c.addTime,
  };
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError("");
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      let payload: Row;
      if (kind === "case") payload = { title: values.title, description: values.description, clientName: values.clientName, dueDate: values.dueDate || null, priority: values.priority };
      else if (kind === "task") payload = { caseId: caseId || values.caseId || null, title: values.title, description: values.description, priority: values.priority, dueAt: values.dueAt ? new Date(String(values.dueAt)).toISOString() : null };
      else if (kind === "automation") {
        payload = {
          name: values.name,
          triggerType: "task_due",
          conditions: { dueWithinHours: Number(values.dueWithinHours) },
          actions: [{ type: "notification", title: values.notificationTitle || null }],
        };
      } else if (kind === "document") payload = { caseId: caseId || values.caseId, title: values.title, documentType: values.documentType, body: values.body };
      else if (kind === "note") payload = { caseId, eventType: "manual.note", payload: { title: values.title, description: values.description } };
      else if (kind === "finance") payload = { caseId, title: values.title, amount: Number(values.amount), currency: values.currency, status: "planned", dueDate: values.dueDate || null };
      else payload = { caseId, minutes: Number(values.minutes), description: values.description, entryDate: values.entryDate || undefined, billable: values.billable === "on" };
      await requestJson(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      onSaved();
    } catch (reason) { setError(reason instanceof Error ? reason.message : String(reason)); }
    finally { setSaving(false); }
  }
  return <div className="st-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <section className="st-modal" role="dialog" aria-modal="true"><button className="st-icon-btn st-modal-close" onClick={onClose} aria-label={c.close}><X size={17} /></button><h2>{titles[kind]}</h2>
      <form className="st-form" onSubmit={submit}>
        {(kind === "case" || kind === "task" || kind === "document" || kind === "note" || kind === "finance") && <label className="st-label"><span>{c.title}</span><input className="st-input" name="title" required /></label>}
        {kind === "automation" && <label className="st-label"><span>{c.name}</span><input className="st-input" name="name" required /></label>}
        {kind === "case" && <><label className="st-label"><span>{c.client}</span><input className="st-input" name="clientName" required /></label><PriorityField /><label className="st-label"><span>{c.deadline}</span><input className="st-input" name="dueDate" type="date" /></label></>}
        {kind === "task" && <>{!caseId && <label className="st-label"><span>{c.case}</span><select className="st-select" name="caseId" defaultValue=""><option value="">—</option>{cases.map((row) => <option key={text(row.id)} value={text(row.id)}>{text(row.title)}</option>)}</select></label>}<PriorityField /><label className="st-label"><span>{c.due}</span><input className="st-input" name="dueAt" type="datetime-local" /></label></>}
        {(kind === "case" || kind === "task" || kind === "note" || kind === "time") && <label className="st-label"><span>{c.description}</span><textarea className="st-textarea" name="description" /></label>}
        {kind === "automation" && <><label className="st-label"><span>{c.trigger}</span><input className="st-input" value={c.taskDueTrigger} readOnly /></label><label className="st-label"><span>{c.dueWithin}</span><input className="st-input" name="dueWithinHours" type="number" min="1" max="720" defaultValue="24" required /></label><label className="st-label"><span>{c.notificationTitle}</span><input className="st-input" name="notificationTitle" /></label></>}
        {kind === "document" && <><label className="st-label"><span>{c.documentType}</span><select className="st-select" name="documentType"><option value="specification">{c.specification}</option><option value="document">{c.documentGeneric}</option></select></label><label className="st-label"><span>{c.description}</span><textarea className="st-textarea" name="body" /></label></>}
        {kind === "finance" && <><label className="st-label"><span>{c.amount}</span><input className="st-input" name="amount" type="number" min="0" step="0.01" required /></label><label className="st-label"><span>{c.currency}</span><input className="st-input" name="currency" defaultValue="EUR" maxLength={3} /></label><label className="st-label"><span>{c.due}</span><input className="st-input" name="dueDate" type="date" /></label></>}
        {kind === "time" && <><label className="st-label"><span>{c.minutes}</span><input className="st-input" name="minutes" type="number" min="1" max="1440" required /></label><label className="st-label"><span>{c.updated}</span><input className="st-input" name="entryDate" type="date" /></label><label className="st-check"><input name="billable" type="checkbox" defaultChecked />{c.billable}</label></>}
        {error && <p className="st-error">{c.requestFailed}: {error}</p>}
        <div className="st-row"><button className="st-btn primary" disabled={saving}>{saving && <LoaderCircle className="st-spin" size={15} />}<Plus size={15} />{c.create}</button><button type="button" className="st-btn subtle" onClick={onClose}>{c.cancel}</button></div>
      </form>
    </section>
  </div>;
}

function EditTaskModal({
  task,
  cases = [],
  users = [],
  lockCaseId,
  onClose,
  onSaved,
}: {
  task: Row;
  cases?: Row[];
  users?: Row[];
  lockCaseId?: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const c = useCrmCopy();
  const { locale, t } = useStudioI18n();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const statuses = ["todo", "in_progress", "blocked", "done", "cancelled"] as const;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      await requestJson(`/api/studio/tasks/${encodeURIComponent(text(task.id))}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          description: values.description || null,
          priority: values.priority,
          status: values.status,
          caseId: lockCaseId || values.caseId || null,
          assigneeId: values.assigneeId || null,
          dueAt: values.dueAt ? new Date(String(values.dueAt)).toISOString() : null,
        }),
      });
      onSaved();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="st-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <section className="st-modal" role="dialog" aria-modal="true">
        <button className="st-icon-btn st-modal-close" onClick={onClose} aria-label={c.close}><X size={17} /></button>
        <h2>{t("common.edit")}</h2>
        <form className="st-form" onSubmit={submit}>
          <label className="st-label"><span>{c.title}</span><input className="st-input" name="title" required defaultValue={text(task.title, "")} /></label>
          {!lockCaseId && (
            <label className="st-label">
              <span>{c.case}</span>
              <select className="st-select" name="caseId" defaultValue={text(task.case_id, "")}>
                <option value="">—</option>
                {cases.map((row) => <option key={text(row.id)} value={text(row.id)}>{text(row.title)}</option>)}
              </select>
            </label>
          )}
          <label className="st-label">
            <span>{c.assignee}</span>
            <select className="st-select" name="assigneeId" defaultValue={text(task.assignee_id, "")}>
              <option value="">—</option>
              {users.map((row) => <option key={text(row.id)} value={text(row.id)}>{text(row.name) || text(row.id)}</option>)}
            </select>
          </label>
          <PriorityField defaultValue={text(task.priority, "normal")} />
          <label className="st-label">
            <span>{c.status}</span>
            <select className="st-select" name="status" defaultValue={text(task.status, "todo")}>
              {statuses.map((value) => <option key={value} value={value}>{labelStatus(locale, value)}</option>)}
            </select>
          </label>
          <label className="st-label"><span>{c.due}</span><input className="st-input" name="dueAt" type="datetime-local" defaultValue={localDateTime(task.due_at)} /></label>
          <label className="st-label"><span>{c.description}</span><textarea className="st-textarea" name="description" defaultValue={text(task.description, "")} /></label>
          {error && <p className="st-error">{c.requestFailed}: {error}</p>}
          <div className="st-row">
            <button className="st-btn primary" disabled={saving}>{saving && <LoaderCircle className="st-spin" size={15} />}{c.saveChanges}</button>
            <button type="button" className="st-btn subtle" onClick={onClose}>{c.cancel}</button>
          </div>
        </form>
      </section>
    </div>
  );
}

export function ModulePage({ kind, canCreate = true }: { kind: ModuleKind; canCreate?: boolean }) {
  const c = useCrmCopy();
  const { locale, t } = useStudioI18n();
  type TaskView = "active" | "done" | "deleted";
  const [taskView, setTaskView] = useState<TaskView>("active");
  const config = {
    tasks: { endpoint: "/api/studio/tasks", title: c.tasks, sub: c.tasksSub, empty: c.noTasks, action: c.newTask, icon: CheckSquare2 },
    automations: { endpoint: "/api/studio/automations", title: c.automations, sub: c.automationsSub, empty: c.noAutomations, action: c.newAutomation, icon: Workflow },
    inbox: { endpoint: "/api/studio/notifications", title: c.inbox, sub: c.inboxSub, empty: c.noInbox, action: c.markRead, icon: Bell },
  }[kind];
  const tasksEndpoint = kind === "tasks" ? `${config.endpoint}?view=${taskView}` : config.endpoint;
  const api = useApi(tasksEndpoint);
  const casesApi = useApi("/api/studio/cases?limit=100", kind === "tasks");
  const usersApi = useApi("/api/studio/users", kind === "tasks" && canCreate);
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingTask, setEditingTask] = useState<Row | null>(null);
  const [actionError, setActionError] = useState("");
  const cases = rowsFrom(casesApi.data);
  const users = rowsFrom(usersApi.data);
  const caseNames = useMemo(() => new Map(cases.map((row) => [text(row.id), text(row.title)])), [cases]);
  const rows = rowsFrom(api.data).filter((row) => JSON.stringify(row).toLowerCase().includes(query.toLowerCase()));
  const emptyText =
    kind === "tasks"
      ? taskView === "done"
        ? c.noCompletedTasks
        : taskView === "deleted"
          ? c.noDeletedTasks
          : c.noTasks
      : config.empty;
  async function primaryAction() {
    if (kind !== "inbox") { setShowCreate(true); return; }
    setActionError("");
    try { await requestJson(config.endpoint, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ all: true }) }); await api.reload(); }
    catch (reason) { setActionError(reason instanceof Error ? reason.message : String(reason)); }
  }
  async function updateTask(id: string, status: string) {
    setActionError("");
    try {
      await requestJson(`/api/studio/tasks/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await api.reload();
    } catch (reason) {
      setActionError(reason instanceof Error ? reason.message : String(reason));
    }
  }
  async function deleteTask(id: string) {
    if (!confirm(c.confirmDeleteTask)) return;
    setActionError("");
    try {
      await requestJson(`/api/studio/tasks/${encodeURIComponent(id)}`, { method: "DELETE" });
      await api.reload();
    } catch (reason) {
      setActionError(reason instanceof Error ? reason.message : String(reason));
    }
  }
  async function restoreTask(id: string) {
    setActionError("");
    try {
      await requestJson(`/api/studio/tasks/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore" }),
      });
      await api.reload();
    } catch (reason) {
      setActionError(reason instanceof Error ? reason.message : String(reason));
    }
  }
  async function toggleAutomation(id: string, enabled: boolean) {
    setActionError("");
    try {
      await requestJson("/api/studio/automations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, enabled }),
      });
      await api.reload();
    } catch (reason) {
      setActionError(reason instanceof Error ? reason.message : String(reason));
    }
  }
  return <>
    <PageHeader eyebrow={c.eyebrow} title={config.title} subtitle={config.sub} action={(kind === "inbox" || canCreate) ? <button className="st-btn primary" onClick={primaryAction}>{kind === "inbox" ? <CheckCircle2 size={16} /> : <Plus size={16} />}{config.action}</button> : undefined} />
    {actionError && <p className="st-error">{c.requestFailed}: {actionError}</p>}
    <div className="st-toolbar">
      <label className="st-search"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={c.search} aria-label={t("common.search")} /></label>
      {kind === "tasks" ? (
        <div className="st-segmented">
          <button type="button" className={taskView === "active" ? "active" : ""} onClick={() => setTaskView("active")}>{c.active}</button>
          <button type="button" className={taskView === "done" ? "active" : ""} onClick={() => setTaskView("done")}>{c.done}</button>
          <button type="button" className={taskView === "deleted" ? "active" : ""} onClick={() => setTaskView("deleted")}>{c.trash}</button>
        </div>
      ) : null}
      <button className="st-icon-btn" onClick={api.reload}><RefreshCw size={16} /></button>
    </div>
    <StateView loading={api.loading || (kind === "tasks" && casesApi.loading)} error={api.error || (kind === "tasks" ? casesApi.error : "")} empty={!rows.length} emptyText={emptyText} onRetry={() => { void api.reload(); if (kind === "tasks") void casesApi.reload(); }}>
      <div className="st-table-wrap"><table className="st-table"><thead><tr>
        {kind === "tasks" ? <><th>{c.title}</th><th>{c.case}</th><th>{c.assignee}</th><th>{c.priority}</th><th>{taskView === "deleted" ? c.deletedAt : c.due}</th><th>{c.status}</th>{canCreate ? <th aria-label={c.actions} /> : null}</> :
         kind === "automations" ? <><th>{c.name}</th><th>{c.trigger}</th><th>{c.actions}</th><th>{c.status}</th></> :
         <><th>{c.title}</th><th>{c.type}</th><th>{c.description}</th><th>{c.updated}</th><th>{c.status}</th></>}
      </tr></thead><tbody>{rows.map((row, index) => <tr key={text(row.id, String(index))}>
        {kind === "tasks" ? <><td><strong>{text(row.title)}</strong><small className="st-cell-sub">{text(row.description, "")}</small></td><td>{caseNames.get(text(row.case_id)) || text(row.case_id)}</td><td>{nested(row.profiles, "name")}</td><td><StatusBadge value={row.priority} kind="priority" /></td><td>{date(taskView === "deleted" ? row.deleted_at : row.due_at, locale, true)}</td><td>{canCreate && taskView !== "deleted" ? <select className="st-select st-status-select" key={`${text(row.id)}-${text(row.status)}`} defaultValue={text(row.status, "todo")} onChange={(event) => void updateTask(text(row.id), event.target.value)}><option value="todo">{labelStatus(locale, "todo")}</option><option value="in_progress">{labelStatus(locale, "in_progress")}</option><option value="blocked">{labelStatus(locale, "blocked")}</option><option value="done">{labelStatus(locale, "done")}</option><option value="cancelled">{labelStatus(locale, "cancelled")}</option></select> : <StatusBadge value={row.status} />}</td>{canCreate ? <td><div className="st-record-actions">{taskView === "deleted" ? <button type="button" className="st-icon-btn" onClick={() => void restoreTask(text(row.id))} aria-label={c.restoreTask} title={c.restoreTask}><RotateCcw size={15} /></button> : <><button type="button" className="st-icon-btn" onClick={() => setEditingTask(row)} aria-label={t("common.edit")} title={t("common.edit")}><Pencil size={15} /></button><button type="button" className="st-icon-btn danger" onClick={() => void deleteTask(text(row.id))} aria-label={c.deleteTask} title={c.deleteTask}><Trash2 size={15} /></button></>}</div></td> : null}</> :
         kind === "automations" ? <><td><strong>{text(row.name)}</strong></td><td>{text(row.trigger_type)}</td><td><code>{Array.isArray(row.actions) ? row.actions.length : 0}</code></td><td><button className="st-btn subtle" onClick={() => void toggleAutomation(text(row.id), row.enabled === false)}><StatusBadge value={row.enabled === false ? "disabled" : "active"} /></button></td></> :
         <><td><strong>{text(row.title)}</strong></td><td>{text(row.type)}</td><td>{text(row.body ?? row.message ?? row.description, "")}</td><td>{date(row.created_at, locale, true)}</td><td><StatusBadge value={row.read_at ? "read" : "unread"} /></td></>}
      </tr>)}</tbody></table></div>
    </StateView>
    {canCreate && showCreate && <CreateModal kind={kind === "tasks" ? "task" : "automation"} endpoint={config.endpoint} cases={cases} onClose={() => setShowCreate(false)} onSaved={() => { setShowCreate(false); void api.reload(); }} />}
    {canCreate && editingTask && <EditTaskModal task={editingTask} cases={cases} users={users} onClose={() => setEditingTask(null)} onSaved={() => { setEditingTask(null); void api.reload(); }} />}
  </>;
}

export function DocumentsPage({ canCreate = true }: { canCreate?: boolean } = {}) {
  const c = useCrmCopy();
  const { locale } = useStudioI18n();
  const casesApi = useApi("/api/studio/cases?limit=100");
  const cases = rowsFrom(casesApi.data);
  const [caseId, setCaseId] = useState("");
  useEffect(() => { if (!caseId && cases[0]?.id) setCaseId(text(cases[0].id)); }, [caseId, cases]);
  const api = useApi(`/api/studio/documents?caseId=${encodeURIComponent(caseId)}`, Boolean(caseId));
  const documents = rowsFrom(api.data);
  const [showCreate, setShowCreate] = useState(false);
  const [expanded, setExpanded] = useState("");
  return <>
    <PageHeader eyebrow={c.eyebrow} title={c.documents} subtitle={c.documentsSub} action={canCreate ? <button className="st-btn primary" disabled={!caseId} onClick={() => setShowCreate(true)}><Plus size={16} />{c.newDocument}</button> : undefined} />
    <div className="st-toolbar"><label className="st-label st-case-picker"><span>{c.case}</span><select className="st-select" value={caseId} onChange={(e) => setCaseId(e.target.value)}><option value="">—</option>{cases.map((row) => <option key={text(row.id)} value={text(row.id)}>{text(row.title)}</option>)}</select></label><button className="st-icon-btn" onClick={api.reload}><RefreshCw size={16} /></button></div>
    <StateView loading={casesApi.loading || api.loading} error={casesApi.error || api.error} empty={!documents.length} emptyText={c.noDocuments} onRetry={() => { void casesApi.reload(); void api.reload(); }}>
      <div className="st-record-list">{documents.map((row, index) => {
        const versions = Array.isArray(row.document_versions) ? row.document_versions as Row[] : [];
        const open = expanded === text(row.id);
        return <article className="st-document-record" key={text(row.id, String(index))}><button className="st-document-head" onClick={() => setExpanded(open ? "" : text(row.id))}><span><strong>{text(row.title)}</strong><small>{text(row.document_type)} · v{text(row.current_version, "1")} · {date(row.updated_at, locale)}</small></span><StatusBadge value={row.status} /></button>{open && <div className="st-document-versions"><h3>{c.versions}</h3>{versions.sort((a, b) => Number(b.version) - Number(a.version)).map((version) => <div key={text(version.id)}><strong>v{text(version.version)}</strong><small>{date(version.created_at, locale, true)}</small><p>{text(version.change_summary, "")}</p><pre>{text(version.body, "")}</pre></div>)}</div>}</article>;
      })}</div>
    </StateView>
    {canCreate && showCreate && <CreateModal kind="document" endpoint="/api/studio/documents" caseId={caseId} onClose={() => setShowCreate(false)} onSaved={() => { setShowCreate(false); void api.reload(); }} />}
  </>;
}

const CASE_COLUMNS = [
  { id: "active", statuses: ["intake", "new", "active", "discovery"] },
  { id: "won", statuses: ["proposal", "approval", "won"] },
  { id: "delivery", statuses: ["in_progress", "delivery", "review"] },
  { id: "done", statuses: ["completed", "done", "archived"] },
] as const;

export function CasesPage({ canCreate = true }: { canCreate?: boolean } = {}) {
  const c = useCrmCopy();
  const { locale, t } = useStudioI18n();
  const api = useApi("/api/studio/cases");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"board" | "list">("board");
  const [showCreate, setShowCreate] = useState(false);
  const cases = rowsFrom(api.data).filter((row) => JSON.stringify(row).toLowerCase().includes(query.toLowerCase()));
  return <>
    <PageHeader eyebrow={c.eyebrow} title={c.cases} subtitle={c.casesSub} action={canCreate ? <button className="st-btn primary" onClick={() => setShowCreate(true)}><Plus size={16} />{c.newCase}</button> : undefined} />
    <div className="st-toolbar"><label className="st-search"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={c.search} aria-label={t("common.search")} /></label><div className="st-segmented"><button className={view === "board" ? "active" : ""} onClick={() => setView("board")}><LayoutGrid size={15} />{t("common.board")}</button><button className={view === "list" ? "active" : ""} onClick={() => setView("list")}><List size={15} />{t("common.list")}</button></div><button className="st-icon-btn" onClick={api.reload}><RefreshCw size={16} /></button></div>
    <StateView loading={api.loading} error={api.error} empty={!cases.length} emptyText={c.noCases} onRetry={api.reload}>
      {view === "board" ? <div className="st-kanban">{CASE_COLUMNS.map((column) => {
        const items = cases.filter((row) => column.statuses.includes(caseStage(row) as never));
        return <section className="st-kanban-column" key={column.id}><header><span>{c[column.id]}</span><b>{items.length}</b></header><div>{items.map((row) => <CaseCard key={text(row.id)} row={row} locale={locale} />)}</div></section>;
      })}</div> : <div className="st-table-wrap"><table className="st-table"><thead><tr><th>{c.case}</th><th>{c.client}</th><th>{c.owner}</th><th>{c.priority}</th><th>{c.deadline}</th><th>{c.stage}</th></tr></thead><tbody>{cases.map((row) => <tr key={text(row.id)}><td><Link href={studioPath(`/cases/${text(row.id)}`)}><strong>{text(row.title)}</strong></Link></td><td>{text(row.client_name)}</td><td>{caseOwner(row)}</td><td><StatusBadge value={row.priority} kind="priority" /></td><td>{date(row.due_date, locale)}</td><td><StatusBadge value={caseStage(row)} /></td></tr>)}</tbody></table></div>}
    </StateView>
    {canCreate && showCreate && <CreateModal kind="case" endpoint="/api/studio/cases" onClose={() => setShowCreate(false)} onSaved={() => { setShowCreate(false); void api.reload(); }} />}
  </>;
}
function CaseCard({ row, locale }: { row: Row; locale: StudioLocale }) {
  const c = useCrmCopy();
  return <Link href={studioPath(`/cases/${text(row.id)}`)} className="st-case-card"><div className="st-case-card-top"><StatusBadge value={caseStage(row)} /><span>{text(row.case_number, "")}</span></div><strong>{text(row.title)}</strong><span>{text(row.client_name)}</span><footer><span><Users size={13} />{caseOwner(row)}</span><span><CalendarClock size={13} />{date(row.due_date, locale)}</span></footer><span className="st-case-open">{c.openCase}<ArrowRight size={14} /></span></Link>;
}

type CaseTab = "overview" | "timeline" | "tasks" | "materials" | "specification" | "team" | "finance" | "time" | "settings";
const TABS: Array<{ id: CaseTab; icon: LucideIcon }> = [
  { id: "overview", icon: FolderOpen }, { id: "timeline", icon: History }, { id: "tasks", icon: CheckSquare2 },
  { id: "materials", icon: Paperclip }, { id: "specification", icon: FileText }, { id: "team", icon: Users },
  { id: "finance", icon: WalletCards }, { id: "time", icon: Timer }, { id: "settings", icon: Settings2 },
];

type CasePermissions = {
  cases: boolean; tasks: boolean; files: boolean; documents: boolean; finance: boolean; time: boolean;
};
export function CaseWorkspace({
  caseId,
  permissions = { cases: true, tasks: true, files: true, documents: true, finance: true, time: true },
}: {
  caseId: string;
  permissions?: CasePermissions;
}) {
  const c = useCrmCopy();
  const { locale } = useStudioI18n();
  const [tab, setTab] = useState<CaseTab>("overview");
  const api = useApi(`/api/studio/cases/${caseId}`);
  const stagesApi = useApi("/api/studio/pipeline-stages");
  const detail = api.data && typeof api.data === "object" ? api.data as Row : {};
  const stages = rowsFrom(stagesApi.data);
  const visibleTabs = TABS.filter(({ id }) =>
    (id !== "finance" || permissions.finance) &&
    (id !== "time" || permissions.time) &&
    (id !== "settings" || permissions.cases),
  );
  return <>
    <Link href={studioPath("/cases")} className="st-back-link">← {c.backCases}</Link>
    <PageHeader eyebrow={c.workspace} title={text(detail.title, `#${caseId}`)} subtitle={`${text(detail.client_name)} · ${text(detail.case_number, caseId)}`} action={<StatusBadge value={nested(detail.pipeline_stages, "key")} />} />
    <div className="st-workspace-layout"><nav className="st-workspace-tabs">{visibleTabs.map(({ id, icon: Icon }) => <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)}><Icon size={16} />{c[id]}</button>)}</nav><section className="st-workspace-content">
      <StateView loading={api.loading || stagesApi.loading} error={api.error || stagesApi.error} empty={false} onRetry={() => { void api.reload(); void stagesApi.reload(); }}>
        {(tab === "overview" || tab === "settings") && <OverviewTab detail={detail} stages={stages} endpoint={`/api/studio/cases/${caseId}`} onSaved={api.reload} canEdit={permissions.cases} />}
        {tab === "team" && <TeamTab caseId={caseId} items={Array.isArray(detail.case_members) ? detail.case_members as Row[] : []} onSaved={api.reload} canManage={permissions.cases} />}
        {tab === "specification" && <SpecificationTab caseId={caseId} canManage={permissions.documents} />}
        {tab === "materials" && <FilesTab caseId={caseId} canUpload={permissions.files} />}
        {(tab === "timeline" || tab === "tasks" || tab === "finance" || tab === "time") && <CollectionTab tab={tab} caseId={caseId} canCreate={tab === "timeline" ? permissions.cases : tab === "tasks" ? permissions.tasks : tab === "finance" ? permissions.finance : permissions.time} />}
      </StateView>
    </section></div>
  </>;
}

function OverviewTab({ detail, stages, endpoint, onSaved, canEdit }: { detail: Row; stages: Row[]; endpoint: string; onSaved: () => void; canEdit: boolean }) {
  const c = useCrmCopy();
  const { locale } = useStudioI18n();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setMessage("");
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      await requestJson(endpoint, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: values.title, description: values.description, stageId: values.stageId || null, dueDate: values.dueDate || null, priority: values.priority }) });
      setMessage(c.saved); onSaved();
    } catch (reason) { setMessage(`${c.requestFailed}: ${reason instanceof Error ? reason.message : String(reason)}`); }
    finally { setSaving(false); }
  }
  return <div className="st-workspace-stack"><div className="st-detail-metrics"><div><span>{c.stage}</span><StatusBadge value={nested(detail.pipeline_stages, "key")} /></div><div><span>{c.owner}</span><strong>{caseOwner(detail)}</strong></div><div><span>{c.deadline}</span><strong>{date(detail.due_date, locale)}</strong></div><div><span>{c.client}</span><strong>{text(detail.client_name)}</strong></div></div>
    <form className="st-panel st-form st-case-form" onSubmit={save}><h2>{c.overview}</h2><fieldset className="st-form-fieldset" disabled={!canEdit}><div className="st-form-grid"><label className="st-label"><span>{c.title}</span><input className="st-input" name="title" defaultValue={text(detail.title, "")} required /></label><label className="st-label"><span>{c.stage}</span><select className="st-select" name="stageId" defaultValue={text(detail.stage_id, "")}><option value="">—</option>{stages.map((row) => <option key={text(row.id)} value={text(row.id)}>{text(row.name)}</option>)}</select></label><label className="st-label"><span>{c.deadline}</span><input className="st-input" name="dueDate" type="date" defaultValue={localDate(detail.due_date)} /></label><PriorityField defaultValue={text(detail.priority, "normal")} /><label className="st-label st-field-wide"><span>{c.description}</span><textarea className="st-textarea" name="description" defaultValue={text(detail.description, "")} /></label></div>{canEdit && <div className="st-row"><button className="st-btn primary" disabled={saving}>{saving && <LoaderCircle className="st-spin" size={15} />}{c.saveChanges}</button>{message && <span className={message === c.saved ? "st-ok" : "st-error"}>{message}</span>}</div>}</fieldset></form>
  </div>;
}

function TeamTab({ caseId, items, onSaved, canManage }: { caseId: string; items: Row[]; onSaved: () => void; canManage: boolean }) {
  const c = useCrmCopy();
  const usersApi = useApi("/api/studio/users", canManage);
  const [error, setError] = useState("");
  async function addMember(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      await requestJson(`/api/studio/cases/${caseId}/resources`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resource: "member", profileId: values.profileId, memberRole: values.memberRole }),
      });
      onSaved();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    }
  }
  const memberIds = new Set(items.map((row) => text(row.profile_id)));
  const availableUsers = rowsFrom(usersApi.data).filter((row) => !memberIds.has(text(row.id)));
  return <div className="st-workspace-stack"><div className="st-section-head"><h2>{c.team}</h2></div>
    {canManage && !usersApi.error && availableUsers.length ? <form className="st-panel st-row st-member-form" onSubmit={addMember}><select className="st-select" name="profileId" required defaultValue=""><option value="" disabled>{c.addMember}</option>{availableUsers.map((row) => <option key={text(row.id)} value={text(row.id)}>{text(row.name)} · {text(row.role)}</option>)}</select><input className="st-input" name="memberRole" placeholder={c.memberRole} defaultValue="member" required /><button className="st-btn primary"><Plus size={15} />{c.addMember}</button></form> : null}
    {(error || usersApi.error) && <p className="st-error">{c.requestFailed}: {error || usersApi.error}</p>}
    {items.length ? <div className="st-record-list">{items.map((row, index) => <article className="st-record" key={`${text(row.profile_id)}-${index}`}><span className="st-record-icon"><Users size={17} /></span><div><strong>{nested(row.profiles, "name")}</strong><p>{text(row.member_role)}</p></div><StatusBadge value="active" /></article>)}</div> : <div className="st-state"><Users /><strong>{c.empty}</strong></div>}
  </div>;
}

function CollectionTab({ tab, caseId, canCreate }: { tab: "timeline" | "tasks" | "finance" | "time"; caseId: string; canCreate: boolean }) {
  const c = useCrmCopy();
  const { locale, t } = useStudioI18n();
  const endpoint = `/api/studio/${tab === "timeline" ? "events" : tab}?caseId=${encodeURIComponent(caseId)}${tab === "tasks" ? "&view=all" : ""}`;
  const api = useApi(endpoint);
  const usersApi = useApi("/api/studio/users", tab === "tasks" && canCreate);
  const items = rowsFrom(api.data);
  const users = rowsFrom(usersApi.data);
  const [showCreate, setShowCreate] = useState(false);
  const [editingTask, setEditingTask] = useState<Row | null>(null);
  const [actionError, setActionError] = useState("");
  const kinds: Record<typeof tab, CreateKind> = { timeline: "note", tasks: "task", finance: "finance", time: "time" };
  const labels = { timeline: c.addNote, tasks: c.newTask, finance: c.addFinance, time: c.addTime };
  const Icon = TABS.find((item) => item.id === tab)?.icon || FileText;
  async function deleteTask(id: string) {
    if (!confirm(c.confirmDeleteTask)) return;
    setActionError("");
    try {
      await requestJson(`/api/studio/tasks/${encodeURIComponent(id)}`, { method: "DELETE" });
      await api.reload();
    } catch (reason) {
      setActionError(reason instanceof Error ? reason.message : String(reason));
    }
  }
  return <div className="st-workspace-stack"><div className="st-section-head"><h2>{c[tab]}</h2>{canCreate && <button className="st-btn primary" onClick={() => setShowCreate(true)}><Plus size={15} />{labels[tab]}</button>}</div>
    {actionError && <p className="st-error">{c.requestFailed}: {actionError}</p>}
    <StateView loading={api.loading} error={api.error} empty={!items.length} onRetry={api.reload}><div className="st-record-list">{items.map((row, index) => {
      const title = tab === "timeline" ? text((row.payload as Row | undefined)?.title, text(row.event_type)) : tab === "time" ? `${text(row.minutes)} ${c.minutes}` : text(row.title);
      const description = tab === "timeline" ? text((row.payload as Row | undefined)?.description, "") : text(row.description, tab === "finance" ? `${text(row.amount)} ${text(row.currency)}` : "");
      return <article className="st-record" key={text(row.id, String(index))}><span className="st-record-icon"><Icon size={17} /></span><div><strong>{title}</strong><p>{description}</p><small>{date(row.due_at ?? row.due_date ?? row.entry_date ?? row.created_at, locale, tab !== "finance")}</small></div><div className="st-record-actions"><StatusBadge value={row.status ?? row.priority ?? row.event_type ?? (row.billable ? "billable" : "non_billable")} />{tab === "tasks" && canCreate ? <><button type="button" className="st-icon-btn" onClick={() => setEditingTask(row)} aria-label={t("common.edit")} title={t("common.edit")}><Pencil size={15} /></button><button type="button" className="st-icon-btn danger" onClick={() => void deleteTask(text(row.id))} aria-label={c.deleteTask} title={c.deleteTask}><Trash2 size={15} /></button></> : null}</div></article>;
    })}</div></StateView>
    {canCreate && showCreate && <CreateModal kind={kinds[tab]} endpoint={`/api/studio/${tab === "timeline" ? "events" : tab}`} caseId={caseId} onClose={() => setShowCreate(false)} onSaved={() => { setShowCreate(false); void api.reload(); }} />}
    {canCreate && editingTask && <EditTaskModal task={editingTask} users={users} lockCaseId={caseId} onClose={() => setEditingTask(null)} onSaved={() => { setEditingTask(null); void api.reload(); }} />}
  </div>;
}

function FilesTab({ caseId, canUpload }: { caseId: string; canUpload: boolean }) {
  const c = useCrmCopy();
  const { locale } = useStudioI18n();
  const api = useApi(`/api/studio/files?caseId=${encodeURIComponent(caseId)}`);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setUploading(true); setError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const file = data.get("file");
    try {
      if (!(file instanceof File) || !file.size) throw new Error(c.file);
      const uploadMeta = { caseId, fileName: file.name, mimeType: file.type || "application/octet-stream", sizeBytes: file.size, category: data.get("category") };
      const authorization = await requestJson("/api/studio/files", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(uploadMeta) }) as Row;
      await requestJson(text(authorization.signedUrl), { method: "PUT", headers: { "Content-Type": file.type || "application/octet-stream", "x-upsert": "false" }, body: file });
      await requestJson("/api/studio/files", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...uploadMeta, action: "complete", path: authorization.path }) });
      form.reset(); await api.reload();
    } catch (reason) { setError(reason instanceof Error ? reason.message : String(reason)); }
    finally { setUploading(false); }
  }
  async function download(id: string) {
    try { const payload = await requestJson(`/api/studio/files?fileId=${encodeURIComponent(id)}`) as Row; window.open(text(payload.signedUrl), "_blank", "noopener,noreferrer"); }
    catch (reason) { setError(reason instanceof Error ? reason.message : String(reason)); }
  }
  const items = rowsFrom(api.data);
  return <div className="st-workspace-stack">{canUpload && <form className="st-panel st-form st-upload-form" onSubmit={upload}><h2>{c.upload}</h2><input className="st-input" name="file" type="file" required /><input className="st-input" name="category" placeholder={c.category} /><button className="st-btn primary" disabled={uploading}>{uploading && <LoaderCircle className="st-spin" size={15} />}<Paperclip size={15} />{c.upload}</button>{error && <p className="st-error">{c.requestFailed}: {error}</p>}</form>}
    <StateView loading={api.loading} error={api.error} empty={!items.length} onRetry={api.reload}><div className="st-record-list">{items.map((row) => <button className="st-record st-record-button" key={text(row.id)} onClick={() => void download(text(row.id))}><span className="st-record-icon"><Paperclip size={17} /></span><div><strong>{text(row.file_name)}</strong><p>{text(row.category, "")}</p><small>{date(row.created_at, locale, true)} · {Math.ceil(Number(row.size_bytes || 0) / 1024)} KB</small></div></button>)}</div></StateView>
  </div>;
}

type SpecItem = { section: string; item: string; acceptance: string };
function SpecificationTab({ caseId, canManage }: { caseId: string; canManage: boolean }) {
  const c = useCrmCopy();
  const { locale } = useStudioI18n();
  const api = useApi(`/api/studio/documents?caseId=${encodeURIComponent(caseId)}`);
  const documents = rowsFrom(api.data).filter((row) => row.document_type === "specification");
  const currentDocument = documents[0];
  const [items, setItems] = useState<SpecItem[]>([{ section: "", item: "", acceptance: "" }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState("");
  function update(index: number, key: keyof SpecItem, value: string) { setItems((current) => current.map((row, i) => i === index ? { ...row, [key]: value } : row)); }
  async function save() {
    setSaving(true); setError("");
    try {
      const body = JSON.stringify({ items });
      if (currentDocument?.id) {
        await requestJson(`/api/studio/documents/${text(currentDocument.id)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "version",
            body,
            changeSummary: `${c.specification} v${Number(currentDocument.current_version || 0) + 1}`,
          }),
        });
      } else {
        await requestJson("/api/studio/documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            caseId,
            title: c.specification,
            documentType: "specification",
            body,
          }),
        });
      }
      setItems([{ section: "", item: "", acceptance: "" }]); await api.reload();
    } catch (reason) { setError(reason instanceof Error ? reason.message : String(reason)); }
    finally { setSaving(false); }
  }
  return <div className="st-workspace-stack"><div className="st-section-head"><h2>{c.specification}</h2></div>{canManage && <><div className="st-spec-editor">{items.map((row, index) => <div className="st-spec-row" key={index}><span>{index + 1}</span><input className="st-input" placeholder={c.section} value={row.section} onChange={(e) => update(index, "section", e.target.value)} /><input className="st-input" placeholder={c.item} value={row.item} onChange={(e) => update(index, "item", e.target.value)} /><input className="st-input" placeholder={c.acceptance} value={row.acceptance} onChange={(e) => update(index, "acceptance", e.target.value)} /><button className="st-icon-btn danger" onClick={() => setItems((current) => current.filter((_, i) => i !== index))}><X size={15} /></button></div>)}</div><div className="st-row"><button className="st-btn" onClick={() => setItems((current) => [...current, { section: "", item: "", acceptance: "" }])}><Plus size={15} />{c.addItem}</button><button className="st-btn primary" disabled={saving || !items.some((row) => row.item.trim())} onClick={save}>{saving && <LoaderCircle className="st-spin" size={15} />}{c.publishVersion}</button></div></>}{error && <p className="st-error">{c.requestFailed}: {error}</p>}
    <StateView loading={api.loading} error={api.error} empty={!documents.length} onRetry={api.reload}><div className="st-record-list">{documents.map((document) => {
      const versions = Array.isArray(document.document_versions) ? document.document_versions as Row[] : [];
      const open = expanded === text(document.id);
      return <article className="st-document-record" key={text(document.id)}><button className="st-document-head" onClick={() => setExpanded(open ? "" : text(document.id))}><span><strong>{text(document.title)}</strong><small>v{text(document.current_version)} · {date(document.updated_at, locale)}</small></span><StatusBadge value={document.status} /></button>{open && <div className="st-document-versions">{versions.sort((a, b) => Number(b.version) - Number(a.version)).map((version) => <SpecVersion key={text(version.id)} version={version} locale={locale} />)}</div>}</article>;
    })}</div></StateView>
  </div>;
}
function SpecVersion({ version, locale }: { version: Row; locale: StudioLocale }) {
  let parsed: unknown = null;
  try { parsed = JSON.parse(text(version.body, "{}")); } catch { parsed = null; }
  const items = parsed && typeof parsed === "object" && Array.isArray((parsed as Row).items) ? (parsed as Row).items as Row[] : [];
  return <div><strong>v{text(version.version)}</strong><small>{date(version.created_at, locale, true)}</small>{items.length ? <ul>{items.map((row, index) => <li key={index}><b>{text(row.section, "")}</b> {text(row.item)} <em>{text(row.acceptance, "")}</em></li>)}</ul> : <pre>{text(version.body, "")}</pre>}</div>;
}

function Breakdown({ rows }: { rows: Array<{ label: string; value: number; detail?: string }> }) {
  const max = Math.max(1, ...rows.map((row) => row.value));
  return <div className="st-breakdown">{rows.map((row) => <div className="st-breakdown-row" key={row.label}><div><span>{row.label}</span></div><div className="st-progress"><span style={{ width: `${Math.max(3, row.value / max * 100)}%`, background: "var(--st-gold)" }} /></div><small>{row.detail || row.value}</small></div>)}</div>;
}
export function ReportsPage() {
  const c = useCrmCopy();
  const { locale, t } = useStudioI18n();
  const api = useApi("/api/studio/reports/summary?days=30");
  const object = api.data && typeof api.data === "object" ? api.data as Row : {};
  const tasks = object.tasks && typeof object.tasks === "object" ? object.tasks as Row : {};
  const finance = object.finance && typeof object.finance === "object" ? object.finance as Row : {};
  const time = object.time && typeof object.time === "object" ? object.time as Row : {};
  const openTasks = Number(tasks.todo || 0) + Number(tasks.in_progress || 0);
  const taskRows = Object.entries(tasks)
    .filter(([label]) => label !== "overdue")
    .map(([label, value]) => ({ label: labelStatus(locale, label), value: Number(value || 0) }));
  const financeRows = Object.entries(finance).flatMap(([currency, value]) => {
    const totals = value as Row;
    return ["planned", "invoiced", "paid"].map((status) => ({ label: `${currency} · ${labelStatus(locale, status)}`, value: Number(totals[status] || 0), detail: `${Number(totals[status] || 0).toLocaleString()} ${currency}` }));
  });
  const minutes = Number(time.minutes || 0);
  const billable = Number(time.billableMinutes || 0);
  const metrics = [
    [c.totalPipeline, Number(object.openCases || 0), BriefcaseBusiness], [c.openTasks, openTasks, CheckSquare2],
    [c.overdue, Number(tasks.overdue || 0), AlertCircle], [c.loggedHours, (minutes / 60).toFixed(1), Clock3],
    [c.unread, Number(object.unreadNotifications || 0), Bell],
  ] as const;
  return <><PageHeader eyebrow={c.eyebrow} title={c.reports} subtitle={c.reportsSub} action={<span className="st-badge">{t("crm.daysBadge", { days: 30 })}</span>} /><StateView loading={api.loading} error={api.error} empty={false} onRetry={api.reload}><div className="st-report-grid">{metrics.map(([label, value, Icon]) => <article className="st-report-card" key={label}><span className="st-metric-icon"><Icon size={18} /></span><span>{label}</span><strong>{value}</strong></article>)}</div><div className="st-dashboard-grid"><section className="st-panel"><h2>{c.taskBreakdown}</h2>{taskRows.length ? <Breakdown rows={taskRows} /> : <p className="st-empty-inline">{c.empty}</p>}</section><section className="st-panel"><h2>{c.financeBreakdown}</h2>{financeRows.length ? <Breakdown rows={financeRows} /> : <p className="st-empty-inline">{c.empty}</p>}</section><section className="st-panel st-panel-wide"><h2>{c.timeBreakdown}</h2><Breakdown rows={[{ label: c.billable, value: billable, detail: `${(billable / 60).toFixed(1)}h` }, { label: c.nonBillable, value: Math.max(0, minutes - billable), detail: `${(Math.max(0, minutes - billable) / 60).toFixed(1)}h` }]} /></section></div></StateView></>;
}

export function CrmSettingsPage() {
  const c = useCrmCopy();
  const api = useApi("/api/studio/crm-settings");
  const settings = api.data && typeof api.data === "object" ? api.data as Row : {};
  const stages = Array.isArray(settings.stages) ? settings.stages as Row[] : [];
  const integrations = settings.integrations && typeof settings.integrations === "object" ? settings.integrations as Row : {};
  const [tab, setTab] = useState<"general" | "pipelines" | "integrations">("general");
  const [message, setMessage] = useState("");
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage("");
    try { await requestJson("/api/studio/crm-settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget).entries())) }); setMessage(c.saved); await api.reload(); }
    catch (reason) { setMessage(`${c.requestFailed}: ${reason instanceof Error ? reason.message : String(reason)}`); }
  }
  async function addStage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage("");
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      await requestJson("/api/studio/pipeline-stages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: values.key,
          name: values.name,
          color: values.color,
          sortOrder: Number(values.sortOrder),
        }),
      });
      event.currentTarget.reset();
      setMessage(c.saved);
      await api.reload();
    } catch (reason) {
      setMessage(`${c.requestFailed}: ${reason instanceof Error ? reason.message : String(reason)}`);
    }
  }
  const tabs = [["general", c.general, Settings2], ["pipelines", c.pipelines, Workflow], ["integrations", c.integrations, CheckCircle2]] as const;
  return <><PageHeader eyebrow={c.eyebrow} title={c.settings} subtitle={c.workspace} /><div className="st-settings-layout"><nav className="st-settings-nav">{tabs.map(([id, label, Icon]) => <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)}><Icon size={16} />{label}</button>)}</nav><section className="st-panel"><StateView loading={api.loading} error={api.error} empty={false} onRetry={api.reload}>
    {tab === "general" && <form className="st-form" onSubmit={save}><label className="st-label"><span>{c.workspaceName}</span><input className="st-input" name="workspace_name" defaultValue={text(settings.workspace_name, "DormUp Studio")} /></label><label className="st-label"><span>{c.timezone}</span><input className="st-input" name="timezone" defaultValue={text(settings.timezone, "Europe/Rome")} /></label><label className="st-label"><span>{c.currency}</span><input className="st-input" name="currency" defaultValue={text(settings.currency, "EUR")} /></label><button className="st-btn primary">{c.saveChanges}</button>{message && <p className={message === c.saved ? "st-ok" : "st-error"}>{message}</p>}</form>}
    {tab === "pipelines" && <div className="st-workspace-stack"><form className="st-form st-panel" onSubmit={addStage}><div className="st-form-grid"><label className="st-label"><span>{c.name}</span><input className="st-input" name="name" required /></label><label className="st-label"><span>{c.stageKey}</span><input className="st-input" name="key" pattern="[a-z0-9][a-z0-9_-]*" required /></label><label className="st-label"><span>{c.color}</span><input className="st-input" name="color" type="color" defaultValue="#64748b" /></label><label className="st-label"><span>{c.order}</span><input className="st-input" name="sortOrder" type="number" defaultValue={stages.length * 10 + 10} /></label></div><button className="st-btn primary"><Plus size={15} />{c.addStage}</button>{message && <p className={message === c.saved ? "st-ok" : "st-error"}>{message}</p>}</form><div className="st-record-list">{stages.map((row) => <article className="st-record" key={text(row.id)}><span className="st-stage-dot" style={{ background: text(row.color, "#64748b") }} /><div><strong>{text(row.name)}</strong><p>{text(row.key)}</p></div><StatusBadge value={row.is_closed ? "closed" : row.is_won ? "won" : "active"} /></article>)}</div></div>}
    {tab === "integrations" && <div className="st-integration-grid">{Object.entries(integrations).map(([name, enabled]) => <article key={name}><strong>{name}</strong><StatusBadge value={enabled ? c.available : c.unavailable} /></article>)}</div>}
  </StateView></section></div></>;
}
