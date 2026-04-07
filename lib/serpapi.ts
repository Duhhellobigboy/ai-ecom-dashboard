import { getJson } from "serpapi";
import type { TrendsResponse } from "@/types/trends";
import type { TimelineDataPoint } from "@/types/trends";

export interface CompareTimeseriesOptions {
  /** SerpAPI `date` param, e.g. `today 12-m`, `today 5-y`, `now 7-d` */
  timeRange?: string;
  /** Region code, e.g. `US`, or omit / empty for broad/default */
  geo?: string;
  /** Google Trends category id (string or number) */
  category?: string | number;
}

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

/**
 * Lightweight compare fetch — TIMESERIES only (faster than full `fetchTrends`).
 */
export async function fetchCompareTimeseries(
  keywords: string[],
  options: CompareTimeseriesOptions = {},
): Promise<TimelineDataPoint[]> {
  const apiKey = process.env.SERP_API_KEY;
  if (!apiKey) throw new Error("SERP_API_KEY is not set in environment.");

  const params: Record<string, unknown> = {
    engine: "google_trends",
    q: keywords.join(","),
    data_type: "TIMESERIES",
    api_key: apiKey,
  };

  if (options.timeRange) params.date = options.timeRange;
  if (options.geo !== undefined && options.geo.trim() !== "") {
    params.geo = options.geo.trim();
  }
  if (options.category !== undefined && options.category !== "") {
    params.cat = String(options.category);
  }

  const res = await getJson(params);
  return (res?.interest_over_time?.timeline_data ?? []) as TimelineDataPoint[];
}
