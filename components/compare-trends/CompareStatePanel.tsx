"use client";

type State = "idle" | "loading" | "empty" | "error";

interface Props {
  state: State;
  errorMessage?: string | null;
  onRetry?: () => void;
  children?: React.ReactNode;
}

export default function CompareStatePanel({ state, errorMessage, onRetry, children }: Props) {
  if (state === "loading") {
    return (
      <div className="rounded-xl border border-zinc-800/70 bg-zinc-900/50 p-8 space-y-4">
        <div className="h-4 w-48 bg-zinc-800 rounded animate-pulse" />
        <div className="h-[280px] bg-zinc-800/60 rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="h-24 bg-zinc-800/50 rounded-lg animate-pulse" />
          <div className="h-24 bg-zinc-800/50 rounded-lg animate-pulse" />
          <div className="h-24 bg-zinc-800/50 rounded-lg animate-pulse" />
        </div>
        <p className="text-xs text-zinc-500 text-center">Comparing trends…</p>
      </div>
    );
  }

  if (state === "empty") {
    return (
      <div className="rounded-xl border border-dashed border-zinc-700/60 bg-zinc-900/30 px-6 py-12 text-center">
        <p className="text-sm font-medium text-zinc-400 mb-1">Enter at least 2 keywords to compare</p>
        <p className="text-xs text-zinc-600 max-w-md mx-auto">
          Add product or brand terms above, pick a time range and region, then run the comparison to see
          the chart, KPIs, and a rule-based summary.
        </p>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="rounded-xl border border-red-800/40 bg-red-950/25 px-5 py-4 flex flex-col sm:flex-row sm:items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-red-900/40 border border-red-800/50 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4m0 4h.01" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-red-300">Could not load comparison</div>
          <div className="text-xs text-red-400/80 mt-1">{errorMessage ?? "Unknown error"}</div>
          <div className="text-xs text-red-500/50 mt-1">
            Check your SerpAPI key, try fewer keywords, or change region / time range.
          </div>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-red-900/40 border border-red-800/50 text-xs font-semibold text-red-200 hover:bg-red-900/60 transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
