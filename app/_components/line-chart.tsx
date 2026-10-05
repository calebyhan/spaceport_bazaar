// Server-rendered SVG line chart. Hover needs no script: each tick has a
// hit column whose crosshair and markers appear under the pointer, and whose
// title lists every series at that tick. The per-tick table is the
// accessible fallback and lives with the chart's caller.
export type Series = { key: string; label: string; values: number[] };

const WIDTH = 720, HEIGHT = 240;
const PAD = { top: 14, right: 92, bottom: 30, left: 44 };
const LABEL_GAP = 13;

export function niceStep(max: number, count = 4): number {
  if (max <= 0) return 1;
  const raw = max / count, power = 10 ** Math.floor(Math.log10(raw)), unit = raw / power;
  return (unit <= 1 ? 1 : unit <= 2 ? 2 : unit <= 2.5 ? 2.5 : unit <= 5 ? 5 : 10) * power;
}

export function LineChart({ label, ticks, series, flagged = [], flagLabel, maxValue }: {
  label: string; ticks: number[]; series: Series[];
  flagged?: number[]; flagLabel?: string; maxValue?: number;
}) {
  if (!ticks.length) return <p className="empty">No tick summaries were recorded.</p>;
  const plotW = WIDTH - PAD.left - PAD.right, plotH = HEIGHT - PAD.top - PAD.bottom;
  const top = Math.max(maxValue ?? 0, ...series.flatMap(s => s.values));
  const step = niceStep(top), yMax = Math.max(step, Math.ceil(top / step) * step);
  const first = ticks[0], span = Math.max(1, ticks.at(-1)! - first);
  const x = (tick: number) => PAD.left + ((tick - first) / span) * plotW;
  const y = (value: number) => PAD.top + plotH - (value / yMax) * plotH;
  const column = plotW / Math.max(1, ticks.length - 1);
  const yTicks = Array.from({ length: Math.round(yMax / step) + 1 }, (_, i) => i * step);
  const xStep = niceStep(span, 6);
  const xTicks = Array.from({ length: Math.floor(span / xStep) + 1 }, (_, i) => first + i * xStep);
  const flags = new Set(flagged);

  // End labels sit at each line's last value; one that would overlap a label
  // already placed is left to the legend instead of being nudged off its line.
  const placed: number[] = [];
  const endLabels = series.map(s => {
    const at = y(s.values.at(-1)!);
    if (placed.some(p => Math.abs(p - at) < LABEL_GAP)) return null;
    placed.push(at);
    return at;
  });

  return (
    <figure className="chart">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={label}>
        {yTicks.map(value => (
          <g key={value} className="grid">
            <line x1={PAD.left} x2={PAD.left + plotW} y1={y(value)} y2={y(value)} />
            <text x={PAD.left - 8} y={y(value)} dy="0.32em" textAnchor="end">{value.toLocaleString("en")}</text>
          </g>
        ))}
        {xTicks.map(tick => (
          <text key={tick} className="axis" x={x(tick)} y={HEIGHT - 8} textAnchor="middle">{tick}</text>
        ))}
        {ticks.filter(tick => flags.has(tick)).map(tick => (
          <rect key={tick} className="flag" x={x(tick) - 1.5} y={PAD.top + plotH + 3} width={3} height={6} rx={1} />
        ))}
        {series.map((s, i) => (
          <polyline key={s.key} className={`line series-${i + 1}`} fill="none"
            points={s.values.map((value, j) => `${x(ticks[j]).toFixed(1)},${y(value).toFixed(1)}`).join(" ")} />
        ))}
        {series.map((s, i) => endLabels[i] === null ? null : (
          <g key={s.key} className="end-label">
            <circle className={`dot series-${i + 1}`} cx={x(ticks.at(-1)!)} cy={endLabels[i]!} r={4} />
            <text x={x(ticks.at(-1)!) + 9} y={endLabels[i]!} dy="0.32em">{s.label} {s.values.at(-1)}</text>
          </g>
        ))}
        {ticks.map((tick, j) => (
          <g key={tick} className="hit">
            <title>{[`Tick ${tick}`, ...series.map(s => `${s.label}: ${s.values[j]}`), ...(flags.has(tick) && flagLabel ? [flagLabel] : [])].join("\n")}</title>
            <rect x={x(tick) - column / 2} y={PAD.top} width={column} height={plotH} />
            <line x1={x(tick)} x2={x(tick)} y1={PAD.top} y2={PAD.top + plotH} />
            {series.map((s, i) => <circle key={s.key} className={`dot series-${i + 1}`} cx={x(tick)} cy={y(s.values[j])} r={4} />)}
          </g>
        ))}
      </svg>
      <figcaption className="legend">
        {series.length > 1 ? series.map((s, i) => (
          <span key={s.key}><i className={`key series-${i + 1}`} aria-hidden="true" />{s.label}</span>
        )) : null}
        {flags.size && flagLabel ? <span><i className="key flag" aria-hidden="true" />{flagLabel}</span> : null}
      </figcaption>
    </figure>
  );
}
