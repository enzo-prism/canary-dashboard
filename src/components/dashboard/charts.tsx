"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompact, formatDate, formatNumber } from "@/lib/format";
import type { TrendPoint } from "@/data/types";

type SeriesDef = { key: string; label: string; color: string };

function TooltipBox({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string; dataKey?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-md">
      <div className="mb-1 font-medium text-foreground">{label ? formatDate(String(label)) : ""}</div>
      <div className="space-y-1">
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="size-2 rounded-full" style={{ background: entry.color }} />
              {entry.name}
            </span>
            <span className="font-medium tabular-nums text-foreground">
              {formatNumber(Number(entry.value))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const AXIS = "var(--muted-foreground)";

function AreaTrend({
  data,
  series,
  dualAxis = false,
}: {
  data: TrendPoint[];
  series: SeriesDef[];
  dualAxis?: boolean;
}) {
  const interval = Math.floor(data.length / 6);
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 4, left: -8, bottom: 0 }}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={s.color} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(v) => formatDate(String(v))}
          interval={interval}
          tick={{ fontSize: 11, fill: AXIS }}
          tickLine={false}
          axisLine={false}
          minTickGap={16}
        />
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 11, fill: AXIS }}
          tickFormatter={(v) => formatCompact(Number(v))}
          tickLine={false}
          axisLine={false}
          width={42}
        />
        {dualAxis && (
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 11, fill: AXIS }}
            tickFormatter={(v) => formatCompact(Number(v))}
            tickLine={false}
            axisLine={false}
            width={42}
          />
        )}
        <Tooltip content={<TooltipBox />} />
        {series.map((s, i) => (
          <Area
            key={s.key}
            yAxisId={dualAxis && i === 1 ? "right" : "left"}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color}
            strokeWidth={2}
            fill={`url(#grad-${s.key})`}
            dot={false}
            activeDot={{ r: 3 }}
            isAnimationActive={false}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function TrafficTrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <AreaTrend
      data={data}
      series={[
        { key: "sessions", label: "Sessions", color: "var(--chart-1)" },
        { key: "users", label: "Users", color: "var(--chart-2)" },
      ]}
    />
  );
}

export function SearchTrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <AreaTrend
      data={data}
      dualAxis
      series={[
        { key: "impressions", label: "Impressions", color: "var(--chart-3)" },
        { key: "clicks", label: "Clicks", color: "var(--chart-1)" },
      ]}
    />
  );
}

export function LeadsTrendChart({ data }: { data: TrendPoint[] }) {
  const interval = Math.floor(data.length / 6);
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 4, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(v) => formatDate(String(v))}
          interval={interval}
          tick={{ fontSize: 11, fill: AXIS }}
          tickLine={false}
          axisLine={false}
          minTickGap={16}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11, fill: AXIS }}
          tickLine={false}
          axisLine={false}
          width={28}
        />
        <Tooltip content={<TooltipBox />} cursor={{ fill: "var(--muted)" }} />
        <Bar
          dataKey="leads"
          name="Leads"
          fill="var(--chart-1)"
          radius={[3, 3, 0, 0]}
          maxBarSize={18}
          isAnimationActive={false}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
