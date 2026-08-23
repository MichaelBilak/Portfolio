"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, LayoutGrid, List, LoaderCircle, Plus, Search, X } from "lucide-react";
import { studioPath } from "@/lib/studio/path";

export type HqRow = Record<string, unknown>;

export type HqField = {
  key: string;
  requestKey?: string;
  label: string;
  type?: "text" | "textarea" | "number" | "date" | "datetime-local" | "select";
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  create?: boolean;
  table?: boolean;
  currency?: boolean;
};

type WorkspaceProps = {
  title: string;
  eyebrow: string;
  subtitle: string;
  endpoint: string;
  detailPath?: string;
  emptyTitle: string;
  emptyDescription: string;
  createLabel: string;
  fields: HqField[];
  boardField?: string;
  boardOptions?: Array<{ value: string; label: string }>;
  initialView?: "table" | "board";
};

function asRows(payload: unknown): HqRow[] {
  if (Array.isArray(payload)) return payload.filter(isRow);
  if (!isRow(payload)) return [];
  for (const key of ["data", "items", "companies", "deals", "projects", "invoices", "payments", "subscriptions"]) {
    const value = payload[key];
    if (Array.isArray(value)) return value.filter(isRow);
  }
  return [];
}

function isRow(value: unknown): value is HqRow {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function display(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") {
    const row = value as HqRow;
    return String(row.name || row.title || row.deal_name || row.number || "—");
  }
  return String(value);
}

function formatField(value: unknown, field: HqField, row: HqRow) {
  if (field.currency && value !== null && value !== undefined && value !== "") {
    const amount = Number(value);
    const currency = String(row.currency || "EUR");
    if (Number.isFinite(amount)) {
      return new Intl.NumberFormat("en-IE", { style: "currency", currency }).format(amount);
    }
  }
  if ((field.type === "date" || field.type === "datetime-local") && value) {
    const parsed = new Date(String(value));
    if (!Number.isNaN(parsed.valueOf())) return parsed.toLocaleDateString();
  }
  return display(value);
}

function fieldValue(row: HqRow, field: HqField) {
  if (field.key === "company_id" && row.companies) return row.companies;
  if (field.key === "product_id" && row.products) return row.products;
  if (field.key === "project_id" && row.client_projects) return row.client_projects;
  if (field.key === "invoice_id" && row.invoices) return row.invoices;
  return row[field.key];
}

async function request(endpoint: string, init?: RequestInit) {
  const response = await fetch(endpoint, init);
  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message = isRow(payload) && typeof payload.error === "string" ? payload.error : "Request failed";
    throw new Error(message);
  }
  return payload;
}

export function HqEntityWorkspace({
  title,
  eyebrow,
  subtitle,
  endpoint,
  detailPath,
  emptyTitle,
  emptyDescription,
  createLabel,
  fields,
  boardField,
  boardOptions = [],
  initialView = "table",
}: WorkspaceProps) {
  const [rows, setRows] = useState<HqRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState(fields.find((field) => field.table)?.key || "created_at");
  const [ascending, setAscending] = useState(true);
  const [page, setPage] = useState(0);
  const [view, setView] = useState<"table" | "board">(initialView);
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const pageSize = 20;

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setRows(asRows(await request(endpoint, { headers: { Accept: "application/json" } })));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("create") === "1") setCreateOpen(true);
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    const result = normalized
      ? rows.filter((row) => fields.some((field) => display(fieldValue(row, field)).toLocaleLowerCase().includes(normalized)))
      : rows;
    return [...result].sort((a, b) => {
      const sortField = fields.find((field) => field.key === sort);
      const left = display(sortField ? fieldValue(a, sortField) : a[sort]).toLocaleLowerCase();
      const right = display(sortField ? fieldValue(b, sortField) : b[sort]).toLocaleLowerCase();
      return left.localeCompare(right, undefined, { numeric: true }) * (ascending ? 1 : -1);
    });
  }, [ascending, fields, query, rows, sort]);

  const visible = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const tableFields = fields.filter((field) => field.table);

  async function createEntity(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    const body: HqRow = {};
    for (const field of fields.filter((candidate) => candidate.create)) {
      const raw = values[field.key];
      const requestKey = field.requestKey || field.key;
      if (field.type === "number") body[requestKey] = raw === "" ? null : Number(raw);
      else body[requestKey] = raw === "" ? null : raw;
    }
    try {
      await request(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setCreateOpen(false);
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setSaving(false);
    }
  }

  function changeSort(key: string) {
    if (sort === key) setAscending((value) => !value);
    else {
      setSort(key);
      setAscending(true);
    }
  }

  return (
    <div className="st-hq-page">
      <div className="st-page-header">
        <div>
          <p className="st-eyebrow">{eyebrow}</p>
          <h1 className="st-h1">{title}</h1>
          <p className="st-sub">{subtitle}</p>
        </div>
        <button className="st-btn primary" onClick={() => setCreateOpen(true)}>
          <Plus size={16} /> {createLabel}
        </button>
      </div>

      <div className="st-toolbar st-hq-toolbar">
        <label className="st-search">
          <Search size={16} />
          <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(0); }} placeholder="Search…" />
        </label>
        {boardField ? (
          <div className="st-segmented">
            <button className={view === "table" ? "active" : ""} onClick={() => setView("table")}><List size={15} /> Table</button>
            <button className={view === "board" ? "active" : ""} onClick={() => setView("board")}><LayoutGrid size={15} /> Kanban</button>
          </div>
        ) : null}
        <span className="st-hq-count">{filtered.length} records</span>
      </div>

      {error ? <div className="st-state st-state-error"><strong>{error}</strong><button className="st-btn" onClick={() => void load()}>Retry</button></div> : null}
      {loading ? <div className="st-state"><LoaderCircle className="st-spin" /><strong>Loading…</strong></div> : null}
      {!loading && !error && !filtered.length ? (
        <div className="st-state st-hq-empty"><strong>{emptyTitle}</strong><span>{emptyDescription}</span><button className="st-btn primary" onClick={() => setCreateOpen(true)}>{createLabel}</button></div>
      ) : null}

      {!loading && filtered.length && view === "table" ? (
        <>
          <div className="st-table-wrap">
            <table className="st-table st-hq-table">
              <thead><tr>{tableFields.map((field) => (
                <th key={field.key}><button className="st-sort-button" onClick={() => changeSort(field.key)}>{field.label}{sort === field.key ? (ascending ? <ArrowUp size={13} /> : <ArrowDown size={13} />) : null}</button></th>
              ))}</tr></thead>
              <tbody>{visible.map((row, index) => {
                const id = display(row.id);
                return <tr key={id === "—" ? index : id}>{tableFields.map((field, fieldIndex) => (
                  <td key={field.key}>{fieldIndex === 0 && id !== "—" && detailPath ? <Link href={studioPath(`${detailPath}/${id}`)}>{formatField(fieldValue(row, field), field, row)}</Link> : formatField(fieldValue(row, field), field, row)}</td>
                ))}</tr>;
              })}</tbody>
            </table>
          </div>
          {filtered.length > pageSize ? <div className="st-pagination"><button className="st-btn" disabled={page === 0} onClick={() => setPage((value) => value - 1)}>Previous</button><span>Page {page + 1} of {Math.ceil(filtered.length / pageSize)}</span><button className="st-btn" disabled={(page + 1) * pageSize >= filtered.length} onClick={() => setPage((value) => value + 1)}>Next</button></div> : null}
        </>
      ) : null}

      {!loading && filtered.length && view === "board" && boardField ? (
        <div className="st-hq-kanban">
          {boardOptions.map((option) => {
            const stageRows = filtered.filter((row) => String(row[boardField] || "") === option.value);
            return <section className="st-kanban-column" key={option.value}><header><strong>{option.label}</strong><span>{stageRows.length}</span></header><div>{stageRows.length ? stageRows.map((row, index) => {
              const id = display(row.id);
              const primary = tableFields[0];
              const content = <><strong>{formatField(fieldValue(row, primary), primary, row)}</strong>{tableFields.slice(1, 4).map((field) => <span key={field.key}>{field.label}: {formatField(fieldValue(row, field), field, row)}</span>)}</>;
              return detailPath ? <Link className="st-hq-kanban-card" key={id === "—" ? index : id} href={studioPath(`${detailPath}/${id}`)}>{content}</Link> : <article className="st-hq-kanban-card" key={id === "—" ? index : id}>{content}</article>;
            }) : <p className="st-kanban-empty">No records</p>}</div></section>;
          })}
        </div>
      ) : null}

      {createOpen ? (
        <div className="st-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setCreateOpen(false); }}>
          <section className="st-modal" role="dialog" aria-modal="true" aria-label={createLabel}>
            <button className="st-icon-btn st-modal-close" onClick={() => setCreateOpen(false)} aria-label="Close"><X size={17} /></button>
            <h2>{createLabel}</h2>
            <form className="st-form" onSubmit={createEntity}>
              {fields.filter((field) => field.create).map((field) => (
                <label className="st-label" key={field.key}><span>{field.label}</span>
                  {field.type === "textarea" ? <textarea className="st-textarea" name={field.key} required={field.required} /> : field.type === "select" ? <select className="st-select" name={field.key} required={field.required} defaultValue=""><option value="">Select…</option>{field.options?.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select> : <input className="st-input" name={field.key} required={field.required} type={field.type || "text"} step={field.type === "number" ? "0.01" : undefined} />}
                </label>
              ))}
              <div className="st-row"><button className="st-btn primary" disabled={saving}>{saving ? <LoaderCircle className="st-spin" size={15} /> : <Plus size={15} />} Create</button><button className="st-btn subtle" type="button" onClick={() => setCreateOpen(false)}>Cancel</button></div>
            </form>
          </section>
        </div>
      ) : null}
    </div>
  );
}
