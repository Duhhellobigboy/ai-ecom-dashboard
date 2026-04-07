import type { CompareSummary, CompareWinners, KeywordMetrics } from "@/types/compare-trends";
import { metricsAmbiguous } from "./metrics";

function fmt(v: number, digits = 1): string {
  if (!Number.isFinite(v)) return "—";
  return v.toFixed(digits);
}

export function buildCompareSummary(
  metrics: KeywordMetrics[],
  winners: CompareWinners,
  timelineLength: number,
): CompareSummary {
  const lowData = timelineLength < 4;
  const allTightAverages = metricsAmbiguous(
    metrics,
    (m) => m.average,
    0.05,
  );
  const allTightMomentum = metricsAmbiguous(metrics, (m) => m.momentum, 0.15);

  let confidence: CompareSummary["confidence"] = "high";
  if (lowData || metrics.length < 2) confidence = "low";
  else if (allTightAverages || allTightMomentum) confidence = "medium";

  const byKeyword = Object.fromEntries(metrics.map((m) => [m.keyword, m])) as Record<
    string,
    KeywordMetrics
  >;

  const overallWinner = winners.topPerformer;
  const stabilityWinner = winners.mostStable;
  const seasonalWinner = winners.mostSeasonal;
  const promisingWinner = winners.mostPromising;

  const overallWinnerStr = overallWinner
    ? allTightAverages && confidence !== "high"
      ? `Average interest is similar across keywords; no clear overall leader. Slight edge: ${overallWinner} (avg ${fmt(byKeyword[overallWinner]?.average ?? 0)}).`
      : `${overallWinner} shows the strongest average interest (${fmt(byKeyword[overallWinner]?.average ?? 0)}) — use this as your baseline “demand strength” signal.`
    : "Not enough data to name an overall leader.";

  const stabilityStr = stabilityWinner
    ? metricsAmbiguous(metrics, (m) => m.volatility, 0.12)
      ? `Volatility is comparable across keywords; treat stability differences as directional only. Lowest variance cluster includes ${stabilityWinner}.`
      : `${stabilityWinner} is the most stable series (lower swings) — better for predictable planning vs. spiky demand.`
    : "Stability comparison needs more timeline points.";

  const seasonalityStr = seasonalWinner
    ? `${seasonalWinner} shows the most pronounced peaks and swings — likely the most seasonal; plan inventory/marketing around those cycles.`
    : "Seasonality signal is weak or unclear from this window.";

  const opportunityStr = promisingWinner
    ? allTightMomentum
      ? `Recent momentum is similar; no stand-out “breakout” keyword. Watch the next few intervals for separation.`
      : `${promisingWinner} has the strongest recent momentum vs. its own history — an early signal of renewed interest (not a guarantee).`
    : "Momentum comparison unavailable.";

  let cautionStr =
    "Trends are relative (0–100), not absolute volume. Combine with sales/marketing data before committing.";
  if (lowData) {
    cautionStr =
      "Very few data points in this range — summaries are tentative; try a longer window or different region.";
  }
  if (confidence === "medium") {
    cautionStr +=
      " Scores are close together; avoid overconfidence in a single winner.";
  }

  const bullets: string[] = [];
  if (overallWinner && !allTightAverages) {
    bullets.push(`Strongest average demand: ${overallWinner}.`);
  } else if (overallWinner) {
    bullets.push(`Average demand is neck-and-neck; ${overallWinner} is slightly ahead.`);
  }
  if (stabilityWinner) {
    bullets.push(`Most stable: ${stabilityWinner} (smoother ride, less variance).`);
  }
  if (seasonalWinner) {
    bullets.push(`Most seasonal / peak-driven: ${seasonalWinner}.`);
  }
  if (promisingWinner && !allTightMomentum) {
    bullets.push(`Most promising lately: ${promisingWinner} (best recent momentum).`);
  }
  if (!bullets.length) {
    bullets.push("Run a compare with 2–5 keywords to generate insights.");
  }
  if (lowData) {
    bullets.push("Low resolution window — prefer 12 months or 5 years for clearer patterns.");
  }

  return {
    bullets,
    sections: {
      overallWinner: overallWinnerStr,
      stability: stabilityStr,
      seasonality: seasonalityStr,
      opportunity: opportunityStr,
      caution: cautionStr,
    },
    confidence,
  };
}
