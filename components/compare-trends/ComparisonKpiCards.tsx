"use client";

import type { CompareWinners, KeywordMetrics } from "@/types/compare-trends";

const ACCENTS = ["violet", "cyan", "emerald", "amber", "violet"] as const;

interface CardProps {
  label: string;
  value: string;
  sub: string;
  accent: (typeof ACCENTS)[number];
  skeleton?: boolean;
}

function MiniCard({ label, value, sub, accent, skeleton }: CardProps) {
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
        <div className="h-3 w-24 bg-zinc-800 rounded animate-pulse mb-3" />
        <div className="h-7 w-28 bg-zinc-800 rounded animate-pulse mb-2" />
        <div className="h-3 w-32 bg-zinc-800 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className={`bg-zinc-900 border border-zinc-800/70 rounded-xl p-4 ${glowMap[accent]} transition-shadow`}>
      <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">{label}</div>
      <div className={`text-xl font-bold tracking-tight ${valueColorMap[accent]} mb-1 truncate`}>{value}</div>
      <div className="text-xs text-zinc-500 line-clamp-2">{sub}</div>
    </div>
  );
}

interface Props {
  winners: CompareWinners;
  metrics: KeywordMetrics[];
  loading: boolean;
}

export default function ComparisonKpiCards({ winners, metrics, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <MiniCard key={i} label="" value="" sub="" accent="violet" skeleton />
        ))}
      </div>
    );
  }

  if (!metrics.length) return null;

  const by = Object.fromEntries(metrics.map((m) => [m.keyword, m])) as Record<string, KeywordMetrics>;

  const cards: CardProps[] = [
    {
      label: "Top performer",
      value: winners.topPerformer ?? "—",
      sub: winners.topPerformer
        ? `Highest avg interest (${by[winners.topPerformer]?.average.toFixed(1)})`
        : "Need data",
      accent: "violet",
    },
    {
      label: "Most stable",
      value: winners.mostStable ?? "—",
      sub: winners.mostStable
        ? `Lowest volatility (σ ${by[winners.mostStable]?.volatility.toFixed(1)})`
        : "Need data",
      accent: "cyan",
    },
    {
      label: "Most seasonal",
      value: winners.mostSeasonal ?? "—",
      sub: winners.mostSeasonal
        ? `Peak/season score ${by[winners.mostSeasonal]?.seasonalityScore.toFixed(0)}`
        : "Need data",
      accent: "amber",
    },
    {
      label: "Most promising",
      value: winners.mostPromising ?? "—",
      sub: winners.mostPromising
        ? `Recent momentum ${by[winners.mostPromising]?.momentum.toFixed(1)}%·slope`
        : "Need data",
      accent: "emerald",
    },
    {
      label: "Peak leader",
      value: winners.peakLeader ?? "—",
      sub: winners.peakLeader ? `Max spike ${by[winners.peakLeader]?.peak.toFixed(0)}` : "Need data",
      accent: "violet",
    },
    {
      label: "Consistency",
      value: "See chart",
      sub: "Lower volatility + smoother momentum usually means easier forecasting.",
      accent: "cyan",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {cards.map((c, i) => (
        <MiniCard key={c.label} {...c} accent={ACCENTS[i % ACCENTS.length]} />
      ))}
    </div>
  );
}
