export type SiteId =
  | "canary-cove"
  | "belize-kids"
  | "main-house"
  | "listwin-ventures"
  | "canary-foundation";

export type SiteCategory = "hospitality" | "nonprofit" | "ventures";

/** GA4 property listed for data-health notes only. Never fetched at runtime. */
export type Ga4Property = {
  id: string;
  label: string;
  /** True when the committed snapshot was exported from this property. */
  snapshotSource?: boolean;
};

export type Site = {
  id: SiteId;
  /** Display name shown in the sidebar and headers. */
  name: string;
  /** Bare domain, used as the secondary sidebar line and analytics property label. */
  domain: string;
  /** Canonical https URL. */
  url: string;
  /** One-line description of what the site is. */
  blurb: string;
  /** Whether this site collects leads (Canary Cove via Formspree). */
  hasLeads: boolean;
  /** Path to the site's brand logo under /public (shown in the nav tile). */
  logo: string;
  category: SiteCategory;
  /** Optional source repo, for ops notes only. */
  repo?: string;
  /**
   * Known GA4 properties for this hostname. Listed separately — never summed
   * into one total. Empty when the property is unknown.
   */
  ga4Properties: Ga4Property[];
  /** External board that holds the live inquiry roster, if any. */
  inquiryBoardUrl?: string;
};

export const COVE_INQUIRY_BOARD = "https://canarycove-dash.vercel.app";

/**
 * Don Listwin's portfolio of sites that Prism manages. The order here is the
 * order they appear on the dashboard and in the left sidebar.
 */
export const SITES: Site[] = [
  {
    id: "canary-cove",
    name: "Canary Cove",
    domain: "canarycove.com",
    url: "https://canarycove.com",
    blurb:
      "Private island retreat — immersive visuals and concierge-ready inquiry flows.",
    hasLeads: true,
    logo: "/logos/canary-cove.png",
    category: "hospitality",
    ga4Properties: [
      {
        id: "311646376",
        label: "Canary Cove Main Site",
      },
      {
        id: "529589780",
        label: "Canary Projects",
        snapshotSource: true,
      },
    ],
    inquiryBoardUrl: COVE_INQUIRY_BOARD,
  },
  {
    id: "belize-kids",
    name: "Belize Kids Foundation",
    domain: "belizekids.org",
    url: "https://belizekids.org",
    blurb:
      "Nonprofit supporting education and opportunity for children in Belize.",
    hasLeads: false,
    logo: "/logos/belize-kids.png",
    category: "nonprofit",
    ga4Properties: [
      { id: "311657885", label: "Belize Kids Foundation" },
      {
        id: "489942783",
        label: "Canary Projects",
        snapshotSource: true,
      },
    ],
  },
  {
    id: "main-house",
    name: "Main House",
    domain: "mainhouse.canarycove.com",
    url: "https://mainhouse.canarycove.com",
    blurb:
      "5-suite Main House at Canary Cove — reserved for returning groups.",
    hasLeads: false,
    logo: "/logos/main-house.svg",
    category: "hospitality",
    repo: "enzo-prism/main-house-CC",
    ga4Properties: [],
  },
  {
    id: "listwin-ventures",
    name: "Listwin Ventures",
    domain: "listwinventures.com",
    url: "https://listwinventures.com",
    blurb:
      "Don Listwin's venture and investment practice (also lvventures.com).",
    hasLeads: false,
    logo: "/logos/listwin-ventures.png",
    category: "ventures",
    ga4Properties: [
      {
        id: "514358412",
        label: "Listwin Ventures",
        snapshotSource: true,
      },
    ],
  },
  {
    id: "canary-foundation",
    name: "Canary Foundation",
    domain: "canaryfoundation.org",
    url: "https://www.canaryfoundation.org",
    blurb:
      "Nonprofit pioneering early cancer detection research and donor programs.",
    hasLeads: false,
    logo: "/logos/canary-foundation.webp",
    category: "nonprofit",
    repo: "enzo-prism/canary-foundation",
    ga4Properties: [
      {
        id: "311697082",
        label: "Canary Foundation",
        snapshotSource: true,
      },
    ],
  },
];

export function getSite(id: string): Site | undefined {
  return SITES.find((s) => s.id === id);
}
