"use client";

import type { RegionDataPoint } from "@/types/trends";

interface Props {
  terms: string[];
  data: RegionDataPoint[];
  loading: boolean;
}

function Skeleton() {
  return (
    <div className="bg-zinc-900 border border-zinc-800/70 rounded-xl p-5 h-full">
      <div className="h-3 w-32 bg-zinc-800 rounded animate-pulse mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-3 flex-1 bg-zinc-800 rounded animate-pulse" />
            <div className="h-3 w-8 bg-zinc-800 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-zinc-900 border border-zinc-800/70 rounded-xl p-5 flex flex-col items-center justify-center min-h-[160px] h-full">
      <div className="text-xs text-zinc-500">No region data available</div>
    </div>
  );
}

export default function RegionTableCard({ terms, data, loading }: Props) {
  if (loading) return <Skeleton />;
  if (!data.length) return <EmptyState />;

  const isMulti = terms.length > 1;

  // Compute max for progress bars
  const allScores = data.map((r) => r.extracted_value ?? r.values?.[0]?.extracted_value ?? 0);
  const maxScore = Math.max(...allScores, 1);

  return (
    <div className="bg-zinc-900 border border-zinc-800/70 rounded-xl overflow-hidden h-full flex flex-col">
      <div className="px-5 py-4 border-b border-zinc-800/60 shrink-0">
        <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
          Interest by Region
        </h2>
        <p className="text-xs text-zinc-500 mt-0.5">Top {Math.min(data.length, 12)} regions</p>
      </div>
      <div className="overflow-y-auto flex-1">
        <div className="px-5 py-3 space-y-2.5">
          {data.slice(0, 12).map((row) => {
            const score = row.extracted_value ?? row.values?.[0]?.extracted_value ?? 0;
            const pct = Math.round((score / maxScore) * 100);
            return (
              <div key={row.location}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-zinc-300 truncate pr-4">{row.location}</span>
                  {isMulti ? (
                    <div className="flex items-center gap-2 shrink-0">
                      {terms.slice(0, 3).map((term, i) => {
                        const match = row.values?.find((v) => v.query === term);
                        const colors = ["text-violet-400", "text-cyan-400", "text-emerald-400"];
                        return (
                          <span key={term} className={`font-mono text-xs ${colors[i % colors.length]}`}>
                            {match?.extracted_value ?? "—"}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="font-mono text-xs text-violet-400 shrink-0">{score}</span>
                  )}
                </div>
                {!isMulti && (
                  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-600/70 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
