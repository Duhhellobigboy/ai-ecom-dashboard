"use client";

import { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import TrendChart from "@/components/TrendChart";
import RegionTable from "@/components/RegionTable";
import RelatedQueries from "@/components/RelatedQueries";
import type { TrendsResponse, HistoryEntry } from "@/types/trends";

export default function Home() {
  const [results, setResults] = useState<TrendsResponse | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/trends")
      .then((r) => r.json())
      .then((d) => setHistory(d.history ?? []));
  }, []);

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
      // Refresh history dropdown after new search
      fetch("/api/trends")
        .then((r) => r.json())
        .then((d) => setHistory(d.history ?? []));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Trends Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">Google Trends via SerpAPI — localhost</p>
        </div>

        {/* Search */}
        <SearchBar onSearch={handleSearch} history={history} loading={loading} />

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-3 text-zinc-400 text-sm">
            <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            Fetching trends data...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-950/50 border border-red-800 rounded-lg px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Results */}
        {results && !loading && (
          <div className="space-y-6">
            <TrendChart terms={results.terms} data={results.interest_over_time} />
            <RegionTable terms={results.terms} data={results.interest_by_region} />
            <RelatedQueries
              relatedQueries={results.related_queries}
              relatedTopics={results.related_topics}
            />
          </div>
        )}

      </div>
    </main>
  );
}
