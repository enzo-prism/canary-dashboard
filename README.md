# Listwin Portfolio — Executive Dashboard

A private executive dashboard for **Don Listwin**. The first screen is the
board: all five projects, a snapshot of how each is doing, and the key numbers
from the last reviewed export.

| Site | Domain | Type | Notes |
| --- | --- | --- | --- |
| Canary Cove | `canarycove.com` | Hospitality | Formspree inquiry **summary** only. Full roster: [canarycove-dash](https://canarycove-dash.vercel.app) |
| Belize Kids Foundation | `belizekids.org` | Nonprofit | Two GA4 properties, labeled separately |
| Main House | `mainhouse.canarycove.com` | Hospitality | Repo `enzo-prism/main-house-CC`. Host-filtered Search Console; GA4 unavailable |
| Listwin Ventures | `listwinventures.com` (`lvventures.com`) | Ventures | |
| Canary Foundation | `canaryfoundation.org` | Nonprofit | Repo `enzo-prism/canary-foundation` |

`canarycove-dash` stays the Cove **booking leads** board. This repo does not
duplicate that guest roster.

Each project has its own route. Inside a site you get:

- **Analytics** — Google Analytics 4: users, sessions, engagement, a daily
  traffic trend, channels, devices, top pages, and top countries.
- **Search Console** — clicks, impressions, CTR, average position, a daily
  trend, top queries, and top pages.
- **Leads** — _Canary Cove only_: inquiry volume, unique senders, booking-request
  submissions, and a link out to the live inquiry board. No private inquiry roster is embedded.

The landing page (`/`) is the executive roll-up plus a data-health strip
(complete or partial source coverage and labeled GA4 property IDs).

## Stack

- **Next.js 16** (App Router, React 19, Turbopack) — statically prerendered.
- **ShadCN UI** (`radix-nova` style) + **Tailwind CSS v4**.
- **Recharts** for the trend charts.
- **lucide-react** icons.

Visual feel follows the RDA Executive Dashboard contract (calm, private,
operational; Geist; 8/16/24/40/64 spacing; two surface levels) without copying
dental pages or RDA logo-blue.

## Data model — curated snapshots

This dashboard does **not** call the Google, Formspree, or ads APIs at runtime.
All numbers are curated **snapshots**. Do not invent live traffic, named guests,
or donors.

- **`src/lib/sites.ts`** — the site registry (names, domains, categories, GA4
  property labels, which sites collect leads, sidebar order).
- **`src/data/reviewed-google-snapshots.json`** — the reviewed Google metrics.
- **`src/data/reviewed-leads-summary.json`** — the reviewed aggregate Cove intake summary.
- **`src/data/snapshots.ts`** — typed read access and portfolio/lead roll-ups.
- **`src/data/types.ts`** — the snapshot shape (KPIs, trends, tables, leads,
  review status).
- **`src/data/series.ts`** — date helpers plus the real lead-count series helper.

Known GA4 property IDs (labels / data-health only):

| Site | Properties |
| --- | --- |
| Canary Cove | `311646376` (Canary Cove Main Site) · `529589780` (Canary Projects, snapshot source). Hostname: `canarycove.com`. Not merged. |
| Belize Kids | `311657885` · `489942783` (Canary Projects, snapshot source). Not merged. |
| Listwin Ventures | `514358412` |
| Canary Foundation | `311697082` |
| Main House | No verified GA4 measurement. Search uses `sc-domain:canarycove.com` with exact Main House page-prefix filtering. |

### To update a site's numbers

1. Review `docs/data-refresh-2026-10-28.md` for exact reporting scopes and current windows.
2. Run `python3 scripts/refresh-google-snapshots.py --refresh` to read the fixed reviewed periods from Google through authenticated, read-only Google requests.
3. Run `python3 scripts/validate-snapshots.py` to compare delivered totals and trends with the preserved source responses.
4. Refresh the separate aggregate Cove lead summary from the reviewed operational board. No private roster belongs in this dashboard.
5. Run typecheck, lint and build before release; verify the deployed values afterward.

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
    page.tsx              # executive roll-up (landing)
    [site]/page.tsx       # per-site dashboard (Analytics / Search / Leads tabs)
  components/
    dashboard/            # sidebar, page header, KPI cards, charts, tables, panels
    ui/                   # ShadCN primitives
  data/
    snapshots.ts          # typed snapshots and roll-ups
    series.ts             # date helpers + lead-count series
    types.ts              # snapshot types
  lib/
    sites.ts              # site registry
    format.ts             # number/date formatting
```
