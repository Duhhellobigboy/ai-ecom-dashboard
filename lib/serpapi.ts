import { getJson } from "serpapi";
import type { TrendsResponse } from "@/types/trends";

export async function fetchTrends(terms: string[]): Promise<TrendsResponse> {
  const q = terms.join(",");
  const apiKey = process.env.SERP_API_KEY;

  if (!apiKey) throw new Error("SERP_API_KEY is not set in environment.");

  const baseParams = {
    engine: "google_trends",
    q,
    api_key: apiKey,
  };

  const [timeseriesRes, geoRes, topicsRes, queriesRes] = await Promise.all([
    getJson({ ...baseParams, data_type: "TIMESERIES" }),
    getJson({ ...baseParams, data_type: "GEO_MAP" }),
    getJson({ ...baseParams, data_type: "RELATED_TOPICS" }),
    getJson({ ...baseParams, data_type: "RELATED_QUERIES" }),
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
      rising: relatedQueries.rising ?? [],
      top: relatedQueries.top ?? [],
    },
    related_topics: {
      rising: relatedTopics.rising ?? [],
      top: relatedTopics.top ?? [],
    },
  };
}
