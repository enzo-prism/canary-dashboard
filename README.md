# Listwin Portfolio — Executive Dashboard

A private executive dashboard for **Don Listwin**, summarizing the performance of
the four web properties Prism manages for him:

| Site | Domain | Type | Leads |
| --- | --- | --- | --- |
| Canary Cove | `canarycove.com` | Hospitality | ✅ Formspree |
| Belize Kids Foundation | `belizekids.org` | Nonprofit | — |
| Listwin Ventures | `listwinventures.com` (`lvventures.com`) | Ventures | — |
| Canary Foundation | `canaryfoundation.org` | Nonprofit | — |

Each site has its own tab in the left sidebar. Inside a site you get:

- **Analytics** — Google Analytics 4: users, sessions, engagement, a daily
  traffic trend, channels, devices, top pages, and top countries.
- **Search Console** — Google Search Console: clicks, impressions, CTR, average
  position, a daily clicks/impressions trend, top queries, and top pages.
- **Leads** — _Canary Cove only_: Formspree inquiry volume, conversion, response
  time, a daily lead trend, and a recent-inquiry table.

The landing page (`/`) is a portfolio roll-up with one card per site.

## Stack

- **Next.js 16** (App Router, React 19, Turbopack) — statically prerendered.
- **ShadCN UI** (`radix-nova` style) + **Tailwind CSS v4**.
- **Recharts** for the trend charts.
- **lucide-react** icons.

Matches the house stack used by `lead-dashboard`.

## Data model — manual snapshots

This dashboard does **not** call the Google or Formspree APIs at runtime. All
numbers are curated **snapshots** that the Prism team refreshes from each
property's GA4 / Search Console reports with `gogcli` (and Formspree for Canary
Cove). This is the same operating model as the Prism `lead-dashboard`.

Everything the UI renders comes from one place:

- **`src/lib/sites.ts`** — the site registry (names, domains, accent colors,
  which sites collect leads, sidebar order).
- **`src/data/snapshots.ts`** — the curated GA / GSC / leads data per site.
  **This is the file you edit to update the dashboard.**
- **`src/data/types.ts`** — the snapshot shape (KPIs, trends, tables, leads).
- **`src/data/series.ts`** — date helpers plus the real lead-count series helper.

### To update a site's numbers

1. Open `src/data/snapshots.ts`.
2. Refresh GA4 and Search Console with `gogcli`.
3. Replace that site's headline KPIs, daily trend rows, channel/device/country
   splits, top pages, queries, and search pages.
4. Bump `UPDATED_AT`.
5. Redeploy.

### Wiring live APIs later

The page components treat **`getSnapshot(siteId)`** in `src/data/snapshots.ts` as
the only data boundary. To go live, make it `async` and fetch from the GA4 Data
API + Search Console API + Formspree, returning the same `SiteSnapshot` shape —
no UI changes required. (`ExternalConnection`-style credentials would live in env
vars / a service-account JSON, as in `lead-dashboard`.)

## Develop

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## Build & run

```bash
pnpm build
pnpm start
```

## Quality

```bash
pnpm typecheck
pnpm lint
```

## Project structure

```
src/
  app/
    layout.tsx            # sidebar + main shell
    page.tsx              # portfolio overview (landing)
    [site]/page.tsx       # per-site dashboard (Analytics / Search / Leads tabs)
  components/
    dashboard/            # sidebar, page header, KPI cards, charts, tables, panels
    ui/                   # ShadCN primitives
  data/
    snapshots.ts          # ← curated per-site data (edit here)
    series.ts             # seeded daily-trend generator
    types.ts              # snapshot types
  lib/
    sites.ts              # site registry
    format.ts             # number/date formatting
```
