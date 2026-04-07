"use client";

import type { RelatedItem } from "@/types/trends";

interface ItemListProps {
  items: RelatedItem[];
  label: string;
}

function ItemList({ items, label }: ItemListProps) {
  if (!items.length) return null;
  return (
    <div>
      <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
        {label}
      </h3>
      <ul className="space-y-1">
        {items.slice(0, 8).map((item, i) => {
          const name = item.query ?? item.topic?.title ?? "—";
          return (
            <li key={i} className="flex justify-between text-sm">
              <span className="text-zinc-300">{name}</span>
              <span className="text-violet-400 font-mono ml-4 shrink-0">{item.value}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

interface Props {
  relatedQueries: { rising: RelatedItem[]; top: RelatedItem[] };
  relatedTopics: { rising: RelatedItem[]; top: RelatedItem[] };
}

export default function RelatedQueries({ relatedQueries, relatedTopics }: Props) {
  const hasQueries = relatedQueries.top.length > 0 || relatedQueries.rising.length > 0;
  const hasTopics = relatedTopics.top.length > 0 || relatedTopics.rising.length > 0;

  if (!hasQueries && !hasTopics) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {hasQueries && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">
            Related Queries
          </h2>
          <ItemList items={relatedQueries.top} label="Top" />
          <ItemList items={relatedQueries.rising} label="Rising" />
        </div>
      )}
      {hasTopics && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">
            Related Topics
          </h2>
          <ItemList items={relatedTopics.top} label="Top" />
          <ItemList items={relatedTopics.rising} label="Rising" />
        </div>
      )}
    </div>
  );
}
