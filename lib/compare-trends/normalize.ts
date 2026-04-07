import type { TimelineDataPoint } from "@/types/trends";
import type { CompareTimelinePoint } from "@/types/compare-trends";

/**
 * Map SerpAPI `interest_over_time.timeline_data` into chart-friendly points.
 * Preserves API order (typically chronological).
 */
export function normalizeInterestOverTimeToTimeline(
  interestOverTime: TimelineDataPoint[],
  keywords: string[],
): CompareTimelinePoint[] {
  if (!interestOverTime.length || !keywords.length) return [];

  const keywordSet = new Set(keywords);

  return interestOverTime.map((point) => {
    const values: Record<string, number> = {};
    for (const k of keywords) {
      values[k] = NaN;
    }
    for (const v of point.values) {
      if (!keywordSet.has(v.query)) continue;
      if (typeof v.extracted_value === "number" && !Number.isNaN(v.extracted_value)) {
        values[v.query] = v.extracted_value;
      }
    }
    return { date: point.date, values };
  });
}
