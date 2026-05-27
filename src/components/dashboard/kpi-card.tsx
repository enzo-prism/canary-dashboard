import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDelta } from "@/lib/format";
import type { Kpi } from "@/data/types";

export function DeltaBadge({
  deltaPct,
  invertDelta = false,
}: {
  deltaPct: number;
  invertDelta?: boolean;
}) {
  const positive = invertDelta ? deltaPct < 0 : deltaPct > 0;
  const negative = invertDelta ? deltaPct > 0 : deltaPct < 0;
  const Icon = deltaPct >= 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium tabular-nums",
        positive && "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
        negative && "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
        !positive && !negative && "bg-muted text-muted-foreground",
      )}
    >
      <Icon className="size-3" />
      {formatDelta(deltaPct)}
    </span>
  );
}

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const caption = kpi.caption ?? (kpi.deltaPct !== undefined ? "vs. previous 28 days" : undefined);
  return (
    <Card className="gap-0 p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">{kpi.label}</span>
        {kpi.deltaPct !== undefined && (
          <DeltaBadge deltaPct={kpi.deltaPct} invertDelta={kpi.invertDelta} />
        )}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{kpi.value}</div>
      {caption && <div className="mt-0.5 text-xs text-muted-foreground">{caption}</div>}
    </Card>
  );
}

export function KpiGrid({ kpis }: { kpis: Kpi[] }) {
  const cols = kpis.length <= 4 ? "lg:grid-cols-4" : "lg:grid-cols-6";
  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3", cols)}>
      {kpis.map((kpi) => (
        <KpiCard key={kpi.label} kpi={kpi} />
      ))}
    </div>
  );
}
