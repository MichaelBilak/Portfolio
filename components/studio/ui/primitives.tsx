import { Archive, ArrowDownRight, ArrowUpRight, Minus, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type StatusTone = "neutral" | "success" | "warning" | "danger" | "info";

export function StatusBadge({ value, label, tone, className }: {
  value: string;
  label?: ReactNode;
  tone?: StatusTone;
  className?: string;
}) {
  const slug = value.trim().toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return <span className={["st-status", `st-status-${slug || "neutral"}`, tone && `st-status-tone-${tone}`, className].filter(Boolean).join(" ")}>{label ?? value.replaceAll("_", " ")}</span>;
}

export function EntityHeader({ eyebrow, title, subtitle, meta, actions, backLink }: {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  backLink?: ReactNode;
}) {
  return (
    <>
      {backLink ? <div className="st-entity-back">{backLink}</div> : null}
      <header className="st-page-header st-entity-header">
        <div>
          {eyebrow ? <p className="st-eyebrow">{eyebrow}</p> : null}
          <h1 className="st-h1">{title}</h1>
          {subtitle ? <p className="st-sub">{subtitle}</p> : null}
          {meta ? <div className="st-row st-entity-meta">{meta}</div> : null}
        </div>
        {actions ? <div className="st-row st-entity-actions">{actions}</div> : null}
      </header>
    </>
  );
}

export function EmptyState({ title, description, icon: Icon = Archive, action, compact = false }: {
  title: ReactNode;
  description?: ReactNode;
  icon?: LucideIcon;
  action?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={`st-state st-empty-state${compact ? " st-empty-state-compact" : ""}`}>
      <Icon size={compact ? 22 : 30} aria-hidden />
      <strong>{title}</strong>
      {description ? <span>{description}</span> : null}
      {action ? <div className="st-row">{action}</div> : null}
    </div>
  );
}

export function MetricCard({ label, value, hint, delta, icon: Icon, tone = "neutral" }: {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
  delta?: number;
  icon?: LucideIcon;
  tone?: StatusTone;
}) {
  const DeltaIcon = delta == null || delta === 0 ? Minus : delta > 0 ? ArrowUpRight : ArrowDownRight;
  return (
    <article className={`st-metric st-metric-${tone}`}>
      {Icon ? <span className="st-metric-icon"><Icon size={18} aria-hidden /></span> : null}
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
        {delta != null ? <em className={delta > 0 ? "positive" : delta < 0 ? "negative" : undefined}><DeltaIcon size={12} aria-hidden /> {Math.abs(delta)}%</em> : null}
        {hint ? <em>{hint}</em> : null}
      </div>
    </article>
  );
}

export function Currency({ value, currency = "EUR", locale = "it-IT", compact = false, fallback = "—" }: {
  value: number | string | null | undefined;
  currency?: string;
  locale?: string;
  compact?: boolean;
  fallback?: ReactNode;
}) {
  const amount = typeof value === "number" ? value : value == null || value === "" ? Number.NaN : Number(value);
  if (!Number.isFinite(amount)) return <>{fallback}</>;
  return <span className="st-currency">{new Intl.NumberFormat(locale, { style: "currency", currency, notation: compact ? "compact" : "standard", maximumFractionDigits: compact ? 1 : 2 }).format(amount)}</span>;
}
