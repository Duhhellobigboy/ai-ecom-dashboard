"use client";

import type { RelatedItem } from "@/types/trends";

interface Props {
  data: { rising: RelatedItem[]; top: RelatedItem[] };
  loading: boolean;
}

function Skeleton() {
  return (
    <div className="bg-zinc-900 border border-zinc-800/70 rounded-xl p-5">
      <div className="h-3 w-28 bg-zinc-800 rounded animate-pulse mb-4" />
      <div className="space-y-2.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <div className="h-3 flex-1 bg-zinc-800 rounded animate-pulse" />
            <div className="h-3 w-10 bg-zinc-800 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ItemList({ items, label }: { items: RelatedItem[]; label: string }) {
  if (!items.length) return null;
  return (
    <div>
      <div className="text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">{label}</div>
      <ul className="space-y-1.5">
        {items.slice(0, 6).map((item, i) => {
          const name = item.query ?? item.topic?.title ?? "—";
          const isBreakout = item.value === "Breakout" || String(item.value).toLowerCase() === "breakout";
          return (
            <li key={i} className="flex items-center justify-between gap-3 group">
              <span className="text-sm text-zinc-300 truncate">{name}</span>
              {isBreakout ? (
                <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-900/40 border border-emerald-800/40 text-emerald-400 shrink-0">
                  Breakout
                </span>
              ) : (
                <span className="text-xs font-mono text-violet-400 shrink-0">{item.value}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function RelatedQueriesCard({ data, loading }: Props) {
  if (loading) return <Skeleton />;

  const hasData = data.top.length > 0 || data.rising.length > 0;

  return (
    <div className="bg-zinc-900 border border-zinc-800/70 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-800/60">
        <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Related Queries</h2>
      </div>
      <div className="px-5 py-4 space-y-4">
        {hasData ? (
          <>
            <ItemList items={data.top} label="Top" />
            <ItemList items={data.rising} label="Rising" />
          </>
        ) : (
          <div className="py-4 text-xs text-zinc-500 text-center">No related query data</div>
        )}
      </div>
    </div>
  );
}
