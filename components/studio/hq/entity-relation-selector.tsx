"use client";

import { LoaderCircle, Search, X } from "lucide-react";
import { useEffect, useId, useMemo, useState, type ComponentProps } from "react";

export type RelationOption = {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

export function EntityRelationSelector({ options, value, onChange, label, placeholder = "Search entities…", emptyLabel = "No matching entities.", loading = false, error, multiple = false, disabled = false }: {
  options: readonly RelationOption[];
  value: string | readonly string[] | null;
  onChange: (value: string | string[] | null) => void;
  label?: string;
  placeholder?: string;
  emptyLabel?: string;
  loading?: boolean;
  error?: string;
  multiple?: boolean;
  disabled?: boolean;
}) {
  const selectedIds = useMemo(() => new Set(Array.isArray(value) ? value : value ? [value] : []), [value]);
  const optionsId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const selected = options.filter((option) => selectedIds.has(option.id));
  const filtered = options.filter((option) => `${option.label} ${option.description ?? ""}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));

  function select(option: RelationOption) {
    if (multiple) onChange(selectedIds.has(option.id) ? [...selectedIds].filter((id) => id !== option.id) : [...selectedIds, option.id]);
    else { onChange(option.id); setOpen(false); }
    setQuery("");
  }

  return (
    <div className="st-relation-selector">
      {label ? <span className="st-relation-label">{label}</span> : null}
      {selected.length ? <div className="st-relation-values">{selected.map((option) => <span key={option.id} className="st-relation-chip">{option.label}<button type="button" disabled={disabled} onClick={() => onChange(multiple ? [...selectedIds].filter((id) => id !== option.id) : null)} aria-label={`Remove ${option.label}`}><X size={12} /></button></span>)}</div> : null}
      <div className="st-relation-control">
        <Search size={15} aria-hidden />
        <input className="st-input" value={query} disabled={disabled} placeholder={placeholder} onFocus={() => setOpen(true)} onChange={(event) => { setQuery(event.target.value); setOpen(true); }} aria-controls={optionsId} aria-expanded={open} role="combobox" />
        {loading ? <LoaderCircle className="st-spin" size={15} /> : null}
      </div>
      {error ? <p className="st-error">{error}</p> : null}
      {open && !disabled ? <div id={optionsId} className="st-relation-options" role="listbox" aria-multiselectable={multiple || undefined}>
        {filtered.length ? filtered.map((option) => <button key={option.id} type="button" role="option" aria-selected={selectedIds.has(option.id)} disabled={option.disabled} onClick={() => select(option)}><strong>{option.label}</strong>{option.description ? <small>{option.description}</small> : null}</button>) : <span className="st-relation-empty">{emptyLabel}</span>}
      </div> : null}
    </div>
  );
}

export function RemoteEntityRelationSelector({ endpoint, mapOption, debounceMs = 250, ...props }: Omit<ComponentProps<typeof EntityRelationSelector>, "options" | "loading" | "error"> & {
  endpoint: string;
  mapOption: (item: unknown) => RelationOption | null;
  debounceMs?: number;
}) {
  const [options, setOptions] = useState<RelationOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const timer = globalThis.setTimeout(async () => {
      setLoading(true); setError("");
      try {
        const response = await fetch(endpoint, { signal: controller.signal, headers: { Accept: "application/json" } });
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`.trim());
        const payload: unknown = await response.json();
        const source = Array.isArray(payload) ? payload : payload && typeof payload === "object" && Array.isArray((payload as { data?: unknown }).data) ? (payload as { data: unknown[] }).data : [];
        setOptions(source.map(mapOption).filter((option): option is RelationOption => option !== null));
      } catch (reason) {
        if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : String(reason));
      } finally { if (!controller.signal.aborted) setLoading(false); }
    }, debounceMs);
    return () => { controller.abort(); globalThis.clearTimeout(timer); };
  }, [debounceMs, endpoint, mapOption]);

  return <EntityRelationSelector {...props} options={options} loading={loading} error={error} />;
}
