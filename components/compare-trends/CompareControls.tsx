"use client";

import KeywordTagInput from "./KeywordTagInput";

export const TIME_RANGE_OPTIONS = [
  { value: "now 7-d", label: "Past 7 days" },
  { value: "today 3-m", label: "Past 3 months" },
  { value: "today 12-m", label: "Past 12 months" },
  { value: "today 5-y", label: "Past 5 years" },
] as const;

export const GEO_OPTIONS = [
  { value: "", label: "Worldwide / default" },
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "JP", label: "Japan" },
  { value: "IN", label: "India" },
  { value: "BR", label: "Brazil" },
] as const;

interface Props {
  keywords: string[];
  onKeywordsChange: (next: string[]) => void;
  timeRange: string;
  onTimeRangeChange: (v: string) => void;
  geo: string;
  onGeoChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  onCompare: () => void;
  loading: boolean;
}

export default function CompareControls({
  keywords,
  onKeywordsChange,
  timeRange,
  onTimeRangeChange,
  geo,
  onGeoChange,
  category,
  onCategoryChange,
  onCompare,
  loading,
}: Props) {
  return (
    <div className="bg-zinc-900 border border-zinc-800/70 rounded-xl p-5 space-y-4">
      <KeywordTagInput keywords={keywords} onChange={onKeywordsChange} disabled={loading} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Time range</label>
          <select
            className="w-full rounded-lg border border-zinc-700/60 bg-zinc-800/60 text-sm text-zinc-200 px-3 py-2 focus:outline-none focus:border-violet-500/50"
            value={timeRange}
            disabled={loading}
            onChange={(e) => onTimeRangeChange(e.target.value)}
          >
            {TIME_RANGE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Region</label>
          <select
            className="w-full rounded-lg border border-zinc-700/60 bg-zinc-800/60 text-sm text-zinc-200 px-3 py-2 focus:outline-none focus:border-violet-500/50"
            value={geo}
            disabled={loading}
            onChange={(e) => onGeoChange(e.target.value)}
          >
            {GEO_OPTIONS.map((o) => (
              <option key={o.value || "ww"} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5 sm:col-span-2 lg:col-span-2">
          <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Category ID <span className="text-zinc-600 normal-case">(optional)</span>
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="e.g. 201 – leave blank for all categories"
            className="w-full rounded-lg border border-zinc-700/60 bg-zinc-800/60 text-sm text-zinc-200 px-3 py-2 placeholder-zinc-600 focus:outline-none focus:border-violet-500/50"
            value={category}
            disabled={loading}
            onChange={(e) => onCategoryChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onCompare}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-45 disabled:cursor-not-allowed text-sm font-semibold text-white transition-colors"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M23 4v6h-6M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              Comparing…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M3 3v18h18M8 17l4-8 4 4 4-6" />
              </svg>
              Compare trends
            </>
          )}
        </button>
        <span className="text-xs text-zinc-600">SerpAPI key required (see README / env).</span>
      </div>
    </div>
  );
}
