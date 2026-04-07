"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import TopHeader from "@/components/TopHeader";
import SearchCompareCard from "@/components/SearchCompareCard";
import KpiCards from "@/components/KpiCards";
import TrendChartCard from "@/components/TrendChartCard";
import RegionTableCard from "@/components/RegionTableCard";
import RelatedQueriesCard from "@/components/RelatedQueriesCard";
import RelatedTopicsCard from "@/components/RelatedTopicsCard";
import SearchHistoryCard from "@/components/SearchHistoryCard";
import AiInsightsPanel from "@/components/AiInsightsPanel";
import AlertPreviewCard from "@/components/AlertPreviewCard";
import type { TrendsResponse, HistoryEntry } from "@/types/trends";

function ErrorBanner({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div className="flex items-start gap-3 bg-red-950/40 border border-red-800/50 rounded-xl px-4 py-3.5">
      <div className="w-8 h-8 rounded-lg bg-red-900/50 border border-red-800/50 flex items-center justify-center shrink-0">
        <svg className="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4m0 4h.01" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-red-300 mb-0.5">Could not load trend data</div>
        <div className="text-xs text-red-400/70">{message}</div>
        <div className="text-xs text-red-500/50 mt-1">Try a different term or check your SerpAPI key.</div>
      </div>
      <button
        onClick={onDismiss}
        className="text-red-600 hover:text-red-400 transition-colors shrink-0 mt-0.5"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function Home() {
  const [results, setResults] = useState<TrendsResponse | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshHistory = useCallback(() => {
    fetch("/api/trends")
      .then((r) => r.json())
      .then((d) => setHistory(d.history ?? []));
  }, []);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  async function handleSearch(terms: string[]) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ terms }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Unknown error");
      setResults(data);
      refreshHistory();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const showInsightsGrid = results !== null || loading;

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Left sidebar */}
      <Sidebar />

      {/* Center + right column */}
      <div className="flex flex-col flex-1 min-w-0">
        <TopHeader loading={loading} onRefresh={refreshHistory} />

        <div className="flex flex-1 min-h-0">
          {/* ── Main scrollable area ── */}
          <main className="flex-1 overflow-y-auto">
            <div className="px-6 py-6 space-y-5 max-w-[1000px]">

              {/* Search hero */}
              <SearchCompareCard
                onSearch={handleSearch}
                history={history}
                loading={loading}
              />

              {/* Error banner */}
              {error && (
                <ErrorBanner message={error} onDismiss={() => setError(null)} />
              )}

              {/* KPI row */}
              <KpiCards results={results} loading={loading} />

              {/* Main chart */}
              <TrendChartCard
                terms={results?.terms ?? []}
                data={results?.interest_over_time ?? []}
                loading={loading}
              />

              {/* Secondary insights grid — shows when loading or results present */}
              {showInsightsGrid && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <RegionTableCard
                      terms={results?.terms ?? []}
                      data={results?.interest_by_region ?? []}
                      loading={loading}
                    />
                    <RelatedQueriesCard
                      data={results?.related_queries ?? { rising: [], top: [] }}
                      loading={loading}
                    />
                  </div>
                  <div className="space-y-4">
                    <RelatedTopicsCard
                      data={results?.related_topics ?? { rising: [], top: [] }}
                      loading={loading}
                    />
                    <SearchHistoryCard
                      history={history}
                      onSelect={handleSearch}
                    />
                  </div>
                </div>
              )}

              {/* Standalone history card shown before first search if history exists */}
              {!showInsightsGrid && history.length > 0 && (
                <div className="max-w-sm">
                  <SearchHistoryCard history={history} onSelect={handleSearch} />
                </div>
              )}

              <div className="h-4" />
            </div>
          </main>

          {/* ── Right AI panel ── */}
          <aside className="w-[300px] xl:w-[320px] border-l border-zinc-800/60 shrink-0 flex flex-col bg-zinc-900/40">
            {/* Panel header */}
            <div className="px-4 py-4 border-b border-zinc-800/60 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_6px_rgba(139,92,246,0.7)]" />
                <span className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">
                  Insight Assistant
                </span>
              </div>
            </div>

            {/* AI panel content — scrolls independently */}
            <div className="flex-1 min-h-0 overflow-y-auto flex flex-col">
              <AiInsightsPanel results={results} />
            </div>

            {/* Alerts — pinned to bottom of right panel */}
            <div className="shrink-0 border-t border-zinc-800/60 pt-4">
              <AlertPreviewCard />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
