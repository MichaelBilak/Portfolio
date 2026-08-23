"use client";

import { AlertTriangle, LoaderCircle, X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";

export function StudioModal({ open, onClose, title, description, children, footer, size = "md", closeLabel = "Close" }: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  closeLabel?: string;
}) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = [...panelRef.current.querySelectorAll<HTMLElement>("button, a[href], input, select, textarea, [tabindex]:not([tabindex='-1'])")].filter((element) => !element.hasAttribute("disabled"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => panelRef.current?.focus());
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
      previous?.focus();
    };
  }, [onClose, open]);

  if (!open) return null;
  return (
    <div className="st-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={panelRef} className={`st-modal st-modal-${size}`} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined} tabIndex={-1}>
        <button type="button" className="st-icon-btn st-modal-close" onClick={onClose} aria-label={closeLabel}><X size={17} /></button>
        <header className="st-modal-header">
          <h2 id={titleId}>{title}</h2>
          {description ? <p id={descriptionId}>{description}</p> : null}
        </header>
        <div className="st-modal-body">{children}</div>
        {footer ? <footer className="st-modal-footer">{footer}</footer> : null}
      </section>
    </div>
  );
}

export function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel = "Confirm", cancelLabel = "Cancel", destructive = false, busy = false }: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: ReactNode;
  description?: ReactNode;
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
  destructive?: boolean;
  busy?: boolean;
}) {
  return (
    <StudioModal open={open} onClose={busy ? () => undefined : onClose} title={title} description={description} size="sm"
      footer={<div className="st-row"><button type="button" className={`st-btn ${destructive ? "danger" : "primary"}`} disabled={busy} onClick={() => void onConfirm()}>{busy ? <LoaderCircle className="st-spin" size={15} /> : destructive ? <AlertTriangle size={15} /> : null}{confirmLabel}</button><button type="button" className="st-btn subtle" disabled={busy} onClick={onClose}>{cancelLabel}</button></div>}>
      {destructive ? <div className="st-confirm-warning"><AlertTriangle size={20} aria-hidden /></div> : null}
    </StudioModal>
  );
}
