"use client";

import { useState } from "react";
import type { HistoryEntry } from "@/types/trends";

const QUICK_CHIPS = [
  "Sneakers",
  "Running shoes",
  "Protein powder",
  "Wireless earbuds",
  "Coffee maker",
  "Standing desk",
];

interface Props {
  onSearch: (terms: string[]) => void;
  history: HistoryEntry[];
  loading: boolean;
}

export default function SearchCompareCard({ onSearch, history, loading }: Props) {
  const [input, setInput] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const terms = input
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const isMulti = terms.length > 1;
  const isOverLimit = terms.length > 5;

  function handleSearch() {
    const valid = terms.slice(0, 5);
    if (valid.length) onSearch(valid);
    setShowHistory(false);
  }

  function handleChip(chip: string) {
    setInput((prev) => {
      if (!prev.trim()) return chip;
      const existing = prev
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      if (existing.length >= 5) return prev;
      return [...existing, chip].join(", ");
    });
  }

  function handleHistorySelect(entry: HistoryEntry) {
    setInput(entry.terms.join(", "));
    onSearch(entry.terms);
    setShowHistory(false);
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800/70 rounded-xl p-5 shadow-lg shadow-black/20">
      {/* Card header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">Search & Compare</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Enter up to 5 comma-separated product keywords</p>
        </div>
        {isMulti && !isOverLimit && (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-600/10 border border-cyan-600/20 text-xs text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            Comparison mode · {terms.length} terms
          </span>
        )}
        {isOverLimit && (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-600/10 border border-amber-600/20 text-xs text-amber-400">
            Max 5 terms
          </span>
        )}
      </div>

      {/* Input row */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              className="w-full bg-zinc-800/80 border border-zinc-700/60 rounded-lg px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500/70 focus:ring-1 focus:ring-violet-500/30 transition-all pr-10"
              placeholder="e.g. nike shoes, adidas shoes, new balance"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && !isOverLimit && handleSearch()}
              onFocus={() => history.length > 0 && setShowHistory(true)}
              disabled={loading}
            />
            {input && (
              <button
                onClick={() => setInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || isOverLimit || !input.trim()}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg text-sm font-semibold transition-all shadow-[0_0_12px_rgba(139,92,246,0.25)] hover:shadow-[0_0_18px_rgba(139,92,246,0.4)]"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Fetching
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                Analyze
              </>
            )}
          </button>
        </div>

        {/* History dropdown */}
        {showHistory && history.length > 0 && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowHistory(false)}
            />
            <div className="absolute z-20 top-full mt-1.5 left-0 right-[88px] bg-zinc-800 border border-zinc-700/60 rounded-xl shadow-2xl overflow-hidden">
              <div className="px-3 pt-2.5 pb-1.5 border-b border-zinc-700/40">
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Recent searches</span>
              </div>
              <div className="max-h-52 overflow-y-auto">
                {history.slice(0, 10).map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => handleHistorySelect(entry)}
                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-zinc-700/50 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <svg className="w-3.5 h-3.5 text-zinc-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                      </svg>
                      <span className="text-sm text-zinc-300 truncate">{entry.terms.join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      {entry.terms.length > 1 && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-900/40 text-cyan-500 border border-cyan-800/40">
                          compare
                        </span>
                      )}
                      <span className="text-xs text-zinc-500">
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Quick chips */}
      <div className="mt-3.5 flex flex-wrap gap-2">
        <span className="text-xs text-zinc-500 flex items-center">Try:</span>
        {QUICK_CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => handleChip(chip)}
            disabled={loading}
            className="text-xs px-3 py-1 rounded-full border border-zinc-700/60 bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 hover:bg-zinc-700/50 transition-colors disabled:opacity-40"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
