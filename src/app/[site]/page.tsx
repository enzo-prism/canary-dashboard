import { notFound } from "next/navigation";
import {
  BarChart3,
  ExternalLink,
  Globe,
  MapPin,
  MessageSquare,
  MonitorSmartphone,
  Search,
  TrendingUp,
} from "lucide-react";
import { SITES, getSite } from "@/lib/sites";
import { getSnapshot } from "@/data/snapshots";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/dashboard/page-header";
import { KpiGrid } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/section";
import { BarList } from "@/components/dashboard/bar-list";
import { EmptySnapshotNote } from "@/components/dashboard/empty-snapshot";
import {
  LeadsTrendChart,
  SearchTrendChart,
  TrafficTrendChart,
} from "@/components/dashboard/charts";
import {
  QueriesTable,
  SearchPagesTable,
  TopPagesTable,
} from "@/components/dashboard/tables";
import { formatDateLong } from "@/lib/format";

export function generateStaticParams() {
  return SITES.map((s) => ({ site: s.id }));
}

export const dynamicParams = false;

export default async function SitePage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site: siteId } = await params;
  const site = getSite(siteId);
  if (!site) notFound();

  const snapshot = getSnapshot(site.id);
  const { analytics, search, leads } = snapshot;
  const empty = snapshot.review === "empty";

  return (
    <div className="flex flex-col gap-10 px-6 py-10 lg:px-16 lg:py-16">
      <PageHeader site={site} snapshot={snapshot} />

      {empty && (
        <Panel title="Dashboard snapshot">
          <EmptySnapshotNote>
            {snapshot.note ??
              "No reviewed snapshot yet. Zeros below are placeholders, not traffic."}
          </EmptySnapshotNote>
        </Panel>
      )}

      <Tabs defaultValue="analytics" className="gap-6">
        <TabsList>
          <TabsTrigger value="analytics">
            <BarChart3 className="size-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="search">
            <Search className="size-4" />
            Search Console
          </TabsTrigger>
          {leads && (
            <TabsTrigger value="leads">
              <MessageSquare className="size-4" />
              Leads
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="analytics" className="flex flex-col gap-10">
          <KpiGrid kpis={analytics.kpis} />

          <Panel
            title="Traffic over time"
            description="Daily sessions and active users from Google Analytics 4."
            icon={TrendingUp}
          >
            {empty || analytics.trafficTrend.length === 0 ? (
              <EmptySnapshotNote>
                No reviewed daily traffic series for this project.
              </EmptySnapshotNote>
            ) : (
              <TrafficTrendChart data={analytics.trafficTrend} />
            )}
          </Panel>

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title="Channels" description="Where sessions came from." icon={Globe}>
              {analytics.channels.length === 0 ? (
                <EmptySnapshotNote>No channel split in this snapshot.</EmptySnapshotNote>
              ) : (
                <BarList data={analytics.channels} valueLabel="sessions" />
              )}
            </Panel>
            <Panel title="Devices" description="Sessions by device category." icon={MonitorSmartphone}>
              {analytics.devices.length === 0 ? (
                <EmptySnapshotNote>No device split in this snapshot.</EmptySnapshotNote>
              ) : (
                <BarList data={analytics.devices} valueLabel="sessions" />
              )}
            </Panel>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Panel title="Top pages" description="Most-viewed pages this period." className="lg:col-span-2">
              {analytics.topPages.length === 0 ? (
                <EmptySnapshotNote>No page rows in this snapshot.</EmptySnapshotNote>
              ) : (
                <TopPagesTable pages={analytics.topPages} />
              )}
            </Panel>
            <Panel title="Top countries" description="Users by country." icon={MapPin}>
              {analytics.topCountries.length === 0 ? (
                <EmptySnapshotNote>No country split in this snapshot.</EmptySnapshotNote>
              ) : (
                <BarList data={analytics.topCountries} valueLabel="users" />
              )}
            </Panel>
          </div>
        </TabsContent>

        <TabsContent value="search" className="flex flex-col gap-10">
          <KpiGrid kpis={search.kpis} />

          <Panel
            title="Clicks & impressions"
            description="Daily Search performance. Impressions use the right axis."
            icon={Search}
          >
            {empty || search.trend.length === 0 ? (
              <EmptySnapshotNote>
                No reviewed Search Console series for this project.
              </EmptySnapshotNote>
            ) : (
              <SearchTrendChart data={search.trend} />
            )}
          </Panel>

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title="Top queries" description="Searches driving the most clicks.">
              {search.topQueries.length === 0 ? (
                <EmptySnapshotNote>No query rows in this snapshot.</EmptySnapshotNote>
              ) : (
                <QueriesTable queries={search.topQueries} />
              )}
            </Panel>
            <Panel title="Top pages" description="Landing pages from organic search.">
              {search.topPages.length === 0 ? (
                <EmptySnapshotNote>No landing-page rows in this snapshot.</EmptySnapshotNote>
              ) : (
                <SearchPagesTable pages={search.topPages} />
              )}
            </Panel>
          </div>
        </TabsContent>

        {leads && (
          <TabsContent value="leads" className="flex flex-col gap-10">
            <KpiGrid kpis={leads.kpis} />

            <Panel
              title="Inquiry volume"
              description="Daily submissions across the Formspree Contact and Booking forms, Apr 20 – Jun 13, 2026 (spam excluded)."
              icon={MessageSquare}
            >
              <LeadsTrendChart data={leads.trend} />
            </Panel>

            <Panel
              title="Live inquiry board"
              description="The full guest roster lives on the Cove booking leads board. This page keeps volume and conversion only."
            >
              <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                  {leads.kpis[1]?.value ?? "—"} unique leads ·{" "}
                  {leads.kpis[2]?.value ?? "—"} booking parties of those unique
                  leads requested travel dates
                  {snapshot.leadsUpdatedAt
                    ? ` · last refresh ${formatDateLong(snapshot.leadsUpdatedAt)}`
                    : ""}
                  .
                </p>
                {site.inquiryBoardUrl && (
                  <a
                    href={site.inquiryBoardUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
                  >
                    Open canarycove-dash
                    <ExternalLink className="size-3.5" />
                  </a>
                )}
              </div>
            </Panel>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
