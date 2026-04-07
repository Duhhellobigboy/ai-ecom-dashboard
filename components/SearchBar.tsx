"use client";

import { useState } from "react";
import type { HistoryEntry } from "@/types/trends";

interface Props {
  onSearch: (terms: string[]) => void;
  history: HistoryEntry[];
  loading: boolean;
}

export default function SearchBar({ onSearch, history, loading }: Props) {
  const [input, setInput] = useState("");

  function handleSearch() {
    const terms = input
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 5);
    if (terms.length) onSearch(terms);
  }

  function handleHistorySelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const entry = history.find((h) => h.id === e.target.value);
    if (!entry) return;
    setInput(entry.terms.join(", "));
    onSearch(entry.terms);
    e.target.value = "";
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <input
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition"
          placeholder="Enter keywords separated by commas — max 5 (e.g. shoes, boots, sneakers)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && handleSearch()}
          disabled={loading}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg font-semibold transition"
        >
          Search
        </button>
      </div>

      {history.length > 0 && (
        <select
          defaultValue=""
          onChange={handleHistorySelect}
          className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-400 focus:outline-none focus:border-violet-500 transition cursor-pointer"
        >
          <option value="" disabled>
            Previous searches...
          </option>
          {history.map((h) => (
            <option key={h.id} value={h.id}>
              {h.terms.join(", ")} — {new Date(h.timestamp).toLocaleDateString()}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
