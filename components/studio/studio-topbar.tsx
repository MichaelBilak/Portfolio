"use client";

import Link from "next/link";
import { Bell, BriefcaseBusiness, Building2, CheckSquare2, ChevronDown, FileText, FolderKanban, Handshake, Inbox, LoaderCircle, Plus, Search, UserRound, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { studioPath } from "@/lib/studio/path";

type SearchRow = Record<string, unknown>;
type SearchPayload = { cases?: SearchRow[]; tasks?: SearchRow[]; documents?: SearchRow[]; leads?: SearchRow[]; companies?: SearchRow[]; contacts?: SearchRow[]; deals?: SearchRow[]; clientProjects?: SearchRow[]; products?: SearchRow[] };
type SearchResult = { id: string; title: string; subtitle?: string; href: string; group: string; icon: typeof Search };

function asText(value: unknown, fallback = ""): string {
  return typeof value === "string" || typeof value === "number" ? String(value) : fallback;
}

function flattenResults(payload: SearchPayload): SearchResult[] {
  return [
    ...(payload.cases ?? []).map((row) => ({ id: `case-${asText(row.id)}`, title: asText(row.title, "Untitled case"), subtitle: asText(row.client_name ?? row.company_name), href: studioPath(`/cases/${encodeURIComponent(asText(row.id))}`), group: "Cases", icon: BriefcaseBusiness })),
    ...(payload.tasks ?? []).map((row) => ({
      id: `task-${asText(row.id)}`,
      title: asText(row.title, "Untitled task"),
      subtitle: asText(row.status),
      href: row.client_project_id
        ? studioPath(`/projects/${encodeURIComponent(asText(row.client_project_id))}`)
        : row.deal_id
          ? studioPath(`/deals/${encodeURIComponent(asText(row.deal_id))}`)
          : row.case_id
            ? studioPath(`/cases/${encodeURIComponent(asText(row.case_id))}`)
            : studioPath("/tasks"),
      group: "Tasks",
      icon: CheckSquare2,
    })),
    ...(payload.documents ?? []).map((row) => ({ id: `document-${asText(row.id)}`, title: asText(row.title, "Untitled document"), subtitle: asText(row.status), href: row.case_id ? studioPath(`/cases/${encodeURIComponent(asText(row.case_id))}`) : studioPath("/documents"), group: "Documents", icon: FileText })),
    ...(payload.leads ?? []).map((row) => ({ id: `lead-${asText(row.id)}`, title: asText(row.full_name ?? row.business_name, "Untitled lead"), subtitle: asText(row.email ?? row.status), href: studioPath(`/leads/${encodeURIComponent(asText(row.id))}`), group: "Leads", icon: UserRound })),
    ...(payload.companies ?? []).map((row) => ({ id: `company-${asText(row.id)}`, title: asText(row.name, "Untitled company"), subtitle: asText(row.status), href: studioPath(`/companies/${encodeURIComponent(asText(row.id))}`), group: "Companies", icon: Building2 })),
    ...(payload.contacts ?? []).map((row) => ({ id: `contact-${asText(row.id)}`, title: `${asText(row.first_name)} ${asText(row.last_name)}`.trim() || asText(row.email, "Contact"), subtitle: asText(row.email), href: studioPath(`/companies/${encodeURIComponent(asText(row.company_id))}`), group: "Contacts", icon: UserRound })),
    ...(payload.deals ?? []).map((row) => ({ id: `deal-${asText(row.id)}`, title: asText(row.title, "Untitled deal"), subtitle: asText(row.stage), href: studioPath(`/deals/${encodeURIComponent(asText(row.id))}`), group: "Deals", icon: Handshake })),
    ...(payload.clientProjects ?? []).map((row) => ({ id: `project-${asText(row.id)}`, title: asText(row.name, "Untitled project"), subtitle: asText(row.status), href: studioPath(`/projects/${encodeURIComponent(asText(row.id))}`), group: "Projects", icon: FolderKanban })),
  ];
}

export function GlobalSearch({ placeholder = "Search HQ…", debounceMs = 250, onNavigate }: {
  placeholder?: string;
  debounceMs?: number;
  onNavigate?: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const resultsId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) { setResults([]); setError(""); setLoading(false); return; }
    const controller = new AbortController();
    const timer = globalThis.setTimeout(async () => {
      setLoading(true); setError("");
      try {
        const response = await fetch(`/api/studio/search?q=${encodeURIComponent(trimmed)}`, { signal: controller.signal, headers: { Accept: "application/json" } });
        if (!response.ok) throw new Error(response.status === 400 ? "Enter at least 2 characters." : "Search unavailable.");
        setResults(flattenResults(await response.json() as SearchPayload));
      } catch (reason) {
        if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : String(reason));
      } finally { if (!controller.signal.aborted) setLoading(false); }
    }, debounceMs);
    return () => { controller.abort(); globalThis.clearTimeout(timer); };
  }, [debounceMs, query]);

  return (
    <div className="st-global-search">
      <label className="st-search">
        {loading ? <LoaderCircle className="st-spin" size={15} /> : <Search size={15} />}
        <input ref={inputRef} value={query} onFocus={() => setOpen(true)} onChange={(event) => { setQuery(event.target.value); setOpen(true); }} placeholder={`${placeholder}  Ctrl K`} aria-label={placeholder} aria-controls={resultsId} aria-expanded={open} role="combobox" />
        {query ? <button type="button" className="st-global-search-clear" onClick={() => { setQuery(""); setResults([]); }} aria-label="Clear search"><X size={14} /></button> : null}
      </label>
      {open && query.trim().length >= 2 ? <div id={resultsId} className="st-global-search-results">
        {error ? <p className="st-error">{error}</p> : null}
        {!loading && !error && results.length === 0 ? <p className="st-empty-inline">No results.</p> : null}
        {results.map((result) => { const Icon = result.icon; return <Link key={result.id} href={result.href} onClick={() => { setOpen(false); onNavigate?.(); }}><Icon size={16} /><span><strong>{result.title}</strong><small>{result.group}{result.subtitle ? ` · ${result.subtitle}` : ""}</small></span></Link>; })}
      </div> : null}
    </div>
  );
}

export type QuickCreateItem = { label: string; href: string; icon?: typeof Plus };

export function QuickCreate({ items = [
  { label: "Lead", href: studioPath("/leads?create=1"), icon: Inbox },
  { label: "Deal", href: studioPath("/deals?create=1"), icon: Handshake },
  { label: "Company", href: studioPath("/companies?create=1"), icon: Building2 },
  { label: "Project", href: studioPath("/projects?create=1"), icon: FolderKanban },
  { label: "Task", href: studioPath("/tasks?create=1"), icon: CheckSquare2 },
  { label: "Invoice", href: studioPath("/invoices?create=1"), icon: FileText },
], label = "Create" }: { items?: readonly QuickCreateItem[]; label?: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (event: MouseEvent) => { if (!rootRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  return <div className="st-quick-create" ref={rootRef}><button type="button" className="st-btn primary" onClick={() => setOpen((value) => !value)} aria-expanded={open}><Plus size={15} />{label}<ChevronDown size={13} /></button>{open ? <div className="st-quick-create-menu">{items.map((item) => { const Icon = item.icon ?? Plus; return <Link key={item.href} href={item.href} onClick={() => setOpen(false)}><Icon size={15} />{item.label}</Link>; })}</div> : null}</div>;
}

export function StudioTopbar({ title = "DormUp HQ", search = true, quickCreate = true, quickCreateItems, actions, notificationHref = studioPath("/inbox") }: {
  title?: ReactNode;
  search?: boolean;
  quickCreate?: boolean;
  quickCreateItems?: readonly QuickCreateItem[];
  actions?: ReactNode;
  notificationHref?: string;
}) {
  return <header className="st-topbar"><div className="st-topbar-title">{title}</div>{search ? <GlobalSearch /> : null}<div className="st-topbar-actions">{actions}<Link className="st-icon-btn" href={notificationHref} aria-label="Notifications"><Bell size={17} /></Link>{quickCreate ? <QuickCreate items={quickCreateItems} /> : null}</div></header>;
}
