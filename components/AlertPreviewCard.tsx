"use client";

import { useState } from "react";

const EVENT_TYPES = ["Spikes", "Drops", "Volatility", "New highs"];

export default function AlertPreviewCard() {
  const [enabled, setEnabled] = useState(false);
  const [selected, setSelected] = useState<string[]>(["Spikes"]);

  function toggleEvent(label: string) {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]
    );
  }

  return (
    <div className="mx-4 mb-4 rounded-xl bg-zinc-900 border border-zinc-800/70 overflow-hidden">
      <div className="px-4 py-3.5 border-b border-zinc-800/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 1 0-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" />
          </svg>
          <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">Trend Alerts</h2>
        </div>
        {/* Toggle */}
        <button
          onClick={() => setEnabled((v) => !v)}
          className={`relative w-9 h-5 rounded-full transition-colors ${enabled ? "bg-violet-600" : "bg-zinc-700"}`}
          aria-label="Toggle alerts"
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-4" : "translate-x-0"}`}
          />
        </button>
      </div>

      <div className={`px-4 py-3.5 space-y-3.5 transition-opacity ${enabled ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
        {/* Event type chips */}
        <div>
          <div className="text-xs text-zinc-500 mb-2">Notify me on:</div>
          <div className="flex flex-wrap gap-1.5">
            {EVENT_TYPES.map((label) => (
              <button
                key={label}
                onClick={() => toggleEvent(label)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  selected.includes(label)
                    ? "bg-violet-600/20 border-violet-600/40 text-violet-300"
                    : "bg-zinc-800/60 border-zinc-700/40 text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Email placeholder */}
        <div>
          <div className="text-xs text-zinc-500 mb-1.5">Alert destination</div>
          <input
            disabled
            placeholder="email@example.com"
            className="w-full bg-zinc-800/40 border border-zinc-700/40 rounded-lg px-3 py-2 text-xs text-zinc-500 placeholder-zinc-600 cursor-not-allowed"
          />
          <div className="text-xs text-zinc-600 mt-1">Email alerts coming soon</div>
        </div>
      </div>

      {!enabled && (
        <div className="px-4 pb-3.5 text-xs text-zinc-600">
          Enable to configure trend change notifications
        </div>
      )}
    </div>
  );
}
