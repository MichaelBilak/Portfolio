import { Clock3, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type ActivityTimelineItem = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  timestamp: string | Date;
  actor?: ReactNode;
  icon?: LucideIcon;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
};

export function ActivityTimeline({ items, locale = "it-IT", empty = "No activity yet." }: {
  items: readonly ActivityTimelineItem[];
  locale?: string;
  empty?: ReactNode;
}) {
  const formatter = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" });
  if (!items.length) return <p className="st-empty-inline">{empty}</p>;
  return (
    <ol className="st-activity-timeline">
      {items.map((item) => {
        const Icon = item.icon ?? Clock3;
        const date = item.timestamp instanceof Date ? item.timestamp : new Date(item.timestamp);
        const validDate = !Number.isNaN(date.getTime());
        return (
          <li key={item.id} className={`st-activity-item st-activity-${item.tone ?? "neutral"}`}>
            <span className="st-activity-icon"><Icon size={15} aria-hidden /></span>
            <div className="st-activity-content">
              <div className="st-activity-head"><strong>{item.title}</strong>{validDate ? <time dateTime={date.toISOString()}>{formatter.format(date)}</time> : null}</div>
              {item.description ? <div className="st-activity-description">{item.description}</div> : null}
              {item.actor ? <small>{item.actor}</small> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
