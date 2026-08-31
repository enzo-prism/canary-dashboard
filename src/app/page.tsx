import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { SITES, getSite } from "@/lib/sites";
import { getDataHealth, getPortfolioSummary } from "@/data/snapshots";
import { RANGE_END, rangeStart } from "@/data/series";
import { Card, CardContent } from "@/components/ui/card";
import { DeltaBadge } from "@/components/dashboard/kpi-card";
import { SiteLogo } from "@/components/dashboard/site-logo";
import { formatDateLong } from "@/lib/format";
import type { PortfolioSiteSummary } from "@/data/types";

function Metric({
  label,
  value,
  delta,
  invert,
}: {
  label: string;
  value: string | null;
  delta?: number;
  invert?: boolean;
}) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-[0.06em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-[32px] font-semibold leading-none tracking-[-0.011em] tabular-nums">
          {value ?? "—"}
        </span>
        {value !== null && delta !== undefined && (
          <DeltaBadge deltaPct={delta} invertDelta={invert} />
        )}
      </div>
    </div>
  );
}

function ProjectCard({ row }: { row: PortfolioSiteSummary }) {
  const site = getSite(row.siteId)!;
  const empty = row.review === "empty";

  return (
    <Card>
      <CardContent className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <SiteLogo site={site} className="size-11 rounded-lg" />
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.06em] text-muted-foreground">
                {site.category}
              </p>
              <span className="mt-2 block text-lg font-semibold">{site.name}</span>
              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground hover:underline"
              >
                {site.domain}
                <ExternalLink className="size-3" />
              </a>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{site.blurb}</p>

        {empty ? (
          <div className="border-t border-border pt-6">
            <p className="text-sm font-medium">No reviewed snapshot yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              GA4 property unknown. Zeros are placeholders, not traffic.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 border-t border-border pt-6 sm:grid-cols-3">
            <Metric label="Users" value={row.users} delta={row.usersDelta} />
            <Metric label="Sessions" value={row.sessions} delta={row.sessionsDelta} />
            <Metric label="Search clicks" value={row.clicks} delta={row.clicksDelta} />
            {row.leads && (
              <>
                <Metric label="Inquiries" value={row.leads.volume} />
                <div>
                  <div className="text-xs font-medium uppercase tracking-[0.06em] text-muted-foreground">
                    Conversion
                  </div>
                  <div className="mt-2 text-[32px] font-semibold leading-none tracking-[-0.011em] tabular-nums">
                    {row.leads.booking ?? "—"}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {row.leads.booking} of {row.leads.unique} unique leads requested dates
                  </p>
                </div>
                {row.leadsUpdatedAt && (
                  <div>
                    <div className="text-xs font-medium uppercase tracking-[0.06em] text-muted-foreground">
                      Last refresh
                    </div>
                    <div className="mt-2 text-lg font-semibold tabular-nums">
                      {formatDateLong(row.leadsUpdatedAt)}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">Leads export</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-6 text-sm">
          <Link
            href={`/${site.id}`}
            className="inline-flex items-center gap-1 font-medium hover:underline"
          >
            View snapshot
            <ArrowRight className="size-4" />
          </Link>
          {site.inquiryBoardUrl && (
            <a
              href={site.inquiryBoardUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground hover:underline"
            >
              Live inquiry board
              <ExternalLink className="size-3" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function OverviewPage() {
  const summary = getPortfolioSummary();
  const health = getDataHealth();
  const reviewed = health.filter((row) => row.review === "reviewed").length;
  const empty = health.filter((row) => row.review === "empty").length;

  return (
    <div className="flex flex-col gap-10 px-6 py-10 lg:px-16 lg:py-16">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.06em] text-muted-foreground">
            Don Listwin
          </p>
          <h1 className="mt-2 text-[28px] font-semibold leading-none tracking-[-0.011em]">
            Dashboard snapshot
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
            All five projects. How each is doing from the last reviewed GA4 and
            Search Console export, plus Cove inquiry volume. The live guest roster
            stays on the Cove booking leads board.
          </p>
        </div>
        <div className="text-sm text-muted-foreground lg:text-right">
          <div className="font-medium text-foreground">Last 28 days</div>
          <div className="mt-2">
            {formatDateLong(rangeStart())} – {formatDateLong(RANGE_END)}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {summary.map((row) => (
          <ProjectCard key={row.siteId} row={row} />
        ))}
      </div>

      <Card>
        <CardContent className="flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-semibold">Data health</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {reviewed} reviewed snapshots, {empty} empty. Property IDs are
              labels only — this board does not call Google or Formspree.
            </p>
          </div>
          <ul className="divide-y divide-border">
            {health.map((row) => {
              const site = SITES.find((s) => s.id === row.siteId)!;
              return (
                <li key={row.siteId} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-4">
                    <span className="font-medium">{site.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {row.review === "reviewed"
                        ? row.updatedAt
                          ? `Refreshed ${formatDateLong(row.updatedAt)}`
                          : "Reviewed"
                        : "No reviewed snapshot yet"}
                    </span>
                  </div>
                  {site.ga4Properties.length > 0 ? (
                    <p className="text-sm text-muted-foreground">
                      GA4{" "}
                      {site.ga4Properties
                        .map((p) => {
                          const source = p.snapshotSource ? ", snapshot source" : "";
                          return `${p.id} (${p.label}${source})`;
                        })
                        .join(" · ")}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      GA4 property unknown. Not in the Prism map as its own property.
                    </p>
                  )}
                  {row.leadsUpdatedAt && (
                    <p className="text-sm text-muted-foreground">
                      Leads export {formatDateLong(row.leadsUpdatedAt)}. Full roster:{" "}
                      <a
                        href={site.inquiryBoardUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-foreground"
                      >
                        canarycove-dash
                      </a>
                      .
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
