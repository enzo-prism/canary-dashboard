export type SiteId =
  | "canary-cove"
  | "belize-kids"
  | "listwin-ventures"
  | "canary-foundation";

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
};

/**
 * Don Listwin's portfolio of sites that Prism manages. The order here is the
 * order they appear in the left sidebar.
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
  },
];

export function getSite(id: string): Site | undefined {
  return SITES.find((s) => s.id === id);
}
