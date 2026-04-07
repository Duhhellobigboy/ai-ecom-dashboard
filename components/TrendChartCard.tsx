"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { TimelineDataPoint } from "@/types/trends";

const COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#f87171"];
const COLOR_LABELS: Record<string, string> = {
  "#8b5cf6": "violet",
  "#06b6d4": "cyan",
  "#10b981": "emerald",
  "#f59e0b": "amber",
  "#f87171": "red",
};

interface Props {
  terms: string[];
  data: TimelineDataPoint[];
  loading: boolean;
}

function Skeleton() {
  return (
    <div className="bg-zinc-900 border border-zinc-800/70 rounded-xl p-5 shadow-lg shadow-black/20">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="h-4 w-36 bg-zinc-800 rounded animate-pulse" />
          <div className="h-3 w-48 bg-zinc-800 rounded animate-pulse mt-1.5" />
        </div>
        <div className="h-7 w-24 bg-zinc-800 rounded-lg animate-pulse" />
      </div>
      <div className="h-[280px] bg-zinc-800/50 rounded-lg animate-pulse" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-zinc-900 border border-zinc-800/70 rounded-xl shadow-lg shadow-black/20 overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/60">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">Interest Over Time</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Google Trends search volume · 0–100 scale</p>
        </div>
      </div>
      {/* Empty body */}
      <div className="flex flex-col items-center justify-center h-[280px] px-6 text-center">
        <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center mb-4 border border-zinc-700/40">
          <svg className="w-5 h-5 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18M8 17l4-8 4 4 4-6" />
          </svg>
        </div>
        <div className="text-sm font-medium text-zinc-400 mb-1">No trend data yet</div>
        <div className="text-xs text-zinc-500 max-w-xs">Search a product above to view Google Trends data over time</div>
      </div>
    </div>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-800 border border-zinc-700/60 rounded-xl px-3.5 py-3 shadow-2xl min-w-[140px]">
      <div className="text-xs text-zinc-400 mb-2">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
            <span className="text-zinc-300 truncate max-w-[120px]">{p.name}</span>
          </div>
          <span className="font-semibold text-zinc-100">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function TrendChartCard({ terms, data, loading }: Props) {
  if (loading) return <Skeleton />;
  if (!data.length) return <EmptyState />;

  const chartData = data.map((point) => {
    const entry: Record<string, string | number> = {
      date: point.date.split(" ")[0],
    };
    for (const val of point.values) {
      entry[val.query] = val.extracted_value;
    }
    return entry;
  });

  const isSingle = terms.length === 1;

  return (
    <div className="bg-zinc-900 border border-zinc-800/70 rounded-xl shadow-lg shadow-black/20 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/60">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">Interest Over Time</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Google Trends search volume · 0–100 scale</p>
        </div>
        <div className="flex items-center gap-2">
          {!isSingle && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-600/10 border border-cyan-600/20 text-xs text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              Comparing {terms.length} terms
            </span>
          )}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700/60 bg-zinc-800/50 text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-4-4 4m0 0-4-4m4 4V4" />
            </svg>
            CSV
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="px-2 pt-4 pb-2">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 4, right: 24, left: -12, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: "#52525b", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: string) => v.slice(0, 7)}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: "#52525b", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              width={32}
            />
            <Tooltip content={<CustomTooltip />} />
            {terms.length > 1 && (
              <Legend
                wrapperStyle={{ paddingTop: 12, fontSize: 12, color: "#a1a1aa" }}
                iconType="circle"
                iconSize={8}
              />
            )}
            {terms.map((term, i) => (
              <Line
                key={term}
                type="monotone"
                dataKey={term}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={isSingle ? 2.5 : 2}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
