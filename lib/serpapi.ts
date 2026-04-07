import { getJson } from "serpapi";
import type { TrendsResponse } from "@/types/trends";

function settled<T>(p: Promise<T>): Promise<T | null> {
  return p.catch((err) => {
    console.error("[serpapi] secondary call failed:", err?.message ?? err);
    return null;
  });
}

export async function fetchTrends(terms: string[]): Promise<TrendsResponse> {
  const q = terms.join(",");
  const apiKey = process.env.SERP_API_KEY;

  if (!apiKey) throw new Error("SERP_API_KEY is not set in environment.");

  const baseParams = {
    engine: "google_trends",
    q,
    api_key: apiKey,
  };

  // GEO_MAP requires at least 2 terms; skip it for single-term queries.
  const geoDataType = terms.length > 1 ? "GEO_MAP" : "GEO_MAP_0";

  console.log("[serpapi] TIMESERIES params:", { ...baseParams, data_type: "TIMESERIES" });
  console.log("[serpapi] GEO params:", { ...baseParams, data_type: geoDataType });
  console.log("[serpapi] RELATED_TOPICS params:", { ...baseParams, data_type: "RELATED_TOPICS" });
  console.log("[serpapi] RELATED_QUERIES params:", { ...baseParams, data_type: "RELATED_QUERIES" });

  // TIMESERIES is required — let it throw if it fails.
  // All secondary calls are optional; failures return null instead of crashing.
  const [timeseriesRes, geoRes, topicsRes, queriesRes] = await Promise.all([
    getJson({ ...baseParams, data_type: "TIMESERIES" }),
    settled(getJson({ ...baseParams, data_type: geoDataType })),
    settled(getJson({ ...baseParams, data_type: "RELATED_TOPICS" })),
    settled(getJson({ ...baseParams, data_type: "RELATED_QUERIES" })),
  ]);

  // timeline_data lives inside interest_over_time
  const timelineData = timeseriesRes?.interest_over_time?.timeline_data ?? [];

  // Single-term → interest_by_region; multi-term → compared_breakdown_by_region
  const regionData =
    geoRes?.interest_by_region ?? geoRes?.compared_breakdown_by_region ?? [];

  const relatedQueries = queriesRes?.related_queries ?? {};
  const relatedTopics = topicsRes?.related_topics ?? {};

  return {
    terms,
    interest_over_time: timelineData,
    interest_by_region: regionData,
    related_queries: {
      rising: relatedQueries?.rising ?? [],
      top: relatedQueries?.top ?? [],
    },
    related_topics: {
      rising: relatedTopics?.rising ?? [],
      top: relatedTopics?.top ?? [],
    },
  };
}
