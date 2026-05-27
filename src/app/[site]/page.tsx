import { notFound } from "next/navigation";
import {
  BarChart3,
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
import { LeadsList } from "@/components/dashboard/lead-list";

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

  return (
    <div className="flex flex-col">
      <PageHeader site={site} snapshot={snapshot} />

      <div className="px-4 py-5 sm:px-6">
        <Tabs defaultValue="analytics" className="gap-5">
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

          {/* ── Google Analytics ── */}
          <TabsContent value="analytics" className="flex flex-col gap-4">
            <KpiGrid kpis={analytics.kpis} />

            <Panel
              title="Traffic over time"
              description="Daily sessions and active users from Google Analytics 4."
              icon={TrendingUp}
            >
              <TrafficTrendChart data={analytics.trafficTrend} />
            </Panel>

            <div className="grid gap-4 lg:grid-cols-2">
              <Panel title="Channels" description="Where sessions came from." icon={Globe}>
                <BarList data={analytics.channels} valueLabel="sessions" />
              </Panel>
              <Panel title="Devices" description="Sessions by device category." icon={MonitorSmartphone}>
                <BarList data={analytics.devices} valueLabel="sessions" />
              </Panel>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <Panel title="Top pages" description="Most-viewed pages this period." className="lg:col-span-2">
                <TopPagesTable pages={analytics.topPages} />
              </Panel>
              <Panel title="Top countries" description="Users by country." icon={MapPin}>
                <BarList data={analytics.topCountries} valueLabel="users" />
              </Panel>
            </div>
          </TabsContent>

          {/* ── Google Search Console ── */}
          <TabsContent value="search" className="flex flex-col gap-4">
            <KpiGrid kpis={search.kpis} />

            <Panel
              title="Clicks & impressions"
              description="Daily Search performance. Impressions use the right axis."
              icon={Search}
            >
              <SearchTrendChart data={search.trend} />
            </Panel>

            <div className="grid gap-4 lg:grid-cols-2">
              <Panel title="Top queries" description="Searches driving the most clicks.">
                <QueriesTable queries={search.topQueries} />
              </Panel>
              <Panel title="Top pages" description="Landing pages from organic search.">
                <SearchPagesTable pages={search.topPages} />
              </Panel>
            </div>
          </TabsContent>

          {/* ── Formspree Leads (Canary Cove only) ── */}
          {leads && (
            <TabsContent value="leads" className="flex flex-col gap-4">
              <KpiGrid kpis={leads.kpis} />

              <Panel
                title="Inquiry volume"
                description="Daily submissions across the Formspree Contact and Booking forms, Apr 20 – May 26, 2026 (spam excluded)."
                icon={MessageSquare}
              >
                <LeadsTrendChart data={leads.trend} />
              </Panel>

              <Panel
                title="Recent inquiries"
                description="Genuine leads, newest first. Repeat senders collapsed to one row."
              >
                <LeadsList leads={leads.recent} />
              </Panel>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
