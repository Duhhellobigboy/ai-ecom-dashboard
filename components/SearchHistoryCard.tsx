"use client";

import type { HistoryEntry } from "@/types/trends";

interface Props {
  history: HistoryEntry[];
  onSelect: (terms: string[]) => void;
}

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function SearchHistoryCard({ history, onSelect }: Props) {
  return (
    <div className="bg-zinc-900 border border-zinc-800/70 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-800/60 flex items-center justify-between">
        <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Search History</h2>
        {history.length > 0 && (
          <span className="text-xs text-zinc-600">{history.length} searches</span>
        )}
      </div>

      {history.length === 0 ? (
        <div className="px-5 py-6 text-xs text-zinc-500 text-center">
          No searches yet. Your history will appear here.
        </div>
      ) : (
        <ul className="divide-y divide-zinc-800/50">
          {history.slice(0, 8).map((entry) => (
            <li key={entry.id}>
              <button
                onClick={() => onSelect(entry.terms)}
                className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-zinc-800/40 transition-colors group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <svg
                    className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 shrink-0 transition-colors"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  <div className="min-w-0">
                    <div className="text-sm text-zinc-300 truncate group-hover:text-zinc-100 transition-colors">
                      {entry.terms.join(", ")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  {entry.terms.length > 1 && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-900/30 border border-cyan-800/30 text-cyan-500">
                      ×{entry.terms.length}
                    </span>
                  )}
                  <span className="text-xs text-zinc-600">{timeAgo(entry.timestamp)}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
