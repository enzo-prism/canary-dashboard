import Link from "next/link";
import { ArrowRight, CalendarRange, ExternalLink } from "lucide-react";
import { getSite } from "@/lib/sites";
import { getPortfolioSummary } from "@/data/snapshots";
import { RANGE_END, rangeStart } from "@/data/series";
import { Card, CardContent } from "@/components/ui/card";
import { DeltaBadge } from "@/components/dashboard/kpi-card";
import { SiteLogo } from "@/components/dashboard/site-logo";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";

function Metric({
  label,
  value,
  delta,
  invert,
}: {
  label: string;
  value: string;
  delta: number;
  invert?: boolean;
}) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-0.5 flex items-center gap-1.5">
        <span className="text-lg font-semibold tabular-nums">{value}</span>
        <DeltaBadge deltaPct={delta} invertDelta={invert} />
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const summary = getPortfolioSummary();

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 border-b bg-background px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Portfolio overview</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Performance across Don Listwin&apos;s four web properties, managed by Prism.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 self-start rounded-md border bg-muted/40 px-2.5 py-1.5 text-sm lg:self-auto">
          <CalendarRange className="size-4 text-muted-foreground" />
          <span className="font-medium">Last 28 days</span>
          <span className="text-muted-foreground">
            ({formatDate(rangeStart())} – {formatDate(RANGE_END)})
          </span>
        </div>
      </div>

      <div className="grid gap-4 px-4 py-5 sm:px-6 md:grid-cols-2">
        {summary.map((row) => {
          const site = getSite(row.siteId)!;
          return (
            <Card key={row.siteId} className="transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <SiteLogo site={site} className="size-11 rounded-lg" />
                    <div>
                      <span className="block font-semibold">{site.name}</span>
                      <a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-0.5 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground hover:underline"
                      >
                        {site.domain}
                        <ExternalLink className="size-3" />
                      </a>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">{site.blurb}</p>

                <div className="grid grid-cols-3 gap-3 border-t pt-4">
                  <Metric label="Active users" value={row.users} delta={row.usersDelta} />
                  <Metric label="Search clicks" value={row.clicks} delta={row.clicksDelta} />
                  <div>
                    <div className="text-xs text-muted-foreground">Leads</div>
                    <div
                      className={cn(
                        "mt-0.5 text-lg font-semibold tabular-nums",
                        row.leads === null && "text-muted-foreground/50",
                      )}
                    >
                      {row.leads ?? "—"}
                    </div>
                  </div>
                </div>

                <Link
                  href={`/${site.id}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  View dashboard
                  <ArrowRight className="size-4" />
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
