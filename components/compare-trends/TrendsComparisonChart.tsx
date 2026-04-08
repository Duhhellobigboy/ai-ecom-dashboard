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
import type { CompareTimelinePoint } from "@/types/compare-trends";

const COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

interface Props {
  keywords: string[];
  timeline: CompareTimelinePoint[];
}

export default function TrendsComparisonChart({ keywords, timeline }: Props) {
  if (!timeline.length) return null;

  const chartData = timeline.map((point) => {
    const entry: Record<string, string | number | null> = { date: point.date };
    for (const term of keywords) {
      const v = point.values[term];
      entry[term] = Number.isFinite(v) ? v : null;
    }
    return entry;
  });

  let maxVal = 0;
  let minVal = 100;
  for (const row of chartData) {
    for (const k of keywords) {
      const v = row[k];
      if (typeof v === "number") {
        if (v > maxVal) maxVal = v;
        if (v < minVal) minVal = v;
      }
    }
  }
  const spread = maxVal - minVal;
  const dominated = keywords.length > 1 && spread > 55 && maxVal >= 85 && minVal <= 25;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">Interest over time</h2>
        {dominated && (
          <p className="text-[11px] text-amber-500/90 max-w-md">
            One series may visually dominate the chart when interest is much higher on the 0–100 scale. Metrics
            and KPIs still compare each keyword fairly.
          </p>
        )}
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#71717a", fontSize: 10 }}
            tickFormatter={(v: string) => (v.length > 14 ? `${v.slice(0, 12)}…` : v)}
            interval="preserveStartEnd"
          />
          <YAxis tick={{ fill: "#71717a", fontSize: 11 }} domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #3f3f46",
              borderRadius: 8,
            }}
            labelStyle={{ color: "#a1a1aa" }}
            itemStyle={{ color: "#d4d4d8" }}
          />
          <Legend wrapperStyle={{ color: "#a1a1aa", fontSize: 12 }} />
          {keywords.map((term, i) => (
            <Line
              key={term}
              type="monotone"
              dataKey={term}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2}
              dot={false}
              connectNulls
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
