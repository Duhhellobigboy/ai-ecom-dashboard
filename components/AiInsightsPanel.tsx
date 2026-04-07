"use client";

import { useState } from "react";
import type { TrendsResponse } from "@/types/trends";

interface Props {
  results: TrendsResponse | null;
}

interface AiMessage {
  id: number;
  prompt: string;
  response: string;
}

const SAMPLE_INSIGHTS = [
  "Search volumes are at a 12-month high.",
  "Interest peaks in Q4 — likely seasonal.",
  "Consider targeting related rising queries.",
];

export default function AiInsightsPanel({ results }: Props) {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [counter, setCounter] = useState(0);

  function handleSend() {
    const text = prompt.trim();
    if (!text) return;
    setMessages((prev) => [
      {
        id: counter,
        prompt: text,
        response:
          "AI analysis is not yet connected. This panel is a preview of the insight assistant — results will appear here once the AI backend is wired up.",
      },
      ...prev,
    ]);
    setCounter((c) => c + 1);
    setPrompt("");
  }

  const isMulti = (results?.terms.length ?? 0) > 1;

  return (
    <div className="flex flex-col h-full">
      {/* AI Compare Summary */}
      <div className="px-4 pt-5 pb-4 border-b border-zinc-800/60">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-md bg-violet-600/20 border border-violet-600/30 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
            </svg>
          </div>
          <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">AI Compare Summary</h2>
        </div>

        {results ? (
          <div className="space-y-2.5">
            {isMulti ? (
              <div className="rounded-lg bg-zinc-800/60 border border-zinc-700/40 px-3 py-3">
                <div className="text-xs text-zinc-400 mb-1.5 font-medium">
                  Comparing: {results.terms.join(" · ")}
                </div>
                <div className="text-xs text-zinc-500 leading-relaxed">
                  AI-powered comparison insights are not yet available. Connect an LLM backend to see which product is stronger, more stable, and trending faster by region.
                </div>
              </div>
            ) : (
              <div className="rounded-lg bg-zinc-800/60 border border-zinc-700/40 px-3 py-3">
                <div className="text-xs text-zinc-400 mb-1.5 font-medium">
                  {results.terms[0]}
                </div>
                <ul className="space-y-1.5">
                  {SAMPLE_INSIGHTS.map((insight, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                      {insight}
                    </li>
                  ))}
                </ul>
                <div className="mt-2 pt-2 border-t border-zinc-700/40 text-xs text-zinc-600">
                  Placeholder insights · AI backend coming soon
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg bg-zinc-800/40 border border-zinc-700/30 px-3 py-4 text-center">
            <div className="text-xs text-zinc-500">Search a product to generate AI insights</div>
          </div>
        )}
      </div>

      {/* Ask AI input */}
      <div className="px-4 py-4 border-b border-zinc-800/60">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Ask AI</h2>
        </div>
        <div className="flex flex-col gap-2">
          <textarea
            className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 resize-none transition-all leading-relaxed"
            placeholder="Ask what this trend means..."
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            onClick={handleSend}
            disabled={!prompt.trim()}
            className="self-end flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2 11 13M22 2 15 22 11 13 2 9l20-7z" />
            </svg>
            Send
          </button>
        </div>
      </div>

      {/* AI History */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
          Session Log
        </div>
        {messages.length === 0 ? (
          <div className="text-xs text-zinc-600 text-center py-4">
            Ask a question to start your session log
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className="rounded-lg bg-zinc-800/50 border border-zinc-700/30 p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-xs font-semibold text-violet-400 shrink-0">You</span>
                  <span className="text-xs text-zinc-300">{msg.prompt}</span>
                </div>
                <div className="flex items-start gap-2 pt-1 border-t border-zinc-700/30">
                  <span className="text-xs font-semibold text-cyan-400 shrink-0">AI</span>
                  <span className="text-xs text-zinc-400 leading-relaxed">{msg.response}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
