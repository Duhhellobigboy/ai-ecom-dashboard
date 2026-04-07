"use client";

import { useCallback, useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopHeader from "@/components/TopHeader";
import CompareControls from "@/components/compare-trends/CompareControls";
import CompareStatePanel from "@/components/compare-trends/CompareStatePanel";
import TrendsComparisonChart from "@/components/compare-trends/TrendsComparisonChart";
import ComparisonKpiCards from "@/components/compare-trends/ComparisonKpiCards";
import AiCompareSummary from "@/components/compare-trends/AiCompareSummary";
import SourceAttribution from "@/components/compare-trends/SourceAttribution";
import { normalizeCompareKeywords } from "@/lib/compare-trends/keywords";
import { computeKeywordMetrics, pickWinners } from "@/lib/compare-trends/metrics";
import { buildCompareSummary } from "@/lib/compare-trends/summary";
import type { CompareTrendsResponse } from "@/types/compare-trends";

export default function CompareTrendsPage() {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState("today 12-m");
  const [geo, setGeo] = useState("");
  const [category, setCategory] = useState("");
  const [data, setData] = useState<CompareTrendsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runCompare = useCallback(async () => {
    const { keywords: normalized, error: vErr } = normalizeCompareKeywords(keywords);
    if (vErr) {
      setError(vErr);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const body: Record<string, unknown> = {
        keywords: normalized,
        timeRange,
        geo,
      };
      const cat = category.trim();
      if (cat) body.category = cat;

      const res = await fetch("/api/compare-trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Request failed");
      const payload = json as CompareTrendsResponse;
      setData(payload);
      setKeywords(payload.keywords);
    } catch (e: unknown) {
      setData(null);
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [keywords, timeRange, geo, category]);

  const metrics = useMemo(() => {
    if (!data) return [];
    return computeKeywordMetrics(data.timeline, data.keywords);
  }, [data]);

  const winners = useMemo(() => pickWinners(metrics), [metrics]);

  const summary = useMemo(() => {
    if (!data) return null;
    return buildCompareSummary(metrics, winners, data.timeline.length);
  }, [data, metrics, winners]);

  const handleRefresh = useCallback(() => {
    if (data) void runCompare();
  }, [data, runCompare]);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0">
        <TopHeader
          loading={loading}
          onRefresh={data ? handleRefresh : undefined}
          title="Compare Trends"
          subtitle="Strength, stability, seasonality, and momentum — multiple products on one chart."
        />

        <main className="flex-1 overflow-y-auto">
          <div className="px-6 py-6 space-y-5 max-w-[1100px]">
            <header className="space-y-1">
              <h2 className="text-lg font-semibold text-zinc-100 tracking-tight">Keyword comparison</h2>
              <p className="text-sm text-zinc-500">
                Add 2–5 keywords, choose a window and region, then compare. Insights use rule-based logic on
                Google Trends relative scores.
              </p>
            </header>

            <CompareControls
              keywords={keywords}
              onKeywordsChange={(next) => {
                setError(null);
                setKeywords(next);
              }}
              timeRange={timeRange}
              onTimeRangeChange={(v) => {
                setError(null);
                setTimeRange(v);
              }}
              geo={geo}
              onGeoChange={(v) => {
                setError(null);
                setGeo(v);
              }}
              category={category}
              onCategoryChange={(v) => {
                setError(null);
                setCategory(v);
              }}
              onCompare={() => void runCompare()}
              loading={loading}
            />

            {loading && <CompareStatePanel state="loading" />}
            {!loading && error && (
              <CompareStatePanel state="error" errorMessage={error} onRetry={() => void runCompare()} />
            )}
            {!loading && !error && !data && <CompareStatePanel state="empty" />}
            {!loading && !error && data && (
              <div className="space-y-5">
                <TrendsComparisonChart keywords={data.keywords} timeline={data.timeline} />
                <ComparisonKpiCards winners={winners} metrics={metrics} loading={false} />
                <AiCompareSummary summary={summary} keywords={data.keywords} loading={false} />
                <SourceAttribution />
              </div>
            )}

            <div className="h-4" />
          </div>
        </main>
      </div>
    </div>
  );
}
