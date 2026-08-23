"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, LoaderCircle, Plus, Save } from "lucide-react";
import { studioPath } from "@/lib/studio/path";
import type { HqField, HqRow } from "./hq-entity-workspace";

type DetailKind = "company" | "deal" | "project" | "invoice" | "payment" | "subscription";

type Props = {
  id: string;
  kind: DetailKind;
  endpoint: string;
  backPath: string;
  backLabel: string;
  titleKey: string;
  subtitleKey?: string;
  fields: HqField[];
};

function isRow(value: unknown): value is HqRow {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function unwrap(payload: unknown): HqRow | null {
  if (!isRow(payload)) return null;
  for (const key of ["data", "company", "deal", "project"]) {
    if (isRow(payload[key])) return payload[key] as HqRow;
  }
  return payload;
}

function label(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "object") {
    const row = value as HqRow;
    return String(row.name || row.title || row.deal_name || "—");
  }
  return String(value);
}

function array(value: unknown): HqRow[] {
  return Array.isArray(value) ? value.filter(isRow) : [];
}

async function request(endpoint: string, init?: RequestInit) {
  const response = await fetch(endpoint, init);
  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(isRow(payload) && typeof payload.error === "string" ? payload.error : "Request failed");
  }
  return payload;
}

const tabsByKind: Record<DetailKind, string[]> = {
  company: ["Overview", "Contacts", "Deals", "Projects", "Finance", "Activity", "Notes"],
  deal: ["Overview", "Activity", "Tasks", "Finance", "Notes"],
  project: ["Overview", "Milestones", "Tasks", "Budget", "Activity", "Notes"],
  invoice: ["Overview", "Finance", "Activity", "Notes"],
  payment: ["Overview", "Activity", "Notes"],
  subscription: ["Overview", "Activity", "Notes"],
};

export function HqEntityDetail({
  id,
  kind,
  endpoint,
  backPath,
  backLabel,
  titleKey,
  subtitleKey,
  fields,
}: Props) {
  const [record, setRecord] = useState<HqRow | null>(null);
  const [payload, setPayload] = useState<HqRow>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("Overview");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await request(endpoint);
      setPayload(isRow(result) ? result : {});
      setRecord(unwrap(result));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => { void load(); }, [load]);

  const relations = useMemo(() => ({
    Contacts: array(payload.contacts || record?.contacts),
    Deals: array(payload.deals || record?.deals),
    Projects: array(payload.projects || payload.client_projects || record?.projects || record?.client_projects),
    Finance: [...array(payload.invoices || record?.invoices), ...array(payload.payments || record?.payments), ...array(payload.invoice_items || record?.invoice_items)],
    Activity: array(payload.activities || record?.activities),
    Notes: array(payload.notes || record?.related_notes || record?.notes),
    Tasks: array(payload.tasks || record?.tasks),
    Milestones: array(payload.milestones || record?.milestones || record?.project_milestones),
  }), [payload, record]);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    const body: HqRow = {};
    for (const field of fields) {
      const raw = values[field.key];
      const key = field.requestKey || field.key;
      body[key] = field.type === "number" ? (raw === "" ? null : Number(raw)) : (raw === "" ? null : raw);
    }
    try {
      await request(endpoint, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setSaving(false);
    }
  }

  async function createProject() {
    setSaving(true);
    setError("");
    try {
      const result = await request(`${endpoint}/create-project`, { method: "POST" });
      const row = unwrap(result);
      if (row?.id) window.location.href = studioPath(`/projects/${String(row.id)}`);
      else await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setSaving(false);
    }
  }

  async function createRelated(event: React.FormEvent<HTMLFormElement>, relation: "contact" | "milestone" | "task") {
    event.preventDefault();
    setSaving(true);
    setError("");
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      await request(relation === "contact" ? "/api/studio/contacts" : relation === "milestone" ? "/api/studio/project-milestones" : "/api/studio/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(relation === "contact"
          ? { companyId: id, firstName: values.firstName, lastName: values.lastName, email: values.email || null, phone: values.phone || null, jobTitle: values.jobTitle || null, isPrimary: values.isPrimary === "on" }
          : relation === "milestone"
            ? { projectId: id, title: values.title, status: "pending", dueDate: values.dueDate || null }
            : { ...(kind === "deal" ? { dealId: id } : { projectId: id }), companyId: record?.company_id || null, title: values.title, priority: values.priority || "normal", dueAt: values.dueAt ? new Date(String(values.dueAt)).toISOString() : null }),
      });
      event.currentTarget.reset();
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setSaving(false);
    }
  }

  async function createTimeline(event: React.FormEvent<HTMLFormElement>, resource: "activity" | "note") {
    event.preventDefault();
    setSaving(true);
    setError("");
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    const relation = kind === "company" ? { companyId: id } : kind === "deal" ? { dealId: id } : kind === "project" ? { projectId: id } : {};
    try {
      await request(resource === "activity" ? "/api/studio/activities" : "/api/studio/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resource === "activity"
          ? { ...relation, type: values.type || "note", subject: values.subject, body: values.body || null, occurredAt: new Date().toISOString() }
          : { ...relation, body: values.body }),
      });
      event.currentTarget.reset();
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="st-state"><LoaderCircle className="st-spin" /><strong>Loading…</strong></div>;
  if (error && !record) return <div className="st-state st-state-error"><strong>{error}</strong><button className="st-btn" onClick={() => void load()}>Retry</button></div>;
  if (!record) return <div className="st-state"><strong>Record not found</strong></div>;

  const title = label(record[titleKey]);
  const subtitle = subtitleKey ? label(record[subtitleKey]) : "";
  const nextAction = label(record.next_action || record.nextAction || record.status);
  const companyInvoices = array(record.invoices);
  const companySubscriptions = array(record.subscriptions);
  const companyRevenue = companyInvoices.reduce((sum, row) => sum + Number(row.amount_paid || 0), 0);
  const companyOutstanding = companyInvoices.reduce((sum, row) => sum + Number(row.remaining_amount || 0), 0);
  const companyMrr = companySubscriptions.filter((row) => row.status === "active").reduce((sum, row) => {
    const amount = Number(row.amount || 0);
    return sum + (row.interval === "year" ? amount / 12 : row.interval === "quarter" ? amount / 3 : row.interval === "week" ? amount * 52 / 12 : amount);
  }, 0);

  return (
    <div className="st-hq-detail">
      <Link className="st-back-link" href={studioPath(backPath)}><ArrowLeft size={14} /> {backLabel}</Link>
      <div className="st-entity-header">
        <div><p className="st-eyebrow">{kind}</p><h1 className="st-h1">{title}</h1>{subtitle !== "—" ? <p className="st-sub">{subtitle}</p> : null}</div>
        <div className="st-next-action"><small>Next action</small><strong>{nextAction}</strong>
          {kind === "deal" && record.stage === "won" && !record.project_id && array(record.client_projects).length === 0 ? <button className="st-btn primary" onClick={() => void createProject()} disabled={saving}><Plus size={15} /> Create project</button> : null}
        </div>
      </div>
      {kind === "company" ? <div className="st-hq-metrics"><div className="st-metric-card"><small>Total revenue</small><strong>€{companyRevenue.toLocaleString()}</strong></div><div className="st-metric-card"><small>MRR</small><strong>€{companyMrr.toLocaleString()}</strong></div><div className="st-metric-card"><small>Outstanding</small><strong>€{companyOutstanding.toLocaleString()}</strong></div><div className="st-metric-card"><small>Projects</small><strong>{array(record.client_projects).length}</strong></div></div> : null}
      {kind === "project" ? <div className="st-hq-metrics"><div className="st-metric-card"><small>Sold price</small><strong>€{Number(record.sold_price || 0).toLocaleString()}</strong></div><div className="st-metric-card"><small>Actual cost</small><strong>€{Number(record.actual_cost || 0).toLocaleString()}</strong></div><div className="st-metric-card"><small>Gross profit</small><strong>€{Number(record.gross_profit || 0).toLocaleString()}</strong></div><div className="st-metric-card"><small>Gross margin</small><strong>{Number(record.gross_margin || 0).toFixed(1)}%</strong></div></div> : null}
      {error ? <p className="st-error">{error}</p> : null}
      <div className="st-tabs">{tabsByKind[kind].map((item) => <button key={item} className={`st-tab ${tab === item ? "active" : ""}`} onClick={() => setTab(item)}>{item}</button>)}</div>

      {tab === "Overview" || tab === "Budget" ? (
        <form className="st-card st-hq-edit-form" onSubmit={save}>
          <div className="st-form-grid">
            {fields.map((field) => <label className="st-label" key={field.key}><span>{field.label}</span>
              {field.type === "textarea" ? <textarea className="st-textarea" name={field.key} defaultValue={label(record[field.key]) === "—" ? "" : label(record[field.key])} /> : field.type === "select" ? <select className="st-select" name={field.key} defaultValue={label(record[field.key]) === "—" ? "" : label(record[field.key])}><option value="">Select…</option>{field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select> : <input className="st-input" name={field.key} type={field.type || "text"} step={field.type === "number" ? "0.01" : undefined} defaultValue={label(record[field.key]) === "—" ? "" : String(record[field.key]).slice(0, field.type === "date" ? 10 : undefined)} />}
            </label>)}
          </div>
          <button className="st-btn primary" disabled={saving}>{saving ? <LoaderCircle className="st-spin" size={15} /> : <Save size={15} />} Save changes</button>
        </form>
      ) : (
        <section className="st-panel">
          <div className="st-panel-head"><div><h2>{tab}</h2><p>Connected records in this relationship.</p></div></div>
          {kind === "company" && tab === "Contacts" ? <form className="st-related-quick-form" onSubmit={(event) => void createRelated(event, "contact")}><input className="st-input" name="firstName" placeholder="First name" required /><input className="st-input" name="lastName" placeholder="Last name" /><input className="st-input" name="email" type="email" placeholder="Email" /><input className="st-input" name="phone" placeholder="Phone / WhatsApp" /><input className="st-input" name="jobTitle" placeholder="Role" /><label className="st-check"><input name="isPrimary" type="checkbox" /> Primary</label><button className="st-btn primary" disabled={saving}><Plus size={14} /> Add contact</button></form> : null}
          {kind === "project" && tab === "Milestones" ? <form className="st-related-quick-form" onSubmit={(event) => void createRelated(event, "milestone")}><input className="st-input" name="title" placeholder="Milestone" required /><input className="st-input" name="dueDate" type="date" /><button className="st-btn primary" disabled={saving}><Plus size={14} /> Add milestone</button></form> : null}
          {(kind === "project" || kind === "deal") && tab === "Tasks" ? <form className="st-related-quick-form" onSubmit={(event) => void createRelated(event, "task")}><input className="st-input" name="title" placeholder="Task" required /><select className="st-select" name="priority" defaultValue="normal"><option value="low">Low</option><option value="normal">Medium</option><option value="high">High</option><option value="urgent">Urgent</option></select><input className="st-input" name="dueAt" type="datetime-local" /><button className="st-btn primary" disabled={saving}><Plus size={14} /> Add task</button></form> : null}
          {["company", "deal", "project"].includes(kind) && tab === "Activity" ? <form className="st-related-quick-form" onSubmit={(event) => void createTimeline(event, "activity")}><select className="st-select" name="type" defaultValue="note"><option value="note">Note</option><option value="call">Call</option><option value="email">Email</option><option value="meeting">Meeting</option><option value="status_change">Status change</option></select><input className="st-input" name="subject" placeholder="Activity summary" required /><input className="st-input" name="body" placeholder="Details" /><button className="st-btn primary" disabled={saving}><Plus size={14} /> Add activity</button></form> : null}
          {["company", "deal", "project"].includes(kind) && tab === "Notes" ? <form className="st-related-quick-form" onSubmit={(event) => void createTimeline(event, "note")}><input className="st-input" name="body" placeholder="Internal note" required /><button className="st-btn primary" disabled={saving}><Plus size={14} /> Add note</button></form> : null}
          {relations[tab as keyof typeof relations]?.length ? <div className="st-record-list">{relations[tab as keyof typeof relations].map((row, index) => <article className="st-record" key={String(row.id || index)}><div><strong>{label(row.name || row.title || row.subject || row.invoice_number || row.deal_name || row.number || row.body || row.activity_type || row.event_type)}</strong><p>{label(row.description || row.summary || row.body || row.status || row.occurred_at || row.created_at)}</p></div>{row.status ? <span className={`st-status st-status-${String(row.status).replaceAll("_", "-")}`}>{label(row.status)}</span> : <CheckCircle2 size={16} />}</article>)}</div> : <div className="st-state"><strong>No {tab.toLocaleLowerCase()} yet</strong><span>Related records will appear here automatically.</span></div>}
        </section>
      )}
    </div>
  );
}
