import { describe, expect, it } from "vitest";
import { normalizeCompareKeywords } from "./keywords";

describe("normalizeCompareKeywords", () => {
  it("requires at least 2 unique keywords", () => {
    expect(normalizeCompareKeywords(["one"]).error).toBeDefined();
    expect(normalizeCompareKeywords(["one", "two"]).keywords).toEqual(["one", "two"]);
  });

  it("dedupes case-insensitively and trims", () => {
    expect(normalizeCompareKeywords([" Matcha ", "matcha", "Tea"]).keywords).toEqual(["Matcha", "Tea"]);
  });

  it("caps at 5 keywords", () => {
    const k = normalizeCompareKeywords(["a", "b", "c", "d", "e", "f"]).keywords;
    expect(k).toHaveLength(5);
  });
});
