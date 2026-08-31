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
        "inline-flex items-center gap-0.5 text-xs font-medium tabular-nums",
        positive && "text-foreground",
        negative && "text-destructive",
        !positive && !negative && "text-muted-foreground",
      )}
    >
      <Icon className="size-3" />
      {formatDelta(deltaPct)}
    </span>
  );
}

export function KpiStat({ kpi }: { kpi: Kpi }) {
  const caption =
    kpi.caption ?? (kpi.deltaPct !== undefined ? "vs. previous 28 days" : undefined);
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-[0.06em] text-muted-foreground">
        {kpi.label}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-[32px] font-semibold leading-none tracking-[-0.011em] tabular-nums">
          {kpi.value}
        </span>
        {kpi.deltaPct !== undefined && (
          <DeltaBadge deltaPct={kpi.deltaPct} invertDelta={kpi.invertDelta} />
        )}
      </div>
      {caption && <div className="mt-2 text-sm text-muted-foreground">{caption}</div>}
    </div>
  );
}

export function KpiCard({ kpi }: { kpi: Kpi }) {
  return <KpiStat kpi={kpi} />;
}

export function KpiGrid({ kpis }: { kpis: Kpi[] }) {
  const cols = kpis.length <= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3 xl:grid-cols-6";
  return (
    <Card>
      <div className={cn("grid grid-cols-2 gap-6 px-6 sm:grid-cols-3", cols)}>
        {kpis.map((kpi) => (
          <KpiStat key={kpi.label} kpi={kpi} />
        ))}
      </div>
    </Card>
  );
}
