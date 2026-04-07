import { describe, expect, it } from "vitest";
import type { TimelineDataPoint } from "@/types/trends";
import { normalizeInterestOverTimeToTimeline } from "./normalize";

describe("normalizeInterestOverTimeToTimeline", () => {
  it("maps multi-keyword rows and preserves order", () => {
    const interest: TimelineDataPoint[] = [
      {
        date: "Jan 2024",
        timestamp: "",
        values: [
          { query: "a", value: "1", extracted_value: 10 },
          { query: "b", value: "2", extracted_value: 20 },
        ],
      },
      {
        date: "Feb 2024",
        timestamp: "",
        values: [
          { query: "a", value: "3", extracted_value: 30 },
          { query: "b", value: "4", extracted_value: 40 },
        ],
      },
    ];

    const keywords = ["a", "b"];
    const timeline = normalizeInterestOverTimeToTimeline(interest, keywords);

    expect(timeline).toHaveLength(2);
    expect(timeline[0].values.a).toBe(10);
    expect(timeline[0].values.b).toBe(20);
    expect(timeline[1].date).toBe("Feb 2024");
  });

  it("fills NaN for missing series values", () => {
    const interest: TimelineDataPoint[] = [
      {
        date: "Mar 2024",
        timestamp: "",
        values: [{ query: "a", value: "1", extracted_value: 5 }],
      },
    ];
    const timeline = normalizeInterestOverTimeToTimeline(interest, ["a", "b"]);
    expect(timeline[0].values.a).toBe(5);
    expect(Number.isNaN(timeline[0].values.b)).toBe(true);
  });
});
