"use client";

import type { RegionDataPoint } from "@/types/trends";

interface Props {
  terms: string[];
  data: RegionDataPoint[];
}

export default function RegionTable({ terms, data }: Props) {
  if (!data.length) return null;

  const isMulti = terms.length > 1;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-4">
        Interest by Region
      </h2>
      <div className="overflow-auto max-h-72">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-zinc-500 border-b border-zinc-800">
              <th className="pb-2 pr-6">Region</th>
              {isMulti
                ? terms.map((t) => (
                    <th key={t} className="pb-2 pr-4">
                      {t}
                    </th>
                  ))
                : <th className="pb-2">Value</th>}
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 25).map((row) => (
              <tr
                key={row.location}
                className="border-b border-zinc-800/50 hover:bg-zinc-800/40 transition"
              >
                <td className="py-2 pr-6 text-zinc-300">{row.location}</td>
                {isMulti
                  ? terms.map((term) => {
                      const match = row.values?.find((v) => v.query === term);
                      return (
                        <td key={term} className="py-2 pr-4 text-violet-400 font-mono">
                          {match?.extracted_value ?? "—"}
                        </td>
                      );
                    })
                  : (
                    <td className="py-2 text-violet-400 font-mono">
                      {row.extracted_value ?? "—"}
                    </td>
                  )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
