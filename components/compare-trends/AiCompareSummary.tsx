"use client";

import type { CompareSummary } from "@/types/compare-trends";

interface Props {
  summary: CompareSummary | null;
  keywords: string[];
  loading: boolean;
}

export default function AiCompareSummary({ summary, keywords, loading }: Props) {
  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-800/70 bg-zinc-900/50 p-5 space-y-3">
        <div className="h-3 w-40 bg-zinc-800 rounded animate-pulse" />
        <div className="h-3 w-full bg-zinc-800/60 rounded animate-pulse" />
        <div className="h-3 w-5/6 bg-zinc-800/60 rounded animate-pulse" />
        <div className="h-3 w-4/6 bg-zinc-800/60 rounded animate-pulse" />
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-700/50 bg-zinc-900/30 p-6 text-center">
        <p className="text-xs text-zinc-500">Run a comparison to generate a rule-based summary (no LLM required).</p>
      </div>
    );
  }

  const badge =
    summary.confidence === "high"
      ? "text-emerald-400/90 border-emerald-700/40 bg-emerald-950/30"
      : summary.confidence === "medium"
        ? "text-amber-400/90 border-amber-700/40 bg-amber-950/30"
        : "text-zinc-400 border-zinc-700/50 bg-zinc-800/40";

  return (
    <div className="rounded-xl border border-zinc-800/70 bg-zinc-900/60 p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-violet-600/20 border border-violet-600/30 flex items-center justify-center">
            <svg className="w-4 h-4 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
            </svg>
          </div>
          <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">AI compare summary</h2>
        </div>
        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badge}`}>
          {summary.confidence} confidence
        </span>
      </div>

      {keywords.length > 0 && (
        <div className="text-xs text-zinc-500">
          Comparing: <span className="text-zinc-400">{keywords.join(" · ")}</span>
        </div>
      )}

      <ul className="space-y-2">
        {summary.bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-zinc-300 leading-relaxed">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
            {b}
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-zinc-800/60">
        <Section title="Overall winner" body={summary.sections.overallWinner} />
        <Section title="Stability" body={summary.sections.stability} />
        <Section title="Seasonality" body={summary.sections.seasonality} />
        <Section title="Opportunity signal" body={summary.sections.opportunity} />
      </div>

      <div className="rounded-lg bg-zinc-800/40 border border-zinc-700/40 px-3 py-2.5">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">Caution</div>
        <p className="text-xs text-zinc-400 leading-relaxed">{summary.sections.caution}</p>
      </div>

      <p className="text-[10px] text-zinc-600">
        Rule-based templates from computed metrics · Optional LLM upgrade can replace this block later.
      </p>
    </div>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg bg-zinc-800/30 border border-zinc-700/35 px-3 py-2.5">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">{title}</div>
      <p className="text-xs text-zinc-400 leading-relaxed">{body}</p>
    </div>
  );
}
