"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronDown,
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
  const [filtersOpen, setFiltersOpen] = useState(false);
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

  const hasAdvanced =
    Boolean(filters.priority) ||
    Boolean(filters.source) ||
    Boolean(filters.locale) ||
    Boolean(filters.intent) ||
    Boolean(filters.from) ||
    Boolean(filters.to) ||
    filters.unassigned === "1";

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

  useEffect(() => {
    if (hasAdvanced) setFiltersOpen(true);
  }, [hasAdvanced]);

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

  function submitFilters(event: React.FormEvent<HTMLFormElement>) {
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
      to: String(form.get("to") || "") ? `${String(form.get("to"))}T23:59:59.999Z` : "",
      unassigned: form.get("unassigned") === "on" ? "1" : "",
    });
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

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = Object.fromEntries(
      LEAD_STATUSES.map((status) => [status, 0]),
    );
    for (const lead of items) counts[lead.status] = (counts[lead.status] || 0) + 1;
    return counts;
  }, [items]);

  const boardColumns = LEAD_STATUSES.map((status) => ({
    status,
    items: items.filter((lead) => lead.status === status),
  }));

  return (
    <div className="st-leads-page">
      <header className="st-leads-hero">
        <div>
          <p className="st-eyebrow">{t("leads.eyebrow")}</p>
          <h1 className="st-h1">{t("leads.title")}</h1>
          <p className="st-sub">{t("leads.subtitle")}</p>
        </div>
        <div className="st-leads-hero-actions">
          <div className="st-segmented" role="tablist" aria-label={t("leads.viewList")}>
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
          <button type="button" className="st-btn" onClick={() => setImportOpen(true)}>
            <Upload size={16} /> {t("leads.import")}
          </button>
          <a className="st-btn" href={exportHref}>
            <Download size={16} /> {t("leads.export")}
          </a>
        </div>
      </header>

      <div className="st-leads-status-strip" role="navigation" aria-label={t("leads.status")}>
        <button
          type="button"
          className={!filters.status ? "active" : ""}
          onClick={() => replaceFilters({ ...filters, status: "" })}
        >
          {t("leads.allStatuses")}
          <b>{total}</b>
        </button>
        {LEAD_STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            className={filters.status === status ? "active" : ""}
            onClick={() =>
              replaceFilters({
                ...filters,
                status: filters.status === status ? "" : status,
              })
            }
          >
            {labelStatus(locale, status)}
            <b>{statusCounts[status] || 0}</b>
          </button>
        ))}
      </div>

      <form className="st-leads-filter-panel" onSubmit={submitFilters}>
        <div className="st-leads-filter-primary">
          <label className="st-search st-leads-search">
            <Search size={16} />
            <input name="q" defaultValue={filters.q} placeholder={t("leads.searchPlaceholder")} />
          </label>
          <select className="st-select" name="assigneeId" defaultValue={filters.assigneeId}>
            <option value="">{t("leads.allAssignees")}</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name || user.email || user.id.slice(0, 8)}
              </option>
            ))}
          </select>
          <input type="hidden" name="status" value={filters.status} />
          <button className="st-btn primary" type="submit">
            {t("leads.find")}
          </button>
          <button
            type="button"
            className={`st-btn subtle st-leads-more-btn${filtersOpen || hasAdvanced ? " open" : ""}`}
            onClick={() => setFiltersOpen((value) => !value)}
          >
            {t("leads.moreFilters")}
            <ChevronDown size={14} />
          </button>
        </div>

        {(filtersOpen || hasAdvanced) && (
          <div className="st-leads-filter-advanced">
            <label className="st-label">
              <span>{t("leads.priorityLabel")}</span>
              <select className="st-select" name="priority" defaultValue={filters.priority}>
                <option value="">{t("leads.allPriorities")}</option>
                {(["low", "normal", "high"] as const).map((priority) => (
                  <option key={priority} value={priority}>
                    {labelPriority(locale, priority)}
                  </option>
                ))}
              </select>
            </label>
            <label className="st-label">
              <span>{t("leads.source")}</span>
              <input className="st-input" name="source" defaultValue={filters.source} />
            </label>
            <label className="st-label">
              <span>{t("leads.intent")}</span>
              <input className="st-input" name="intent" defaultValue={filters.intent} />
            </label>
            <label className="st-label">
              <span>{t("leads.locale")}</span>
              <input className="st-input" name="locale" defaultValue={filters.locale} />
            </label>
            <label className="st-label">
              <span>{t("dashboard.customFrom")}</span>
              <input
                className="st-input"
                type="date"
                name="from"
                defaultValue={filters.from.slice(0, 10)}
              />
            </label>
            <label className="st-label">
              <span>{t("dashboard.customTo")}</span>
              <input
                className="st-input"
                type="date"
                name="to"
                defaultValue={filters.to.slice(0, 10)}
              />
            </label>
            <label className="st-check st-leads-check">
              <input
                type="checkbox"
                name="unassigned"
                defaultChecked={filters.unassigned === "1"}
              />
              {t("leads.unassignedOnly")}
            </label>
          </div>
        )}
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
                    className={`st-lead-card${isSlaBreached(lead) ? " sla" : ""}`}
                    draggable
                    onDragStart={() => setDraggingId(lead.id)}
                    onDragEnd={() => setDraggingId(null)}
                  >
                    <div className="st-lead-card-top">
                      <Link href={studioPath(`/leads/${lead.id}`)} className="st-lead-card-title">
                        {lead.full_name || lead.email || t("leads.fallbackTitle")}
                      </Link>
                      <span className={`st-status st-status-${lead.priority}`}>
                        {labelPriority(locale, lead.priority)}
                      </span>
                    </div>
                    <p className="st-lead-card-biz">{lead.business_name || "—"}</p>
                    <p className="st-lead-card-meta">
                      {lead.source || "—"} · {formatStudioDate(lead.created_at, locale, true)}
                    </p>
                    <footer className="st-lead-card-foot">
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
                {!column.items.length ? (
                  <p className="st-kanban-empty">{t("leads.boardEmpty")}</p>
                ) : null}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <section className="st-leads-list-panel">
          {!items.length ? (
            <p className="st-empty-inline">{t("common.empty")}</p>
          ) : (
            <ul className="st-leads-list">
              {items.map((lead) => (
                <li
                  key={lead.id}
                  className={`st-leads-row${isSlaBreached(lead) ? " sla" : ""}`}
                >
                  <div className="st-leads-row-main">
                    <div className="st-leads-row-title">
                      <Link href={studioPath(`/leads/${lead.id}`)}>
                        {lead.full_name || lead.email || t("leads.fallbackTitle")}
                      </Link>
                      <span className={`st-status st-status-${lead.status.replaceAll("_", "-")}`}>
                        {labelStatus(locale, lead.status)}
                      </span>
                      {isSlaBreached(lead) ? (
                        <span className="st-badge st-badge-danger">{t("leads.slaBreached")}</span>
                      ) : null}
                    </div>
                    <div className="st-leads-row-meta">
                      <span>{lead.business_name || "—"}</span>
                      <span>
                        {lead.email ? (
                          <a href={`mailto:${lead.email}`}>{lead.email}</a>
                        ) : (
                          "—"
                        )}
                      </span>
                      <span>{lead.source || "—"}</span>
                      <span>{formatStudioDate(lead.created_at, locale, true)}</span>
                      <span>{assigneeName(lead, users, t("leads.unassigned"))}</span>
                      <span>{labelPriority(locale, lead.priority)}</span>
                    </div>
                  </div>
                  <div className="st-leads-row-actions">
                    <button
                      type="button"
                      className="st-btn subtle"
                      onClick={() => void claimLead(lead.id)}
                    >
                      {t("leads.claim")}
                    </button>
                    <Link className="st-btn" href={studioPath(`/leads/${lead.id}`)}>
                      {t("leads.open")}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="st-leads-pager">
            <span>
              {t("leads.pagination", {
                from: total ? offset + 1 : 0,
                to: Math.min(offset + limit, total),
                total,
              })}
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
        </section>
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
    </div>
  );
}
