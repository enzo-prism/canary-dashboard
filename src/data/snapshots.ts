import type { SiteId } from "@/lib/sites";
import { SITES } from "@/lib/sites";
import { formatDateLong } from "@/lib/format";
import type { DataHealthRow, PortfolioSiteSummary, SiteSnapshot } from "./types";
import reviewedGoogleSnapshots from "./reviewed-google-snapshots.json";
import reviewedLeads from "./reviewed-leads-summary.json";

/** Reviewed source-backed snapshots; no private inquiry roster is embedded. */
const googleSnapshots = reviewedGoogleSnapshots as Record<SiteId, SiteSnapshot>;
const SNAPSHOTS: Record<SiteId, SiteSnapshot> = {
  ...googleSnapshots,
  "canary-cove": {
    ...googleSnapshots["canary-cove"],
    leadsUpdatedAt: reviewedLeads.exportedAt,
    leads: {
      description: `Reviewed genuine inquiries, ${formatDateLong(reviewedLeads.periodStart)} through ${formatDateLong(reviewedLeads.periodEnd)}. Dates use Pacific time. All-time headline counts cover the intake history since April 20, 2026.`,
      sourceSummary: `${reviewedLeads.rawRows} operational Formspree rows: ${reviewedLeads.formspreeVisibleRows} genuine and ${reviewedLeads.filteredRows} spam/test; ${reviewedLeads.excludedEmailCaptureRows} email captures excluded. Plus ${reviewedLeads.heldRows} preserved Typeform inquiry. ${reviewedLeads.reviewRows} unresolved reviews.`,
      kpis: [
        { label: "Total inquiries", value: String(reviewedLeads.totalInquiries), caption: "All time · genuine inquiries" },
        { label: "Unique senders", value: String(reviewedLeads.uniqueSenders), caption: "All time · email identities" },
        { label: "Booking requests", value: String(reviewedLeads.bookingRequests), caption: "All time · inquiry submissions" },
        { label: "Contact requests", value: String(reviewedLeads.contactRequests), caption: "All time · inquiry submissions" },
        { label: "Period inquiries", value: String(reviewedLeads.periodInquiries), caption: "Sep 30 – Oct 27, 2026" },
      ],
      trend: reviewedLeads.dailyTrend.map(({ date, inquiries }) => ({ date, leads: inquiries })),
      recent: [],
    },
  },
};

export function getSnapshot(siteId: SiteId): SiteSnapshot {
  return SNAPSHOTS[siteId];
}

function kpiValue(snap: SiteSnapshot, group: "analytics" | "search", label: string) {
  return snap[group].kpis.find((k) => k.label === label);
}

/** Portfolio roll-up used on the landing overview. Walks the site registry order. */
export function getPortfolioSummary(): PortfolioSiteSummary[] {
  return SITES.map((site) => {
    const snap = SNAPSHOTS[site.id];
    const empty = snap.review === "empty";
    const users = kpiValue(snap, "analytics", "Active users");
    const sessions = kpiValue(snap, "analytics", "Sessions");
    const clicks = kpiValue(snap, "search", "Clicks");
    const inquiries = snap.leads?.kpis.find((k) => k.label === "Total inquiries");
    const unique = snap.leads?.kpis.find((k) => k.label === "Unique senders");
    const booking = snap.leads?.kpis.find((k) => k.label === "Booking requests");

    return {
      siteId: site.id,
      review: snap.review,
      note: snap.note,
      updatedAt: snap.updatedAt,
      leadsUpdatedAt: snap.leadsUpdatedAt,
      periodLabel: snap.periodLabel,
      users: empty ? null : (users?.value ?? null),
      usersDelta: empty ? undefined : users?.deltaPct,
      sessions: empty ? null : (sessions?.value ?? null),
      sessionsDelta: empty ? undefined : sessions?.deltaPct,
      clicks: empty ? null : (clicks?.value ?? null),
      clicksDelta: empty ? undefined : clicks?.deltaPct,
      leads:
        snap.leads && inquiries
          ? {
              volume: inquiries.value,
              unique: unique?.value,
              booking: booking?.value,
            }
          : null,
    };
  });
}

export function getDataHealth(): DataHealthRow[] {
  return SITES.map((site) => {
    const snap = SNAPSHOTS[site.id];
    return {
      siteId: site.id,
      review: snap.review,
      updatedAt: snap.updatedAt,
      leadsUpdatedAt: snap.leadsUpdatedAt,
      note: snap.note,
    };
  });
}

export { PERIOD_DAYS } from "./series";
