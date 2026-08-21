"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Download,
  LayoutGrid,
  List,
  LoaderCircle,
  Search,
  Upload,
  UserPlus,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  formatStudioDate,
  labelPriority,
  labelStatus,
  useStudioI18n,
} from "@/lib/studio/i18n";
import { studioPath } from "@/lib/studio/path";
import { LEAD_STATUSES } from "@/lib/studio/leads";

type LeadRow = {
  id: string;
  status: string;
  priority: string;
  full_name: string | null;
  email: string | null;
  business_name: string | null;
  source: string | null;
  intent: string | null;
  locale: string | null;
  assignee_id: string | null;
  next_action_at: string | null;
  first_responded_at: string | null;
  created_at: string;
  profiles?: { id: string; name: string | null } | null;
};

type ProfileOption = { id: string; name: string | null; email?: string | null };

function assigneeName(lead: LeadRow, users: ProfileOption[], fallback: string) {
  if (lead.profiles?.name) return lead.profiles.name;
  const match = users.find((user) => user.id === lead.assignee_id);
  return match?.name || match?.email || fallback;
}

function buildQuery(params: Record<string, string | undefined>) {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) sp.set(key, value);
  }
  return sp.toString();
}

function isSlaBreached(lead: LeadRow) {
  if (!lead.next_action_at) return false;
  return new Date(lead.next_action_at).getTime() < Date.now();
}

export function LeadsWorkspace({
  initialView,
  users,
  currentUserId,
}: {
  initialView: "list" | "board";
  users: ProfileOption[];
  currentUserId: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, locale } = useStudioI18n();
  const view = (searchParams.get("view") as "list" | "board") || initialView;
  const [items, setItems] = useState<LeadRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [offset, setOffset] = useState(0);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [importMsg, setImportMsg] = useState("");
  const [importBusy, setImportBusy] = useState(false);
  const limit = view === "board" ? 200 : 40;

  const filters = useMemo(
    () => ({
      view,
      status: searchParams.get("status") || "",
      priority: searchParams.get("priority") || "",
      source: searchParams.get("source") || "",
      locale: searchParams.get("locale") || "",
      intent: searchParams.get("intent") || "",
      assigneeId: searchParams.get("assigneeId") || "",
      q: searchParams.get("q") || "",
      from: searchParams.get("from") || "",
      to: searchParams.get("to") || "",
      unassigned: searchParams.get("unassigned") || "",
    }),
    [searchParams, view],
  );

  const queryString = useMemo(
    () =>
      buildQuery({
        status: filters.status,
        priority: filters.priority,
        source: filters.source,
        locale: filters.locale,
        intent: filters.intent,
        assigneeId: filters.assigneeId,
        q: filters.q,
        from: filters.from,
        to: filters.to,
        unassigned: filters.unassigned,
        limit: String(limit),
        offset: String(offset),
        sort: "created_at",
        order: "desc",
      }),
    [filters, limit, offset],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/studio/leads?${queryString}`, {
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("leads.loadError"));
      setItems((data.items || []) as LeadRow[]);
      setTotal(Number(data.total || 0));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setLoading(false);
    }
  }, [queryString, t]);

  useEffect(() => {
    void load();
  }, [load]);

  function replaceFilters(next: Record<string, string>) {
    const sp = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (!value) sp.delete(key);
      else sp.set(key, value);
    }
    setOffset(0);
    router.push(`${studioPath("/leads")}?${sp.toString()}`);
  }

  async function patchLead(id: string, body: Record<string, unknown>) {
    const res = await fetch(`/api/studio/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || t("leads.saveError"));
    }
    await load();
  }

  async function claimLead(id: string) {
    await patchLead(id, { assigneeId: currentUserId, status: "in_progress" });
  }

  async function onDropStatus(status: string) {
    if (!draggingId) return;
    try {
      await patchLead(draggingId, { status });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setDraggingId(null);
    }
  }

  async function onImport(file: File, dryRun: boolean) {
    setImportBusy(true);
    setImportMsg("");
    try {
      const form = new FormData();
      form.set("file", file);
      if (dryRun) form.set("dryRun", "1");
      const res = await fetch("/api/studio/leads/import", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("leads.importError"));
      if (dryRun || data.dryRun) {
        setImportMsg(
          t("leads.importPreview", {
            total: data.total || 0,
            valid: data.valid || 0,
            errors: (data.errors || []).length,
          }),
        );
      } else {
        setImportMsg(t("leads.importDone", { count: data.imported || 0 }));
        setImportOpen(false);
        await load();
      }
    } catch (reason) {
      setImportMsg(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setImportBusy(false);
    }
  }

  const exportHref = `/api/studio/leads/export?${buildQuery({
    status: filters.status,
    priority: filters.priority,
    source: filters.source,
    locale: filters.locale,
    intent: filters.intent,
    assigneeId: filters.assigneeId,
    q: filters.q,
    from: filters.from,
    to: filters.to,
    unassigned: filters.unassigned,
  })}`;

  const boardColumns = LEAD_STATUSES.map((status) => ({
    status,
    items: items.filter((lead) => lead.status === status),
  }));

  return (
    <>
      <div className="st-page-header">
        <div>
          <p className="st-eyebrow">{t("leads.eyebrow")}</p>
          <h1 className="st-h1">{t("leads.title")}</h1>
          <p className="st-sub">{t("leads.subtitle")}</p>
        </div>
        <div className="st-row" style={{ gap: "0.5rem", flexWrap: "wrap" }}>
          <button type="button" className="st-btn" onClick={() => setImportOpen(true)}>
            <Upload size={16} /> {t("leads.import")}
          </button>
          <a className="st-btn" href={exportHref}>
            <Download size={16} /> {t("leads.export")}
          </a>
        </div>
      </div>

      <form
        className="st-toolbar st-leads-filters"
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          replaceFilters({
            view,
            status: String(form.get("status") || ""),
            priority: String(form.get("priority") || ""),
            source: String(form.get("source") || ""),
            locale: String(form.get("locale") || ""),
            intent: String(form.get("intent") || ""),
            assigneeId: String(form.get("assigneeId") || ""),
            q: String(form.get("q") || ""),
            from: String(form.get("from") || "")
              ? `${String(form.get("from"))}T00:00:00.000Z`
              : "",
            to: String(form.get("to") || "")
              ? `${String(form.get("to"))}T23:59:59.999Z`
              : "",
            unassigned: form.get("unassigned") === "on" ? "1" : "",
          });
        }}
      >
        <label className="st-search">
          <Search size={16} />
          <input name="q" defaultValue={filters.q} placeholder={t("leads.searchPlaceholder")} />
        </label>
        <select className="st-select" name="status" defaultValue={filters.status}>
          <option value="">{t("leads.allStatuses")}</option>
          {LEAD_STATUSES.map((status) => (
            <option key={status} value={status}>
              {labelStatus(locale, status)}
            </option>
          ))}
        </select>
        <select className="st-select" name="priority" defaultValue={filters.priority}>
          <option value="">{t("leads.allPriorities")}</option>
          {(["low", "normal", "high"] as const).map((priority) => (
            <option key={priority} value={priority}>
              {labelPriority(locale, priority)}
            </option>
          ))}
        </select>
        <select className="st-select" name="assigneeId" defaultValue={filters.assigneeId}>
          <option value="">{t("leads.allAssignees")}</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name || user.email || user.id.slice(0, 8)}
            </option>
          ))}
        </select>
        <input className="st-input" name="source" defaultValue={filters.source} placeholder={t("leads.source")} />
        <input className="st-input" name="intent" defaultValue={filters.intent} placeholder={t("leads.intent")} />
        <input className="st-input" name="locale" defaultValue={filters.locale} placeholder={t("leads.locale")} />
        <input className="st-input" type="date" name="from" defaultValue={filters.from.slice(0, 10)} />
        <input className="st-input" type="date" name="to" defaultValue={filters.to.slice(0, 10)} />
        <label className="st-check">
          <input type="checkbox" name="unassigned" defaultChecked={filters.unassigned === "1"} />
          {t("leads.unassignedOnly")}
        </label>
        <button className="st-btn" type="submit">
          {t("leads.find")}
        </button>
        <div className="st-segmented">
          <button
            type="button"
            className={view === "list" ? "active" : ""}
            onClick={() => replaceFilters({ ...filters, view: "list" })}
          >
            <List size={14} /> {t("leads.viewList")}
          </button>
          <button
            type="button"
            className={view === "board" ? "active" : ""}
            onClick={() => replaceFilters({ ...filters, view: "board" })}
          >
            <LayoutGrid size={14} /> {t("leads.viewBoard")}
          </button>
        </div>
      </form>

      {error ? <p className="st-error">{error}</p> : null}
      {loading ? (
        <div className="st-state">
          <LoaderCircle className="st-spin" />
          <strong>{t("common.loading")}</strong>
        </div>
      ) : view === "board" ? (
        <div className="st-kanban st-leads-kanban">
          {boardColumns.map((column) => (
            <section
              key={column.status}
              className="st-kanban-column"
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => void onDropStatus(column.status)}
            >
              <header>
                <span>{labelStatus(locale, column.status)}</span>
                <b>{column.items.length}</b>
              </header>
              <div>
                {column.items.map((lead) => (
                  <article
                    key={lead.id}
                    className={`st-case-card st-lead-card${isSlaBreached(lead) ? " sla" : ""}`}
                    draggable
                    onDragStart={() => setDraggingId(lead.id)}
                    onDragEnd={() => setDraggingId(null)}
                  >
                    <div className="st-case-card-top">
                      <strong>
                        <Link href={studioPath(`/leads/${lead.id}`)}>
                          {lead.full_name || lead.email || t("leads.fallbackTitle")}
                        </Link>
                      </strong>
                      <span className={`st-status st-status-${lead.priority}`}>{labelPriority(locale, lead.priority)}</span>
                    </div>
                    <span>{lead.business_name || "—"}</span>
                    <span>{lead.source || "—"} · {formatStudioDate(lead.created_at, locale, true)}</span>
                    <footer>
                      <span>{assigneeName(lead, users, t("leads.unassigned"))}</span>
                      <button
                        type="button"
                        className="st-btn subtle"
                        onClick={() => void claimLead(lead.id)}
                      >
                        <UserPlus size={14} /> {t("leads.claim")}
                      </button>
                    </footer>
                  </article>
                ))}
                {!column.items.length ? <p className="st-kanban-empty">{t("leads.boardEmpty")}</p> : null}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <>
          <div className="st-lead-cards-mobile">
            {items.map((lead) => (
              <article key={lead.id} className={`st-lead-mobile-card${isSlaBreached(lead) ? " sla" : ""}`}>
                <div>
                  <strong>
                    <Link href={studioPath(`/leads/${lead.id}`)}>
                      {lead.full_name || lead.email || t("leads.fallbackTitle")}
                    </Link>
                  </strong>
                  <p>{lead.business_name || lead.email}</p>
                  <small>
                    {labelStatus(locale, lead.status)} · {formatStudioDate(lead.created_at, locale, true)}
                  </small>
                </div>
                <div className="st-row">
                  <button type="button" className="st-btn primary" onClick={() => void claimLead(lead.id)}>
                    {t("leads.claim")}
                  </button>
                  <Link className="st-btn" href={studioPath(`/leads/${lead.id}`)}>
                    {t("leads.open")}
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div className="st-table-wrap st-leads-table">
            <table className="st-table">
              <thead>
                <tr>
                  <th>{t("leads.date")}</th>
                  <th>{t("leads.client")}</th>
                  <th>{t("leads.email")}</th>
                  <th>{t("leads.business")}</th>
                  <th>{t("leads.status")}</th>
                  <th>{t("leads.priorityLabel")}</th>
                  <th>{t("crm.assignee")}</th>
                  <th>{t("leads.source")}</th>
                  <th aria-label={t("leads.actions")} />
                </tr>
              </thead>
              <tbody>
                {items.map((lead) => (
                  <tr key={lead.id} className={isSlaBreached(lead) ? "sla" : undefined}>
                    <td>{formatStudioDate(lead.created_at, locale, true)}</td>
                    <td>
                      <Link href={studioPath(`/leads/${lead.id}`)}>
                        {lead.full_name || lead.email}
                      </Link>
                    </td>
                    <td>
                      {lead.email ? <a href={`mailto:${lead.email}`}>{lead.email}</a> : "—"}
                    </td>
                    <td>{lead.business_name || "—"}</td>
                    <td>
                      <span className="st-badge">{labelStatus(locale, lead.status)}</span>
                    </td>
                    <td>{labelPriority(locale, lead.priority)}</td>
                    <td>{assigneeName(lead, users, t("leads.unassigned"))}</td>
                    <td>{lead.source || "—"}</td>
                    <td>
                      <div className="st-record-actions">
                        <button
                          type="button"
                          className="st-btn subtle"
                          onClick={() => void claimLead(lead.id)}
                        >
                          {t("leads.claim")}
                        </button>
                        <Link className="st-btn subtle" href={studioPath(`/leads/${lead.id}`)}>
                          {t("leads.open")}
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="st-row" style={{ marginTop: "1rem", justifyContent: "space-between" }}>
            <span className="st-muted">
              {t("leads.pagination", { from: total ? offset + 1 : 0, to: Math.min(offset + limit, total), total })}
            </span>
            <div className="st-row">
              <button
                type="button"
                className="st-btn"
                disabled={offset === 0}
                onClick={() => setOffset((value) => Math.max(0, value - limit))}
              >
                {t("common.prev")}
              </button>
              <button
                type="button"
                className="st-btn"
                disabled={offset + limit >= total}
                onClick={() => setOffset((value) => value + limit)}
              >
                {t("common.next")}
              </button>
            </div>
          </div>
        </>
      )}

      {importOpen ? (
        <div className="st-modal-backdrop" onClick={() => setImportOpen(false)}>
          <div className="st-modal" onClick={(event) => event.stopPropagation()}>
            <h2>{t("leads.importTitle")}</h2>
            <p className="st-sub">{t("leads.importHint")}</p>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void onImport(file, true);
              }}
            />
            <div className="st-row" style={{ marginTop: "1rem" }}>
              <button
                type="button"
                className="st-btn primary"
                disabled={importBusy}
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = ".csv,.xlsx,.xls";
                  input.onchange = () => {
                    const file = input.files?.[0];
                    if (file) void onImport(file, false);
                  };
                  input.click();
                }}
              >
                {importBusy ? t("common.loading") : t("leads.importConfirm")}
              </button>
              <button type="button" className="st-btn" onClick={() => setImportOpen(false)}>
                {t("common.cancel")}
              </button>
            </div>
            {importMsg ? <p className="st-ok">{importMsg}</p> : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
