import { describe, expect, it } from "vitest";
import type { CompareTimelinePoint } from "@/types/compare-trends";
import { computeKeywordMetrics, metricsAmbiguous, pickWinners } from "./metrics";

describe("computeKeywordMetrics & pickWinners", () => {
  it("picks higher average as top performer", () => {
    const timeline: CompareTimelinePoint[] = [
      { date: "d1", values: { a: 10, b: 20 } },
      { date: "d2", values: { a: 10, b: 20 } },
      { date: "d3", values: { a: 10, b: 20 } },
    ];
    const metrics = computeKeywordMetrics(timeline, ["a", "b"]);
    const winners = pickWinners(metrics);
    expect(winners.topPerformer).toBe("b");
  });

  it("detects ambiguous averages", () => {
    const m = computeKeywordMetrics(
      [
        { date: "d1", values: { a: 50, b: 51 } },
        { date: "d2", values: { a: 50, b: 51 } },
      ],
      ["a", "b"],
    );
    expect(metricsAmbiguous(m, (x) => x.average, 0.05)).toBe(true);
  });
});
