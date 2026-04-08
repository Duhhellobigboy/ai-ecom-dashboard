"use client";

import { useCallback, useState } from "react";
import { compareKeywordLimits } from "@/lib/compare-trends/keywords";

interface Props {
  keywords: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
}

export default function KeywordTagInput({ keywords, onChange, disabled }: Props) {
  const [draft, setDraft] = useState("");

  const addKeyword = useCallback(
    (raw: string) => {
      const s = raw.trim().replace(/\s+/g, " ");
      if (!s) return;
      if (s.length > compareKeywordLimits.maxLength) return;
      const key = s.toLowerCase();
      if (keywords.some((k) => k.toLowerCase() === key)) return;
      if (keywords.length >= compareKeywordLimits.max) return;
      onChange([...keywords, s]);
      setDraft("");
    },
    [keywords, onChange],
  );

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
        Keywords ({compareKeywordLimits.min}–{compareKeywordLimits.max})
      </label>
      <div
        className={`flex flex-wrap gap-2 min-h-[42px] rounded-lg border border-zinc-700/60 bg-zinc-800/40 px-2 py-2 ${
          disabled ? "opacity-60" : ""
        }`}
      >
        {keywords.map((k) => (
          <span
            key={k}
            className="inline-flex items-center gap-1 pl-2 pr-1 py-1 rounded-md bg-violet-600/20 border border-violet-500/30 text-xs text-violet-200"
          >
            {k}
            <button
              type="button"
              disabled={disabled}
              onClick={() => onChange(keywords.filter((x) => x !== k))}
              className="p-0.5 rounded hover:bg-violet-500/20 text-violet-300 disabled:opacity-40"
              aria-label={`Remove ${k}`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
        <input
          className="flex-1 min-w-[120px] bg-transparent text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none px-1 py-1"
          placeholder={keywords.length ? "Add another…" : "e.g. matcha · yerba mate"}
          value={draft}
          disabled={disabled || keywords.length >= compareKeywordLimits.max}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addKeyword(draft);
            }
            if (e.key === "Backspace" && !draft && keywords.length) {
              onChange(keywords.slice(0, -1));
            }
          }}
          onBlur={() => {
            if (draft.trim()) addKeyword(draft);
          }}
        />
      </div>
      <p className="text-[11px] text-zinc-600">
        Press Enter to add. Duplicates (case-insensitive) are ignored. Max {compareKeywordLimits.maxLength}{" "}
        chars per keyword.
      </p>
    </div>
  );
}
