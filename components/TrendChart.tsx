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

const COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

interface Props {
  terms: string[];
  data: TimelineDataPoint[];
}

export default function TrendChart({ terms, data }: Props) {
  if (!data.length) return null;

  const chartData = data.map((point) => {
    const entry: Record<string, string | number> = { date: point.date };
    for (const val of point.values) {
      entry[val.query] = val.extracted_value;
    }
    return entry;
  });

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-4">
        Interest Over Time
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#71717a", fontSize: 11 }}
            tickFormatter={(v: string) => v.split(" ")[0]}
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
          {terms.map((term, i) => (
            <Line
              key={term}
              type="monotone"
              dataKey={term}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
