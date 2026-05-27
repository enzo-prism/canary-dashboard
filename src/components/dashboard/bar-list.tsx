import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import type { BarDatum } from "@/data/types";

const PALETTE = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function BarList({
  data,
  valueLabel = "sessions",
}: {
  data: BarDatum[];
  valueLabel?: string;
}) {
  const max = Math.max(...data.map((d) => d.pct), 1);
  return (
    <ul className="space-y-3">
      {data.map((d, i) => (
        <li key={d.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="truncate text-foreground/90">{d.label}</span>
            <span className="ml-3 shrink-0 tabular-nums text-muted-foreground">
              {formatNumber(d.value)}
              <span className="ml-1.5 text-xs">({d.pct}%)</span>
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full")}
              style={{
                width: `${(d.pct / max) * 100}%`,
                background: PALETTE[i % PALETTE.length],
              }}
            />
          </div>
        </li>
      ))}
      <li className="pt-0.5 text-xs text-muted-foreground">By {valueLabel}</li>
    </ul>
  );
}
