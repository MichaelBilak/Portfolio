"use client";

import { AlertCircle, CheckCircle2, Info, LoaderCircle, X } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type ToastTone = "success" | "error" | "info";
export type ToastInput = { title: string; message?: string; tone?: ToastTone; duration?: number };
type ToastRecord = ToastInput & { id: string };
type ToastContextValue = { toast: (input: ToastInput) => string; dismiss: (id: string) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

export function StudioToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastRecord[]>([]);
  const dismiss = useCallback((id: string) => setItems((current) => current.filter((item) => item.id !== id)), []);
  const toast = useCallback((input: ToastInput) => {
    const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
    setItems((current) => [...current, { ...input, id }]);
    if (input.duration !== 0) globalThis.setTimeout(() => dismiss(id), input.duration ?? 4500);
    return id;
  }, [dismiss]);
  const value = useMemo(() => ({ toast, dismiss }), [dismiss, toast]);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="st-toast-region" role="region" aria-label="Notifications">
        {items.map((item) => {
          const Icon = item.tone === "success" ? CheckCircle2 : item.tone === "error" ? AlertCircle : Info;
          return <div key={item.id} className={`st-toast st-toast-${item.tone ?? "info"}`} role={item.tone === "error" ? "alert" : "status"}><Icon size={18} /><div><strong>{item.title}</strong>{item.message ? <span>{item.message}</span> : null}</div><button type="button" className="st-icon-btn" onClick={() => dismiss(item.id)} aria-label="Dismiss"><X size={14} /></button></div>;
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useStudioToast(): ToastContextValue {
  const value = useContext(ToastContext);
  if (!value) throw new Error("useStudioToast must be used within StudioToastProvider");
  return value;
}

export function StudioLoading({ label = "Loading…", compact = false }: { label?: ReactNode; compact?: boolean }) {
  return <div className={`st-state st-loading${compact ? " st-loading-compact" : ""}`} role="status"><LoaderCircle className="st-spin" size={compact ? 18 : 26} /><strong>{label}</strong></div>;
}

export function Skeleton({ width, height = "1em", rounded = false, className }: {
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  className?: string;
}) {
  return <span className={["st-skeleton", rounded && "st-skeleton-rounded", className].filter(Boolean).join(" ")} style={{ width, height }} aria-hidden />;
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return <div className="st-table-wrap" aria-busy="true" aria-label="Loading table"><table className="st-table st-skeleton-table"><tbody>{Array.from({ length: rows }, (_, row) => <tr key={row}>{Array.from({ length: columns }, (_, column) => <td key={column}><Skeleton width={`${55 + ((row + column) % 4) * 10}%`} /></td>)}</tr>)}</tbody></table></div>;
}
