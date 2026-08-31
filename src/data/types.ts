import type { SiteId } from "@/lib/sites";

/** A single headline metric with period-over-period change. */
export type Kpi = {
  label: string;
  /** Pre-formatted display value (e.g. "12,481", "3m 12s", "4.2%"). */
  value: string;
  /** Signed percentage change vs the comparison period. Omit when there is no
   *  reliable prior-period baseline (e.g. real lead data). */
  deltaPct?: number;
  /** When true, a negative delta is good (e.g. avg. search position, bounce). */
  invertDelta?: boolean;
  /** Optional supporting caption under the value. */
  caption?: string;
};

export type TrendPoint = {
  date: string; // ISO date (yyyy-mm-dd)
  [series: string]: string | number;
};

export type BarDatum = {
  label: string;
  value: number;
  /** Share of total, 0–100. */
  pct: number;
};

export type TopPage = {
  path: string;
  title: string;
  views: number;
  avgEngagementSec: number;
};

export type SearchQuery = {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number; // percent
  position: number;
};

export type SearchPage = {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number; // percent
  position: number;
};

export type LeadStatus = "new" | "contacted" | "qualified" | "booked" | "closed";

/** Which Formspree form the inquiry came through. */
export type LeadChannel = "booking" | "contact";

export type Lead = {
  id: string;
  name: string;
  email: string;
  /** Optional org/affiliation shown after the name (e.g. "Sisterhood Travels"). */
  org?: string;
  /** Booking = firm travel dates requested; Contact = general inquiry. */
  channel: LeadChannel;
  /** Requested travel window, pre-formatted (e.g. "Sept 12–19, 2026"). Booking leads. */
  stayDates?: string;
  /** Party size, pre-formatted (e.g. "6 adults", "12 adults + 1 child"). */
  party?: string;
  /** Number of submissions when a sender wrote in more than once. */
  submissions?: number;
  /** The descriptive remainder of the inquiry (no dates/party — those are structured above). */
  message: string;
  submittedAt: string; // ISO datetime
  status: LeadStatus;
};

export type AnalyticsSnapshot = {
  kpis: Kpi[];
  /** Daily users + sessions across the period. */
  trafficTrend: TrendPoint[];
  channels: BarDatum[];
  devices: BarDatum[];
  topPages: TopPage[];
  topCountries: BarDatum[];
};

export type SearchSnapshot = {
  kpis: Kpi[];
  /** Daily clicks + impressions across the period. */
  trend: TrendPoint[];
  topQueries: SearchQuery[];
  topPages: SearchPage[];
};

export type LeadsSnapshot = {
  kpis: Kpi[];
  /** Daily lead counts across the period. */
  trend: TrendPoint[];
  recent: Lead[];
};

export type SnapshotReview = "reviewed" | "empty";

export type SiteSnapshot = {
  siteId: SiteId;
  /** reviewed = curated GA/GSC export; empty = honest placeholder, not live traffic. */
  review: SnapshotReview;
  /** Optional ops note shown on data health (property IDs, gaps). */
  note?: string;
  periodLabel: string;
  comparisonLabel: string;
  rangeStart: string; // ISO date
  rangeEnd: string; // ISO date
  /** When the GA / GSC snapshot was last refreshed by the Prism team. */
  updatedAt?: string; // ISO datetime
  /** When the leads export was reviewed, if different from updatedAt. */
  leadsUpdatedAt?: string;
  analytics: AnalyticsSnapshot;
  search: SearchSnapshot;
  leads?: LeadsSnapshot;
};

export type PortfolioLeadSummary = {
  volume: string;
  unique?: string;
  booking?: string;
};

export type PortfolioSiteSummary = {
  siteId: SiteId;
  review: SnapshotReview;
  note?: string;
  updatedAt?: string;
  leadsUpdatedAt?: string;
  periodLabel: string;
  users: string | null;
  usersDelta?: number;
  sessions: string | null;
  sessionsDelta?: number;
  clicks: string | null;
  clicksDelta?: number;
  leads: PortfolioLeadSummary | null;
};

export type DataHealthRow = {
  siteId: SiteId;
  review: SnapshotReview;
  updatedAt?: string;
  leadsUpdatedAt?: string;
  note?: string;
};
