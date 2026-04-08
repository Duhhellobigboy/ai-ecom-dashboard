import { describe, expect, it } from "vitest";
import type { CompareWinners, KeywordMetrics } from "@/types/compare-trends";
import { buildCompareSummary } from "./summary";

describe("buildCompareSummary", () => {
  it("returns low confidence for short timelines", () => {
    const metrics: KeywordMetrics[] = [
      {
        keyword: "a",
        average: 10,
        momentum: 1,
        volatility: 2,
        seasonalityScore: 20,
        peak: 15,
        trough: 5,
        peakCount: 0,
      },
      {
        keyword: "b",
        average: 20,
        momentum: 0,
        volatility: 3,
        seasonalityScore: 10,
        peak: 25,
        trough: 10,
        peakCount: 0,
      },
    ];
    const winners: CompareWinners = {
      topPerformer: "b",
      mostStable: "a",
      mostSeasonal: "a",
      mostPromising: "a",
      peakLeader: "b",
    };

    const summary = buildCompareSummary(metrics, winners, 3);
    expect(summary.confidence).toBe("low");
    expect(summary.bullets.some((b) => b.includes("Low resolution"))).toBe(true);
  });
});
