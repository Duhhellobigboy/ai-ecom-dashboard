"use client";

import type { TrendsResponse } from "@/types/trends";

interface KpiCardProps {
  label: string;
  value: string;
  sub: string;
  accent?: "violet" | "cyan" | "emerald" | "amber";
  skeleton?: boolean;
}

function KpiCard({ label, value, sub, accent = "violet", skeleton }: KpiCardProps) {
  const glowMap = {
    violet: "shadow-[0_0_18px_rgba(139,92,246,0.12)]",
    cyan: "shadow-[0_0_18px_rgba(6,182,212,0.12)]",
    emerald: "shadow-[0_0_18px_rgba(16,185,129,0.12)]",
    amber: "shadow-[0_0_18px_rgba(245,158,11,0.12)]",
  };
  const valueColorMap = {
    violet: "text-violet-400",
    cyan: "text-cyan-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
  };

  if (skeleton) {
    return (
      <div className="bg-zinc-900 border border-zinc-800/70 rounded-xl p-4">
        <div className="h-3 w-20 bg-zinc-800 rounded animate-pulse mb-3" />
        <div className="h-7 w-16 bg-zinc-800 rounded animate-pulse mb-2" />
        <div className="h-3 w-24 bg-zinc-800 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className={`bg-zinc-900 border border-zinc-800/70 rounded-xl p-4 ${glowMap[accent]} transition-shadow`}>
      <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">{label}</div>
      <div className={`text-2xl font-bold tracking-tight ${valueColorMap[accent]} mb-1`}>{value}</div>
      <div className="text-xs text-zinc-500 truncate">{sub}</div>
    </div>
  );
}

interface Props {
  results: TrendsResponse | null;
  loading: boolean;
}

export default function KpiCards({ results, loading }: Props) {
  if (!results && !loading) return null;

  if (loading) {
    return (
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <KpiCard label="" value="" sub="" skeleton />
        <KpiCard label="" value="" sub="" skeleton />
        <KpiCard label="" value="" sub="" skeleton />
        <KpiCard label="" value="" sub="" skeleton />
      </div>
    );
  }

  if (!results) return null;

  // Compute peak interest across all terms and all timeline points
  let peak = 0;
  for (const pt of results.interest_over_time) {
    for (const v of pt.values) {
      if (v.extracted_value > peak) peak = v.extracted_value;
    }
  }

  // Latest value: last timeline point, first term
  const lastPoint = results.interest_over_time[results.interest_over_time.length - 1];
  const latest = lastPoint?.values?.[0]?.extracted_value ?? 0;
  const latestTerm = lastPoint?.values?.[0]?.query ?? results.terms[0] ?? "—";

  // Top region
  let topRegionName = "—";
  let topRegionScore = 0;
  for (const r of results.interest_by_region) {
    const score = r.extracted_value ?? r.values?.[0]?.extracted_value ?? 0;
    if (score > topRegionScore) {
      topRegionScore = score;
      topRegionName = r.location ?? "—";
    }
  }

  // Mode
  const isMulti = results.terms.length > 1;
  const modeLabel = isMulti ? `${results.terms.length} terms` : "Single term";
  const modeSub = isMulti ? results.terms.join(" · ") : results.terms[0];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      <KpiCard
        label="Peak Interest"
        value={String(peak)}
        sub="Highest score across timeline"
        accent="violet"
      />
      <KpiCard
        label="Latest Interest"
        value={String(latest)}
        sub={`Most recent · ${latestTerm}`}
        accent="cyan"
      />
      <KpiCard
        label="Top Region"
        value={topRegionName || "—"}
        sub={topRegionScore ? `Score ${topRegionScore}` : "No region data"}
        accent="emerald"
      />
      <KpiCard
        label="Search Mode"
        value={modeLabel}
        sub={modeSub}
        accent="amber"
      />
    </div>
  );
}
