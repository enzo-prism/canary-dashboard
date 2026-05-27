import type { TrendPoint } from "./types";

export const PERIOD_DAYS = 28;
/** Fixed snapshot end date so the dashboard is deterministic, not "today"-dependent. */
export const RANGE_END = "2026-05-25";

function isoDaysAgo(end: string, daysBack: number): string {
  const d = new Date(`${end}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - daysBack);
  return d.toISOString().slice(0, 10);
}

export function rangeStart(end = RANGE_END, days = PERIOD_DAYS): string {
  return isoDaysAgo(end, days - 1);
}

/**
 * Build a daily series from real per-day counts (e.g. actual form submissions).
 * Fills every day in [startISO, endISO] inclusive, defaulting missing days to 0.
 */
export function countsSeries(
  key: string,
  startISO: string,
  endISO: string,
  counts: Record<string, number>,
): TrendPoint[] {
  const out: TrendPoint[] = [];
  const cur = new Date(`${startISO}T00:00:00Z`);
  const end = new Date(`${endISO}T00:00:00Z`);
  while (cur <= end) {
    const date = cur.toISOString().slice(0, 10);
    out.push({ date, [key]: counts[date] ?? 0 });
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return out;
}
