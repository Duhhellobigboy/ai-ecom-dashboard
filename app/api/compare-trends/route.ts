import { NextRequest, NextResponse } from "next/server";
import { fetchCompareTimeseries } from "@/lib/serpapi";
import { normalizeCompareKeywords } from "@/lib/compare-trends/keywords";
import { normalizeInterestOverTimeToTimeline } from "@/lib/compare-trends/normalize";

const DEFAULT_TIME_RANGE = "today 12-m";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const rawList = body.keywords ?? body.terms;
  const rawKeywords = Array.isArray(rawList) ? rawList : [];

  const { keywords, error: keywordError } = normalizeCompareKeywords(
    rawKeywords.map((k) => String(k)),
  );
  if (keywordError) {
    return NextResponse.json({ error: keywordError }, { status: 400 });
  }

  const timeRange =
    typeof body.timeRange === "string" && body.timeRange.trim()
      ? body.timeRange.trim()
      : DEFAULT_TIME_RANGE;
  const geo = typeof body.geo === "string" ? body.geo.trim() : "";

  const rawCategory = body.category;
  const category: string | number | undefined =
    rawCategory === undefined || rawCategory === null || rawCategory === ""
      ? undefined
      : typeof rawCategory === "string" || typeof rawCategory === "number"
        ? rawCategory
        : undefined;

  try {
    const interest = await fetchCompareTimeseries(keywords, {
      timeRange,
      geo: geo || undefined,
      category,
    });

    const timeline = normalizeInterestOverTimeToTimeline(interest, keywords);

    if (!interest.length || !timeline.length) {
      return NextResponse.json(
        {
          error:
            "No timeline data returned for this query. Try different keywords, region, or time range.",
        },
        { status: 502 },
      );
    }

    const hasFinite = timeline.some((row) =>
      keywords.some((k) => Number.isFinite(row.values[k])),
    );
    if (!hasFinite) {
      return NextResponse.json(
        {
          error:
            "Timeline has no usable numeric values. Try another region or date range.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      timeline,
      keywords,
      meta: {
        source: "serpapi_google_trends" as const,
        fetchedAt: new Date().toISOString(),
        timeRange,
        ...(geo ? { geo } : {}),
        ...(category !== undefined && category !== null && String(category).trim() !== ""
          ? { category: String(category) }
          : {}),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "SerpAPI error";
    console.error("[compare-trends]", err);
    const lower = message.toLowerCase();
    const status =
      lower.includes("429") || lower.includes("rate") || lower.includes("quota")
        ? 429
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
