import { SITES, type SiteId } from "@/lib/sites";
import type {
  DataHealthRow,
  PortfolioSiteSummary,
  SiteSnapshot,
  TrendPoint,
} from "./types";
import { RANGE_END, countsSeries, rangeStart } from "./series";

/*
 * -------------------------------------------------------------------------
 *  DASHBOARD SNAPSHOT DATA
 *
 *  This is the single source of truth for every number shown in the
 *  dashboard. Analytics and Search Console data below was exported with
 *  gogcli from GA4 and Google Search Console for 2026-04-28 through
 *  2026-05-25, compared with 2026-03-31 through 2026-04-27.
 *
 *  Canary Cove lead data remains a hand-curated Formspree export (summary
 *  only on this board; the live roster is canarycove-dash). Main House has
 *  no reviewed snapshot — its block is an honest empty placeholder.
 *
 *  To refresh the dashboard: rerun the gogcli reports, update the site
 *  blocks below, bump UPDATED_AT, and redeploy. Do not invent live numbers.
 * -------------------------------------------------------------------------
 */

const PERIOD_LABEL = "Last 28 days";
const COMPARISON_LABEL = "vs. previous 28 days";
const START = rangeStart();
const UPDATED_AT = "2026-05-27T03:13:09.000Z";

type TrafficTuple = [date: string, users: number, sessions: number];
type SearchTuple = [date: string, clicks: number, impressions: number];

function trafficPoints(rows: TrafficTuple[]): TrendPoint[] {
  return rows.map(([date, users, sessions]) => ({ date, users, sessions }));
}

function searchPoints(rows: SearchTuple[]): TrendPoint[] {
  return rows.map(([date, clicks, impressions]) => ({ date, clicks, impressions }));
}

// -- Canary Cove: hospitality, collects Formspree leads --
// Reviewed GA4 export: properties/529589780 (Canary Projects), GSC sc-domain:canarycove.com.
// Also labeled, not merged: 311646376 (Canary Cove Main Site). Hostname: canarycove.com.
// Exported with gogcli 2026-05-27T03:13:09.000Z. Do not steal these numbers for Main House.
const canaryCove: SiteSnapshot = {
  siteId: "canary-cove",
  review: "reviewed",
  note: "Reviewed export from GA4 529589780 (Canary Projects). 311646376 (Canary Cove Main Site) is labeled separately and not merged. Hostname: canarycove.com.",
  periodLabel: PERIOD_LABEL,
  comparisonLabel: COMPARISON_LABEL,
  rangeStart: START,
  rangeEnd: RANGE_END,
  updatedAt: UPDATED_AT,
  leadsUpdatedAt: "2026-06-19T00:00:00.000Z",
  analytics: {
    kpis: [
          {
                label: "Active users",
                value: "168",
                deltaPct: 26.3
          },
          {
                label: "Sessions",
                value: "197",
                deltaPct: 33.1
          },
          {
                label: "New users",
                value: "164",
                deltaPct: 25.2
          },
          {
                label: "Engagement rate",
                value: "37.6%",
                deltaPct: 1.1
          },
          {
                label: "Avg. engagement",
                value: "34s",
                deltaPct: -38.1
          },
          {
                label: "Page views",
                value: "386",
                deltaPct: 139.8
          }
    ],
    trafficTrend: trafficPoints([
          [
                "2026-04-28",
                9,
                11
          ],
          [
                "2026-04-29",
                4,
                7
          ],
          [
                "2026-04-30",
                1,
                1
          ],
          [
                "2026-05-01",
                7,
                7
          ],
          [
                "2026-05-02",
                3,
                3
          ],
          [
                "2026-05-03",
                0,
                0
          ],
          [
                "2026-05-04",
                2,
                2
          ],
          [
                "2026-05-05",
                0,
                0
          ],
          [
                "2026-05-06",
                3,
                4
          ],
          [
                "2026-05-07",
                5,
                5
          ],
          [
                "2026-05-08",
                2,
                2
          ],
          [
                "2026-05-09",
                1,
                1
          ],
          [
                "2026-05-10",
                3,
                3
          ],
          [
                "2026-05-11",
                86,
                89
          ],
          [
                "2026-05-12",
                2,
                2
          ],
          [
                "2026-05-13",
                4,
                4
          ],
          [
                "2026-05-14",
                3,
                4
          ],
          [
                "2026-05-15",
                1,
                1
          ],
          [
                "2026-05-16",
                2,
                2
          ],
          [
                "2026-05-17",
                2,
                2
          ],
          [
                "2026-05-18",
                5,
                6
          ],
          [
                "2026-05-19",
                9,
                10
          ],
          [
                "2026-05-20",
                3,
                4
          ],
          [
                "2026-05-21",
                2,
                6
          ],
          [
                "2026-05-22",
                5,
                6
          ],
          [
                "2026-05-23",
                3,
                5
          ],
          [
                "2026-05-24",
                1,
                2
          ],
          [
                "2026-05-25",
                6,
                8
          ]
    ]),
    channels: [
          {
                label: "Direct",
                value: 124,
                pct: 63
          },
          {
                label: "Organic Search",
                value: 57,
                pct: 29
          },
          {
                label: "Unassigned",
                value: 9,
                pct: 5
          },
          {
                label: "Referral",
                value: 7,
                pct: 4
          }
    ],
    devices: [
          {
                label: "desktop",
                value: 153,
                pct: 78
          },
          {
                label: "mobile",
                value: 44,
                pct: 22
          }
    ],
    topPages: [
          {
                path: "/",
                title: "Private Belize Estate on Ambergris Caye | Canary Cove",
                views: 112,
                avgEngagementSec: 17
          },
          {
                path: "/stay",
                title: "Private Beachfront Villa in Belize | Canary Cove",
                views: 66,
                avgEngagementSec: 13
          },
          {
                path: "/book",
                title: "Check Availability & Book Canary Cove | Belize Estate",
                views: 62,
                avgEngagementSec: 16
          },
          {
                path: "/experiences",
                title: "Belize Experiences & Included Amenities | Canary Cove",
                views: 25,
                avgEngagementSec: 6
          },
          {
                path: "/contact",
                title: "Contact Canary Cove | Booking Questions & Trip Planning",
                views: 22,
                avgEngagementSec: 22
          },
          {
                path: "/dining",
                title: "Private Chef Dining in Belize | Canary Cove",
                views: 21,
                avgEngagementSec: 8
          }
    ],
    topCountries: [
          {
                label: "United States",
                value: 146,
                pct: 87
          },
          {
                label: "China",
                value: 5,
                pct: 3
          },
          {
                label: "France",
                value: 5,
                pct: 3
          },
          {
                label: "Germany",
                value: 5,
                pct: 3
          },
          {
                label: "Belize",
                value: 4,
                pct: 2
          }
    ],
  },
  search: {
    kpis: [
          {
                label: "Clicks",
                value: "25",
                deltaPct: -51.9
          },
          {
                label: "Impressions",
                value: "1,205",
                deltaPct: -73.3
          },
          {
                label: "Average CTR",
                value: "2.1%",
                deltaPct: 80.2
          },
          {
                label: "Average position",
                value: "20.6",
                deltaPct: -38.9,
                invertDelta: true
          }
    ],
    trend: searchPoints([
          [
                "2026-04-28",
                0,
                34
          ],
          [
                "2026-04-29",
                1,
                32
          ],
          [
                "2026-04-30",
                1,
                28
          ],
          [
                "2026-05-01",
                0,
                48
          ],
          [
                "2026-05-02",
                3,
                38
          ],
          [
                "2026-05-03",
                0,
                46
          ],
          [
                "2026-05-04",
                1,
                42
          ],
          [
                "2026-05-05",
                0,
                40
          ],
          [
                "2026-05-06",
                1,
                40
          ],
          [
                "2026-05-07",
                2,
                48
          ],
          [
                "2026-05-08",
                0,
                47
          ],
          [
                "2026-05-09",
                0,
                57
          ],
          [
                "2026-05-10",
                0,
                47
          ],
          [
                "2026-05-11",
                1,
                57
          ],
          [
                "2026-05-12",
                0,
                42
          ],
          [
                "2026-05-13",
                0,
                45
          ],
          [
                "2026-05-14",
                2,
                43
          ],
          [
                "2026-05-15",
                0,
                46
          ],
          [
                "2026-05-16",
                0,
                51
          ],
          [
                "2026-05-17",
                3,
                59
          ],
          [
                "2026-05-18",
                2,
                80
          ],
          [
                "2026-05-19",
                4,
                41
          ],
          [
                "2026-05-20",
                1,
                43
          ],
          [
                "2026-05-21",
                3,
                41
          ],
          [
                "2026-05-22",
                0,
                34
          ],
          [
                "2026-05-23",
                0,
                32
          ],
          [
                "2026-05-24",
                0,
                44
          ],
          [
                "2026-05-25",
                0,
                0
          ]
    ]),
    topQueries: [
          {
                query: "canary cove belize",
                clicks: 6,
                impressions: 17,
                ctr: 35.3,
                position: 9.2
          },
          {
                query: "canary cove",
                clicks: 2,
                impressions: 19,
                ctr: 10.5,
                position: 2.5
          },
          {
                query: "belize house rentals with chef",
                clicks: 1,
                impressions: 7,
                ctr: 14.3,
                position: 9.7
          },
          {
                query: "belize villas ambergris caye",
                clicks: 0,
                impressions: 40,
                ctr: 0,
                position: 15.7
          },
          {
                query: "ambergris caye vacation rentals",
                clicks: 0,
                impressions: 27,
                ctr: 0,
                position: 39.9
          },
          {
                query: "https://ideclare.gov.bz/belize_digital_forms/",
                clicks: 0,
                impressions: 27,
                ctr: 0,
                position: 8.9
          }
    ],
    topPages: [
          {
                page: "/",
                clicks: 17,
                impressions: 849,
                ctr: 2,
                position: 24.6
          },
          {
                page: "/stay",
                clicks: 4,
                impressions: 137,
                ctr: 2.9,
                position: 11.4
          },
          {
                page: "/dining",
                clicks: 1,
                impressions: 111,
                ctr: 0.9,
                position: 8.9
          },
          {
                page: "/getting-here",
                clicks: 1,
                impressions: 95,
                ctr: 1.1,
                position: 8.2
          }
    ],
  },
  leads: {
    // Real Formspree data — Canary Cove Contact (xvzarybk) + Booking (xqeqllek)
    // forms, exported 2026-06-19. Bot/spam submissions (gibberish names, random
    // generated text/counts) and a test entry have been excluded. Repeat senders
    // are collapsed to one row per person; submission counts noted inline.
    kpis: [
      { label: "Total inquiries", value: "16", caption: "real submissions · both forms" },
      { label: "Unique leads", value: "10", caption: "distinct people" },
      { label: "Booking parties", value: "7", caption: "requested specific travel dates" },
      { label: "Spam filtered", value: "11", caption: "bot submissions blocked" },
    ],
    trend: countsSeries("leads", "2026-04-20", "2026-06-13", {
      "2026-04-20": 1, // Lori Devine (contact)
      "2026-04-21": 1, // Val Kaye (contact)
      "2026-04-24": 3, // Rich Schones + Val Kaye + erin jones
      "2026-04-27": 1, // Jon Kurtyka (booking)
      "2026-04-29": 2, // Blade Cruickshank + Val Kaye
      "2026-05-02": 1, // Bryant Craig (booking)
      "2026-05-16": 1, // Bryant Craig (booking)
      "2026-05-20": 1, // Bryant Craig (contact)
      "2026-05-25": 1, // Cyndra Crossman (booking)
      "2026-05-26": 1, // Bryant Craig (booking)
      "2026-06-01": 1, // Bryant Craig (contact follow-up)
      "2026-06-03": 1, // Natalie Peterson (contact)
      "2026-06-13": 1, // Lyles Eddins (booking)
    }),
    recent: [
      {
        id: "virginialyles",
        name: "Lyles Eddins",
        email: "virginialyles@gmail.com",
        channel: "booking",
        stayDates: "Mar 19–25, 2027",
        party: "4 adults + 4 children",
        message: "Family trip.",
        submittedAt: "2026-06-13T18:08:32.000Z",
        status: "new",
      },
      {
        id: "natalie-peterson",
        name: "Natalie Peterson",
        email: "nataliempeterson@gmail.com",
        channel: "contact",
        stayDates: "Feb 11–15, 2027",
        party: "6 women",
        message:
          "50th birthday trip; asking for rates, included items, groceries, and excursion cost estimates.",
        submittedAt: "2026-06-03T10:51:52.000Z",
        status: "new",
      },
      {
        id: "craigdvm",
        name: "Bryant Craig",
        email: "craigdvm@gmail.com",
        channel: "booking",
        stayDates: "Sept 12–19, 2026",
        party: "6 adults",
        submissions: 5,
        message:
          "Repeated booking request and contact follow-up; checking status after submitting requests and calling.",
        submittedAt: "2026-06-01T12:25:53.000Z",
        status: "qualified",
      },
      {
        id: "cyndra-rae",
        name: "Cyndra Crossman",
        email: "cyndra.rae@yahoo.com",
        channel: "booking",
        stayDates: "Jan 28 – Feb 2, 2027",
        party: "12 adults + 1 child",
        message: "40th birthday celebration, party of ~10–12.",
        submittedAt: "2026-05-25T23:56:59.000Z",
        status: "new",
      },
      {
        id: "blade-cruickshank",
        name: "Blade Cruickshank",
        email: "blade.cruickshank@gmail.com",
        channel: "booking",
        stayDates: "Oct 31 – Nov 7, 2026",
        party: "6 adults",
        message:
          "Returning guest, 3 couples; snorkeling, a fishing day, and time in town.",
        submittedAt: "2026-04-29T19:23:57.000Z",
        status: "qualified",
      },
      {
        id: "sisterhood-travels",
        name: "Val Kaye",
        org: "Sisterhood Travels",
        email: "val@sisterhoodtravels.com",
        channel: "contact",
        party: "Women's group",
        message:
          "Possible full buyout for a women's group trip (Jan 2028). 3rd follow-up — has called both numbers with no response yet. Needs a coordinator.",
        submittedAt: "2026-04-29T16:29:36.000Z",
        status: "new",
      },
      {
        id: "jonkurtyka",
        name: "Jon Kurtyka",
        email: "jonkurtyka@yahoo.com",
        channel: "booking",
        stayDates: "May 21–24, 2026",
        party: "2 adults",
        message: "Birthday celebration.",
        submittedAt: "2026-04-27T15:46:02.000Z",
        status: "contacted",
      },
      {
        id: "schonesfamily",
        name: "Rich Schones",
        email: "schonesfamily@gmail.com",
        channel: "booking",
        stayDates: "Sept 18–24, 2026",
        party: "6 adults",
        message:
          "Parents, two daughters and their husbands for his wife's birthday. Looking for pricing.",
        submittedAt: "2026-04-24T18:49:44.000Z",
        status: "contacted",
      },
      {
        id: "erinj58",
        name: "erin jones",
        email: "erinj58@yahoo.com",
        channel: "booking",
        stayDates: "Apr 15–19, 2027",
        party: "14 adults",
        message: "Family vacation.",
        submittedAt: "2026-04-24T06:14:57.000Z",
        status: "contacted",
      },
      {
        id: "marallinace",
        name: "Lori Devine",
        org: "MarAlliance",
        email: "lori@marallinace.org",
        channel: "contact",
        stayDates: "Feb 20–27, 2027",
        message:
          "Canary Cove is MarAlliance's preferred accommodation for February trips. Checking availability and rates.",
        submittedAt: "2026-04-20T21:15:35.000Z",
        status: "qualified",
      },
    ],
  },
};

// -- Belize Kids Foundation: nonprofit, donations and program storytelling --
// Reviewed GA4 export: properties/489942783 (Canary Projects), GSC sc-domain:belizekids.org.
// Also labeled, not merged: 311657885. Exported with gogcli 2026-05-27T03:13:09.000Z.
const belizeKids: SiteSnapshot = {
  siteId: "belize-kids",
  review: "reviewed",
  note: "Reviewed export from GA4 489942783 (Canary Projects). 311657885 is labeled separately and not merged into one total.",
  periodLabel: PERIOD_LABEL,
  comparisonLabel: COMPARISON_LABEL,
  rangeStart: START,
  rangeEnd: RANGE_END,
  updatedAt: UPDATED_AT,
  analytics: {
    kpis: [
          {
                label: "Active users",
                value: "38",
                deltaPct: -58.2
          },
          {
                label: "Sessions",
                value: "47",
                deltaPct: -50
          },
          {
                label: "New users",
                value: "38",
                deltaPct: -58.2
          },
          {
                label: "Engagement rate",
                value: "51.1%",
                deltaPct: 182.4
          },
          {
                label: "Avg. engagement",
                value: "28s",
                deltaPct: 300.2
          },
          {
                label: "Page views",
                value: "65",
                deltaPct: -37.5
          }
    ],
    trafficTrend: trafficPoints([
          [
                "2026-04-28",
                2,
                3
          ],
          [
                "2026-04-29",
                0,
                0
          ],
          [
                "2026-04-30",
                1,
                1
          ],
          [
                "2026-05-01",
                2,
                2
          ],
          [
                "2026-05-02",
                2,
                2
          ],
          [
                "2026-05-03",
                2,
                2
          ],
          [
                "2026-05-04",
                3,
                3
          ],
          [
                "2026-05-05",
                4,
                5
          ],
          [
                "2026-05-06",
                1,
                2
          ],
          [
                "2026-05-07",
                2,
                3
          ],
          [
                "2026-05-08",
                1,
                1
          ],
          [
                "2026-05-09",
                0,
                0
          ],
          [
                "2026-05-10",
                1,
                2
          ],
          [
                "2026-05-11",
                2,
                3
          ],
          [
                "2026-05-12",
                4,
                4
          ],
          [
                "2026-05-13",
                0,
                0
          ],
          [
                "2026-05-14",
                0,
                0
          ],
          [
                "2026-05-15",
                1,
                1
          ],
          [
                "2026-05-16",
                0,
                0
          ],
          [
                "2026-05-17",
                0,
                0
          ],
          [
                "2026-05-18",
                1,
                1
          ],
          [
                "2026-05-19",
                1,
                1
          ],
          [
                "2026-05-20",
                0,
                0
          ],
          [
                "2026-05-21",
                1,
                1
          ],
          [
                "2026-05-22",
                4,
                4
          ],
          [
                "2026-05-23",
                0,
                0
          ],
          [
                "2026-05-24",
                1,
                2
          ],
          [
                "2026-05-25",
                2,
                4
          ]
    ]),
    channels: [
          {
                label: "Organic Search",
                value: 29,
                pct: 62
          },
          {
                label: "Direct",
                value: 13,
                pct: 28
          },
          {
                label: "Referral",
                value: 5,
                pct: 11
          }
    ],
    devices: [
          {
                label: "desktop",
                value: 29,
                pct: 62
          },
          {
                label: "mobile",
                value: 17,
                pct: 36
          },
          {
                label: "tablet",
                value: 1,
                pct: 2
          }
    ],
    topPages: [
          {
                path: "/",
                title: "Belize Kids - Transparent Charity Supporting Children's Education & Healthcare in Belize",
                views: 25,
                avgEngagementSec: 13
          },
          {
                path: "/doctors",
                title: "Free Eye Care Appointments - Stanford Belize Vision Clinic | San Pedro, Belize",
                views: 13,
                avgEngagementSec: 16
          },
          {
                path: "/leadership",
                title: "Leadership Team - Experienced Founders & Board Members | Belize Kids",
                views: 11,
                avgEngagementSec: 28
          },
          {
                path: "/projects/october-vision-clinic",
                title: "Stanford Belize Vision Clinic: Transforming Eye Care in San Pedro | healthcare | Belize Kids",
                views: 6,
                avgEngagementSec: 13
          },
          {
                path: "/admin",
                title: "Page Not Found (404) - Return to Belize Kids Homepage",
                views: 3,
                avgEngagementSec: 1
          },
          {
                path: "/leadership/",
                title: "Leadership Team - Experienced Founders & Board Members | Belize Kids",
                views: 3,
                avgEngagementSec: 14
          }
    ],
    topCountries: [
          {
                label: "United States",
                value: 21,
                pct: 55
          },
          {
                label: "Belize",
                value: 8,
                pct: 21
          },
          {
                label: "China",
                value: 2,
                pct: 5
          },
          {
                label: "Germany",
                value: 2,
                pct: 5
          },
          {
                label: "Guatemala",
                value: 1,
                pct: 3
          }
    ],
  },
  search: {
    kpis: [
          {
                label: "Clicks",
                value: "20",
                deltaPct: 42.9
          },
          {
                label: "Impressions",
                value: "757",
                deltaPct: 6
          },
          {
                label: "Average CTR",
                value: "2.6%",
                deltaPct: 34.7
          },
          {
                label: "Average position",
                value: "9.2",
                deltaPct: 7.3,
                invertDelta: true
          }
    ],
    trend: searchPoints([
          [
                "2026-04-28",
                2,
                23
          ],
          [
                "2026-04-29",
                0,
                30
          ],
          [
                "2026-04-30",
                0,
                29
          ],
          [
                "2026-05-01",
                1,
                33
          ],
          [
                "2026-05-02",
                0,
                25
          ],
          [
                "2026-05-03",
                1,
                26
          ],
          [
                "2026-05-04",
                3,
                44
          ],
          [
                "2026-05-05",
                0,
                24
          ],
          [
                "2026-05-06",
                0,
                37
          ],
          [
                "2026-05-07",
                2,
                34
          ],
          [
                "2026-05-08",
                0,
                25
          ],
          [
                "2026-05-09",
                0,
                38
          ],
          [
                "2026-05-10",
                0,
                20
          ],
          [
                "2026-05-11",
                3,
                37
          ],
          [
                "2026-05-12",
                3,
                28
          ],
          [
                "2026-05-13",
                0,
                39
          ],
          [
                "2026-05-14",
                0,
                26
          ],
          [
                "2026-05-15",
                1,
                33
          ],
          [
                "2026-05-16",
                0,
                19
          ],
          [
                "2026-05-17",
                0,
                20
          ],
          [
                "2026-05-18",
                0,
                21
          ],
          [
                "2026-05-19",
                0,
                23
          ],
          [
                "2026-05-20",
                0,
                24
          ],
          [
                "2026-05-21",
                1,
                27
          ],
          [
                "2026-05-22",
                2,
                31
          ],
          [
                "2026-05-23",
                0,
                19
          ],
          [
                "2026-05-24",
                1,
                22
          ],
          [
                "2026-05-25",
                0,
                0
          ]
    ]),
    topQueries: [
          {
                query: "eye doctor near me",
                clicks: 1,
                impressions: 32,
                ctr: 3.1,
                position: 8.8
          },
          {
                query: "eye doctor",
                clicks: 0,
                impressions: 43,
                ctr: 0,
                position: 12.8
          },
          {
                query: "belize child health",
                clicks: 0,
                impressions: 36,
                ctr: 0,
                position: 17.1
          },
          {
                query: "belize children's project",
                clicks: 0,
                impressions: 20,
                ctr: 0,
                position: 19.8
          },
          {
                query: "eye doctors in belize",
                clicks: 0,
                impressions: 19,
                ctr: 0,
                position: 11.2
          },
          {
                query: "eye doctor near me open now",
                clicks: 0,
                impressions: 13,
                ctr: 0,
                position: 7.6
          }
    ],
    topPages: [
          {
                page: "/leadership",
                clicks: 7,
                impressions: 136,
                ctr: 5.1,
                position: 6.6
          },
          {
                page: "/doctors",
                clicks: 5,
                impressions: 266,
                ctr: 1.9,
                position: 9.4
          },
          {
                page: "/",
                clicks: 4,
                impressions: 195,
                ctr: 2.1,
                position: 9.8
          },
          {
                page: "/projects/october-vision-clinic",
                clicks: 4,
                impressions: 71,
                ctr: 5.6,
                position: 8.8
          }
    ],
  },
};

// -- Listwin Ventures: venture practice and Don Listwin profile traffic --
// Reviewed GA4 export: properties/514358412, GSC sc-domain:listwinventures.com.
// Exported with gogcli 2026-05-27T03:13:09.000Z.
const listwinVentures: SiteSnapshot = {
  siteId: "listwin-ventures",
  review: "reviewed",
  note: "Reviewed export from GA4 514358412.",
  periodLabel: PERIOD_LABEL,
  comparisonLabel: COMPARISON_LABEL,
  rangeStart: START,
  rangeEnd: RANGE_END,
  updatedAt: UPDATED_AT,
  analytics: {
    kpis: [
          {
                label: "Active users",
                value: "154",
                deltaPct: -37.7
          },
          {
                label: "Sessions",
                value: "195",
                deltaPct: -25.3
          },
          {
                label: "New users",
                value: "153",
                deltaPct: -37
          },
          {
                label: "Engagement rate",
                value: "29.2%",
                deltaPct: 62.3
          },
          {
                label: "Avg. engagement",
                value: "58s",
                deltaPct: 193.8
          },
          {
                label: "Page views",
                value: "247",
                deltaPct: -23.1
          }
    ],
    trafficTrend: trafficPoints([
          [
                "2026-04-28",
                4,
                4
          ],
          [
                "2026-04-29",
                5,
                6
          ],
          [
                "2026-04-30",
                6,
                6
          ],
          [
                "2026-05-01",
                5,
                5
          ],
          [
                "2026-05-02",
                12,
                13
          ],
          [
                "2026-05-03",
                5,
                5
          ],
          [
                "2026-05-04",
                6,
                7
          ],
          [
                "2026-05-05",
                3,
                3
          ],
          [
                "2026-05-06",
                21,
                23
          ],
          [
                "2026-05-07",
                3,
                3
          ],
          [
                "2026-05-08",
                7,
                8
          ],
          [
                "2026-05-09",
                0,
                1
          ],
          [
                "2026-05-10",
                4,
                4
          ],
          [
                "2026-05-11",
                0,
                0
          ],
          [
                "2026-05-12",
                12,
                15
          ],
          [
                "2026-05-13",
                4,
                5
          ],
          [
                "2026-05-14",
                10,
                13
          ],
          [
                "2026-05-15",
                3,
                8
          ],
          [
                "2026-05-16",
                4,
                5
          ],
          [
                "2026-05-17",
                2,
                2
          ],
          [
                "2026-05-18",
                2,
                2
          ],
          [
                "2026-05-19",
                9,
                10
          ],
          [
                "2026-05-20",
                5,
                7
          ],
          [
                "2026-05-21",
                7,
                10
          ],
          [
                "2026-05-22",
                13,
                17
          ],
          [
                "2026-05-23",
                5,
                5
          ],
          [
                "2026-05-24",
                1,
                4
          ],
          [
                "2026-05-25",
                2,
                4
          ]
    ]),
    channels: [
          {
                label: "Direct",
                value: 126,
                pct: 65
          },
          {
                label: "Organic Search",
                value: 64,
                pct: 33
          },
          {
                label: "Referral",
                value: 5,
                pct: 3
          }
    ],
    devices: [
          {
                label: "desktop",
                value: 138,
                pct: 71
          },
          {
                label: "mobile",
                value: 56,
                pct: 29
          },
          {
                label: "tablet",
                value: 1,
                pct: 1
          }
    ],
    topPages: [
          {
                path: "/",
                title: "Don Listwin | Listwin Ventures",
                views: 148,
                avgEngagementSec: 24
          },
          {
                path: "/company/carbon-robotics",
                title: "Carbon Robotics | Listwin Ventures",
                views: 15,
                avgEngagementSec: 220
          },
          {
                path: "/contact",
                title: "Contact Listwin Ventures",
                views: 12,
                avgEngagementSec: 85
          },
          {
                path: "/press",
                title: "Press & References | Don Listwin | Listwin Ventures",
                views: 8,
                avgEngagementSec: 17
          },
          {
                path: "/4ag",
                title: "4AG Robotics | Don Listwin Investment | Listwin Ventures",
                views: 7,
                avgEngagementSec: 12
          },
          {
                path: "/oral-history-caltech",
                title: "Caltech Heritage Project Oral History (2025) — Don Listwin",
                views: 7,
                avgEngagementSec: 17
          }
    ],
    topCountries: [
          {
                label: "United States",
                value: 103,
                pct: 67
          },
          {
                label: "Canada",
                value: 10,
                pct: 6
          },
          {
                label: "Singapore",
                value: 9,
                pct: 6
          },
          {
                label: "China",
                value: 8,
                pct: 5
          },
          {
                label: "India",
                value: 5,
                pct: 3
          }
    ],
  },
  search: {
    kpis: [
          {
                label: "Clicks",
                value: "42",
                deltaPct: 7.7
          },
          {
                label: "Impressions",
                value: "4,429",
                deltaPct: 56.4
          },
          {
                label: "Average CTR",
                value: "0.9%",
                deltaPct: -31.2
          },
          {
                label: "Average position",
                value: "9.4",
                deltaPct: -7.5,
                invertDelta: true
          }
    ],
    trend: searchPoints([
          [
                "2026-04-28",
                1,
                161
          ],
          [
                "2026-04-29",
                2,
                97
          ],
          [
                "2026-04-30",
                1,
                138
          ],
          [
                "2026-05-01",
                1,
                122
          ],
          [
                "2026-05-02",
                0,
                129
          ],
          [
                "2026-05-03",
                0,
                78
          ],
          [
                "2026-05-04",
                3,
                118
          ],
          [
                "2026-05-05",
                1,
                141
          ],
          [
                "2026-05-06",
                0,
                132
          ],
          [
                "2026-05-07",
                2,
                135
          ],
          [
                "2026-05-08",
                1,
                154
          ],
          [
                "2026-05-09",
                0,
                97
          ],
          [
                "2026-05-10",
                2,
                89
          ],
          [
                "2026-05-11",
                0,
                191
          ],
          [
                "2026-05-12",
                5,
                129
          ],
          [
                "2026-05-13",
                0,
                181
          ],
          [
                "2026-05-14",
                3,
                188
          ],
          [
                "2026-05-15",
                1,
                402
          ],
          [
                "2026-05-16",
                2,
                234
          ],
          [
                "2026-05-17",
                0,
                188
          ],
          [
                "2026-05-18",
                0,
                199
          ],
          [
                "2026-05-19",
                4,
                204
          ],
          [
                "2026-05-20",
                5,
                207
          ],
          [
                "2026-05-21",
                4,
                199
          ],
          [
                "2026-05-22",
                2,
                216
          ],
          [
                "2026-05-23",
                2,
                145
          ],
          [
                "2026-05-24",
                0,
                155
          ],
          [
                "2026-05-25",
                0,
                0
          ]
    ]),
    topQueries: [
          {
                query: "don listwin",
                clicks: 15,
                impressions: 69,
                ctr: 21.7,
                position: 1.7
          },
          {
                query: "listwin ventures",
                clicks: 4,
                impressions: 8,
                ctr: 50,
                position: 1
          },
          {
                query: "san jose grand prix",
                clicks: 0,
                impressions: 406,
                ctr: 0,
                position: 9
          },
          {
                query: "4ag robotics",
                clicks: 0,
                impressions: 115,
                ctr: 0,
                position: 8.7
          },
          {
                query: "rally ventures",
                clicks: 0,
                impressions: 103,
                ctr: 0,
                position: 8
          },
          {
                query: "plumgrid",
                clicks: 0,
                impressions: 69,
                ctr: 0,
                position: 11.1
          }
    ],
    topPages: [
          {
                page: "/",
                clicks: 33,
                impressions: 465,
                ctr: 7.1,
                position: 3.6
          },
          {
                page: "/4ag",
                clicks: 2,
                impressions: 835,
                ctr: 0.2,
                position: 8.4
          },
          {
                page: "/company/carbon-robotics",
                clicks: 2,
                impressions: 665,
                ctr: 0.3,
                position: 10.1
          },
          {
                page: "/exploits/chelsea-woodside-railroad",
                clicks: 2,
                impressions: 16,
                ctr: 12.5,
                position: 5.3
          }
    ],
  },
};

// -- Canary Foundation: early cancer detection research nonprofit --
// Reviewed GA4 export: properties/311697082, GSC sc-domain:canaryfoundation.org.
// Exported with gogcli 2026-05-27T03:13:09.000Z.
const canaryFoundation: SiteSnapshot = {
  siteId: "canary-foundation",
  review: "reviewed",
  note: "Reviewed export from GA4 311697082.",
  periodLabel: PERIOD_LABEL,
  comparisonLabel: COMPARISON_LABEL,
  rangeStart: START,
  rangeEnd: RANGE_END,
  updatedAt: UPDATED_AT,
  analytics: {
    kpis: [
          {
                label: "Active users",
                value: "500",
                deltaPct: -48.2
          },
          {
                label: "Sessions",
                value: "543",
                deltaPct: -49.3
          },
          {
                label: "New users",
                value: "492",
                deltaPct: -48.6
          },
          {
                label: "Engagement rate",
                value: "26.5%",
                deltaPct: 52.7
          },
          {
                label: "Avg. engagement",
                value: "17s",
                deltaPct: 0.5
          },
          {
                label: "Page views",
                value: "751",
                deltaPct: -16.3
          }
    ],
    trafficTrend: trafficPoints([
          [
                "2026-04-28",
                31,
                38
          ],
          [
                "2026-04-29",
                16,
                17
          ],
          [
                "2026-04-30",
                12,
                13
          ],
          [
                "2026-05-01",
                11,
                13
          ],
          [
                "2026-05-02",
                19,
                20
          ],
          [
                "2026-05-03",
                9,
                9
          ],
          [
                "2026-05-04",
                12,
                13
          ],
          [
                "2026-05-05",
                48,
                49
          ],
          [
                "2026-05-06",
                22,
                24
          ],
          [
                "2026-05-07",
                23,
                25
          ],
          [
                "2026-05-08",
                20,
                23
          ],
          [
                "2026-05-09",
                11,
                11
          ],
          [
                "2026-05-10",
                10,
                10
          ],
          [
                "2026-05-11",
                19,
                20
          ],
          [
                "2026-05-12",
                21,
                22
          ],
          [
                "2026-05-13",
                17,
                18
          ],
          [
                "2026-05-14",
                20,
                23
          ],
          [
                "2026-05-15",
                18,
                20
          ],
          [
                "2026-05-16",
                16,
                16
          ],
          [
                "2026-05-17",
                20,
                21
          ],
          [
                "2026-05-18",
                17,
                18
          ],
          [
                "2026-05-19",
                10,
                10
          ],
          [
                "2026-05-20",
                26,
                28
          ],
          [
                "2026-05-21",
                13,
                15
          ],
          [
                "2026-05-22",
                29,
                31
          ],
          [
                "2026-05-23",
                5,
                5
          ],
          [
                "2026-05-24",
                8,
                9
          ],
          [
                "2026-05-25",
                20,
                21
          ]
    ]),
    channels: [
          {
                label: "Direct",
                value: 345,
                pct: 64
          },
          {
                label: "Organic Search",
                value: 177,
                pct: 33
          },
          {
                label: "Referral",
                value: 9,
                pct: 2
          },
          {
                label: "Unassigned",
                value: 7,
                pct: 1
          },
          {
                label: "Organic Social",
                value: 4,
                pct: 1
          }
    ],
    devices: [
          {
                label: "desktop",
                value: 443,
                pct: 82
          },
          {
                label: "mobile",
                value: 96,
                pct: 18
          },
          {
                label: "tablet",
                value: 4,
                pct: 1
          }
    ],
    topPages: [
          {
                path: "/",
                title: "Canary Foundation - Early Cancer Detection Research",
                views: 344,
                avgEngagementSec: 16
          },
          {
                path: "/science/centers/stanford",
                title: "Canary Foundation - Early Cancer Detection Research",
                views: 35,
                avgEngagementSec: 13
          },
          {
                path: "/about/founders-story",
                title: "Canary Foundation - Early Cancer Detection Research",
                views: 33,
                avgEngagementSec: 11
          },
          {
                path: "/about/board-directors",
                title: "Canary Foundation - Early Cancer Detection Research",
                views: 30,
                avgEngagementSec: 14
          },
          {
                path: "/approach/symposium",
                title: "Canary Foundation - Early Cancer Detection Research",
                views: 22,
                avgEngagementSec: 8
          },
          {
                path: "/about/leadership-council",
                title: "Canary Foundation - Early Cancer Detection Research",
                views: 21,
                avgEngagementSec: 11
          }
    ],
    topCountries: [
          {
                label: "United States",
                value: 262,
                pct: 52
          },
          {
                label: "Singapore",
                value: 97,
                pct: 19
          },
          {
                label: "Vietnam",
                value: 34,
                pct: 7
          },
          {
                label: "China",
                value: 31,
                pct: 6
          },
          {
                label: "Ireland",
                value: 13,
                pct: 3
          }
    ],
  },
  search: {
    kpis: [
          {
                label: "Clicks",
                value: "130",
                deltaPct: -15
          },
          {
                label: "Impressions",
                value: "4,930",
                deltaPct: -22.5
          },
          {
                label: "Average CTR",
                value: "2.6%",
                deltaPct: 9.6
          },
          {
                label: "Average position",
                value: "12.9",
                deltaPct: 28.3,
                invertDelta: true
          }
    ],
    trend: searchPoints([
          [
                "2026-04-28",
                20,
                380
          ],
          [
                "2026-04-29",
                10,
                215
          ],
          [
                "2026-04-30",
                6,
                173
          ],
          [
                "2026-05-01",
                2,
                225
          ],
          [
                "2026-05-02",
                2,
                195
          ],
          [
                "2026-05-03",
                2,
                192
          ],
          [
                "2026-05-04",
                7,
                240
          ],
          [
                "2026-05-05",
                9,
                212
          ],
          [
                "2026-05-06",
                6,
                196
          ],
          [
                "2026-05-07",
                8,
                209
          ],
          [
                "2026-05-08",
                2,
                133
          ],
          [
                "2026-05-09",
                3,
                114
          ],
          [
                "2026-05-10",
                1,
                102
          ],
          [
                "2026-05-11",
                5,
                155
          ],
          [
                "2026-05-12",
                3,
                192
          ],
          [
                "2026-05-13",
                6,
                147
          ],
          [
                "2026-05-14",
                10,
                159
          ],
          [
                "2026-05-15",
                4,
                130
          ],
          [
                "2026-05-16",
                0,
                128
          ],
          [
                "2026-05-17",
                1,
                149
          ],
          [
                "2026-05-18",
                4,
                230
          ],
          [
                "2026-05-19",
                2,
                159
          ],
          [
                "2026-05-20",
                4,
                183
          ],
          [
                "2026-05-21",
                7,
                200
          ],
          [
                "2026-05-22",
                3,
                204
          ],
          [
                "2026-05-23",
                1,
                139
          ],
          [
                "2026-05-24",
                2,
                169
          ],
          [
                "2026-05-25",
                0,
                0
          ]
    ]),
    topQueries: [
          {
                query: "canary foundation",
                clicks: 31,
                impressions: 76,
                ctr: 40.8,
                position: 1.8
          },
          {
                query: "hilary valentine",
                clicks: 8,
                impressions: 186,
                ctr: 4.3,
                position: 4.4
          },
          {
                query: "don listwin",
                clicks: 4,
                impressions: 66,
                ctr: 6.1,
                position: 5.7
          },
          {
                query: "canary center stanford",
                clicks: 2,
                impressions: 45,
                ctr: 4.4,
                position: 3.1
          },
          {
                query: "canary global foundation",
                clicks: 2,
                impressions: 14,
                ctr: 14.3,
                position: 1.6
          },
          {
                query: "canary center",
                clicks: 1,
                impressions: 68,
                ctr: 1.5,
                position: 6.5
          }
    ],
    topPages: [
          {
                page: "/",
                clicks: 51,
                impressions: 1438,
                ctr: 3.5,
                position: 8.3
          },
          {
                page: "/about/board-directors",
                clicks: 20,
                impressions: 492,
                ctr: 4.1,
                position: 5.6
          },
          {
                page: "/approach/symposium",
                clicks: 12,
                impressions: 400,
                ctr: 3,
                position: 5.4
          },
          {
                page: "/about/founders-story",
                clicks: 11,
                impressions: 510,
                ctr: 2.2,
                position: 7.8
          }
    ],
  },
};

// -- Main House: Canary Cove microsite. No reviewed GA4 / GSC snapshot yet. --
// Not in the Prism GA4 map as its own property. Do not reuse Canary Cove numbers.
const mainHouse: SiteSnapshot = {
  siteId: "main-house",
  review: "empty",
  note: "No reviewed snapshot yet. GA4 property unknown — not in the Prism map as its own property. Zeros are placeholders, not traffic.",
  periodLabel: "No reviewed snapshot yet",
  comparisonLabel: "—",
  rangeStart: START,
  rangeEnd: RANGE_END,
  analytics: {
    kpis: [
      { label: "Active users", value: "0", caption: "No reviewed snapshot yet" },
      { label: "Sessions", value: "0", caption: "No reviewed snapshot yet" },
      { label: "New users", value: "0", caption: "No reviewed snapshot yet" },
      { label: "Engagement rate", value: "0%", caption: "No reviewed snapshot yet" },
      { label: "Avg. engagement", value: "0s", caption: "No reviewed snapshot yet" },
      { label: "Page views", value: "0", caption: "No reviewed snapshot yet" },
    ],
    trafficTrend: [],
    channels: [],
    devices: [],
    topPages: [],
    topCountries: [],
  },
  search: {
    kpis: [
      { label: "Clicks", value: "0", caption: "No reviewed snapshot yet" },
      { label: "Impressions", value: "0", caption: "No reviewed snapshot yet" },
      { label: "Average CTR", value: "0%", caption: "No reviewed snapshot yet" },
      { label: "Average position", value: "—", caption: "No reviewed snapshot yet" },
    ],
    trend: [],
    topQueries: [],
    topPages: [],
  },
};

const SNAPSHOTS: Record<SiteId, SiteSnapshot> = {
  "canary-cove": canaryCove,
  "belize-kids": belizeKids,
  "main-house": mainHouse,
  "listwin-ventures": listwinVentures,
  "canary-foundation": canaryFoundation,
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
    const unique = snap.leads?.kpis.find((k) => k.label === "Unique leads");
    const booking = snap.leads?.kpis.find((k) => k.label === "Booking parties");

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
