"use client";

interface Props {
  loading: boolean;
  onRefresh: () => void;
}

export default function TopHeader({ loading, onRefresh }: Props) {
  return (
    <header className="h-[60px] bg-zinc-900/80 border-b border-zinc-800/60 flex items-center justify-between px-6 shrink-0 backdrop-blur-sm">
      {/* Left: title */}
      <div>
        <h1 className="text-sm font-semibold text-zinc-100 leading-none">Product Trend Analysis</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Compare product demand, regions, and AI-generated insights</p>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Date range placeholder */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-700/60 bg-zinc-800/50 text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Past 12 months
        </button>

        {/* Export placeholder */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-700/60 bg-zinc-800/50 text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-4-4 4m0 0-4-4m4 4V4" />
          </svg>
          Export
        </button>

        {/* Refresh */}
        <button
          onClick={onRefresh}
          disabled={loading}
          title="Refresh"
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-zinc-700/60 bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors disabled:opacity-40"
        >
          <svg
            className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M23 4v6h-6M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
        </button>

        {/* Source badge */}
        <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-600/10 border border-violet-600/20 text-xs text-violet-400">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
          Google Trends via SerpAPI
        </span>
      </div>
    </header>
  );
}
