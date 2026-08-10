type TrendPoint = { label: string; value: number };
type BreakdownItem = { label: string; value: number; color?: string };

export function LeadsTrendChart({ points }: { points: TrendPoint[] }) {
  const max = Math.max(1, ...points.map((point) => point.value));
  const width = 760;
  const height = 210;
  const padX = 20;
  const padY = 24;
  const innerWidth = width - padX * 2;
  const innerHeight = height - padY * 2;
  const coordinates = points.map((point, index) => ({
    x: padX + (index / Math.max(points.length - 1, 1)) * innerWidth,
    y: padY + innerHeight - (point.value / max) * innerHeight,
    ...point,
  }));
  const line = coordinates.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `${padX},${height - padY} ${line} ${width - padX},${height - padY}`;

  return (
    <div className="st-chart-wrap">
      <svg
        className="st-line-chart"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Leads received in the last 14 days"
      >
        {[0, 0.5, 1].map((fraction) => (
          <line
            key={fraction}
            x1={padX}
            x2={width - padX}
            y1={padY + innerHeight * fraction}
            y2={padY + innerHeight * fraction}
            className="st-chart-grid"
          />
        ))}
        <defs>
          <linearGradient id="leadArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4af37" stopOpacity=".3" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#leadArea)" />
        <polyline points={line} className="st-chart-line" />
        {coordinates.map((point) => (
          <g key={point.label}>
            <circle cx={point.x} cy={point.y} r="4" className="st-chart-dot" />
            <title>{point.label}: {point.value}</title>
          </g>
        ))}
      </svg>
      <div className="st-chart-labels">
        {points.map((point, index) =>
          index % 3 === 0 || index === points.length - 1 ? (
            <span key={point.label}>{point.label}</span>
          ) : <span key={point.label} />,
        )}
      </div>
    </div>
  );
}

export function BreakdownChart({
  items,
  emptyLabel = "Данных пока нет",
}: {
  items: BreakdownItem[];
  emptyLabel?: string;
}) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  if (!total) return <div className="st-chart-empty">{emptyLabel}</div>;

  return (
    <div className="st-breakdown">
      {items.map((item) => {
        const percentage = Math.round((item.value / total) * 100);
        return (
          <div className="st-breakdown-row" key={item.label}>
            <div>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
            <div className="st-progress">
              <span
                style={{
                  width: `${percentage}%`,
                  background: item.color || "var(--st-gold)",
                }}
              />
            </div>
            <small>{percentage}%</small>
          </div>
        );
      })}
    </div>
  );
}

export function ContentHealth({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const normalized = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="st-health">
      <div
        className="st-health-ring"
        style={{
          background: `conic-gradient(var(--st-gold) ${normalized * 3.6}deg, var(--st-panel-2) 0deg)`,
        }}
      >
        <span>{normalized}%</span>
      </div>
      <div>
        <strong>{label}</strong>
        <small>
          {normalized >= 90
            ? "Все переводы готовы"
            : normalized >= 60
              ? "Некоторые переводы требуют внимания"
              : "Контент требует внимания"}
        </small>
      </div>
    </div>
  );
}
