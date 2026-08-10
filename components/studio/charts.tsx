/** Simple SVG charts for Studio dashboard (no chart library). */

export function BarChart({
  items,
  maxHeight = 140,
}: {
  items: Array<{ label: string; value: number; color?: string }>;
  maxHeight?: number;
}) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <div className="st-chart-bars" style={{ height: maxHeight }}>
      {items.map((item) => {
        const h = Math.round((item.value / max) * (maxHeight - 28));
        return (
          <div key={item.label} className="st-chart-bar-col">
            <div className="st-chart-bar-value">{item.value}</div>
            <div
              className="st-chart-bar"
              style={{
                height: Math.max(4, h),
                background: item.color || "var(--st-gold)",
              }}
              title={`${item.label}: ${item.value}`}
            />
            <div className="st-chart-bar-label">{item.label}</div>
          </div>
        );
      })}
    </div>
  );
}

export function DonutChart({
  items,
  size = 160,
}: {
  items: Array<{ label: string; value: number; color: string }>;
  size?: number;
}) {
  const total = items.reduce((s, i) => s + i.value, 0) || 1;
  const r = 56;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="st-donut-wrap">
      <svg width={size} height={size} viewBox="0 0 160 160" aria-hidden>
        <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="18" />
        {items.map((item) => {
          const len = (item.value / total) * c;
          const el = (
            <circle
              key={item.label}
              cx="80"
              cy="80"
              r={r}
              fill="none"
              stroke={item.color}
              strokeWidth="18"
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 80 80)"
            />
          );
          offset += len;
          return el;
        })}
        <text x="80" y="76" textAnchor="middle" fill="var(--st-text)" fontSize="22" fontWeight="700">
          {items.reduce((s, i) => s + i.value, 0)}
        </text>
        <text x="80" y="96" textAnchor="middle" fill="var(--st-muted)" fontSize="11">
          всего
        </text>
      </svg>
      <ul className="st-donut-legend">
        {items.map((item) => (
          <li key={item.label}>
            <span className="st-dot" style={{ background: item.color }} />
            {item.label}
            <strong>{item.value}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Sparkline({ values, width = 280, height = 72 }: { values: number[]; width?: number; height?: number }) {
  const max = Math.max(1, ...values);
  const step = values.length > 1 ? width / (values.length - 1) : width;
  const points = values
    .map((v, i) => {
      const x = i * step;
      const y = height - 8 - (v / max) * (height - 16);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="st-sparkline">
      <polyline
        fill="none"
        stroke="var(--st-gold)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />
      {values.map((v, i) => {
        const x = i * step;
        const y = height - 8 - (v / max) * (height - 16);
        return <circle key={i} cx={x} cy={y} r="3" fill="var(--st-gold)" />;
      })}
    </svg>
  );
}
