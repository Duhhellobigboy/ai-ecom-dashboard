export interface CompareTimelinePoint {
  date: string;
  values: Record<string, number>;
}

export interface CompareTrendsMeta {
  source: "serpapi_google_trends";
  fetchedAt: string;
  timeRange: string;
  geo?: string;
  category?: string;
}

/** Response from `/api/compare-trends` — normalized for charts + metrics. */
export interface CompareTrendsResponse {
  timeline: CompareTimelinePoint[];
  keywords: string[];
  meta: CompareTrendsMeta;
}

export interface KeywordMetrics {
  keyword: string;
  average: number;
  momentum: number;
  volatility: number;
  seasonalityScore: number;
  peak: number;
  trough: number;
  /** Raw count of local maxima above a noise threshold */
  peakCount: number;
}

export interface CompareWinners {
  topPerformer: string | null;
  mostStable: string | null;
  mostSeasonal: string | null;
  mostPromising: string | null;
  peakLeader: string | null;
}

export interface CompareSummary {
  bullets: string[];
  sections: {
    overallWinner: string;
    stability: string;
    seasonality: string;
    opportunity: string;
    caution: string;
  };
  confidence: "high" | "medium" | "low";
}
