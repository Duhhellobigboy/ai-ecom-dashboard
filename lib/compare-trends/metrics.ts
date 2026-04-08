import type { CompareTimelinePoint, CompareWinners, KeywordMetrics } from "@/types/compare-trends";

function mean(nums: number[]): number {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function standardDeviation(nums: number[]): number {
  if (nums.length < 2) return 0;
  const m = mean(nums);
  const variance = nums.reduce((acc, x) => acc + (x - m) * (x - m), 0) / nums.length;
  return Math.sqrt(variance);
}

function finiteSeries(values: Record<string, number>[], key: string): number[] {
  const out: number[] = [];
  for (const row of values) {
    const v = row[key];
    if (typeof v === "number" && Number.isFinite(v)) out.push(v);
  }
  return out;
}

function countSignificantLocalMaxima(series: number[]): number {
  if (series.length < 3) return 0;
  const m = mean(series);
  const sd = standardDeviation(series);
  const threshold = m + Math.max(2, sd * 0.35);
  let peaks = 0;
  for (let i = 1; i < series.length - 1; i++) {
    if (series[i] > series[i - 1] && series[i] > series[i + 1] && series[i] >= threshold) {
      peaks++;
    }
  }
  return peaks;
}

function linearSlopeLastWindow(series: number[], window: number): number {
  if (series.length < 2) return 0;
  const w = Math.min(window, series.length);
  const slice = series.slice(-w);
  const n = slice.length;
  if (n < 2) return 0;
  const xMean = (n - 1) / 2;
  let yMean = 0;
  for (const y of slice) yMean += y;
  yMean /= n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    const xd = i - xMean;
    num += xd * (slice[i] - yMean);
    den += xd * xd;
  }
  if (den === 0) return 0;
  return num / den;
}

export function buildTimelineValueRows(timeline: CompareTimelinePoint[]): Record<string, number>[] {
  return timeline.map((t) => t.values);
}

export function computeKeywordMetrics(
  timeline: CompareTimelinePoint[],
  keywords: string[],
): KeywordMetrics[] {
  const rows = buildTimelineValueRows(timeline);
  return keywords.map((keyword) => {
    const series = finiteSeries(rows, keyword);
    const avg = mean(series);
    const vol = standardDeviation(series);
    const peak = series.length ? Math.max(...series) : 0;
    const trough = series.length ? Math.min(...series) : 0;
    const peakCount = countSignificantLocalMaxima(series);
    const w = Math.max(4, Math.min(12, Math.ceil(series.length / 4) || 4));
    const slope = linearSlopeLastWindow(series, w);
    const momentum = avg > 1e-6 ? (slope / avg) * 100 : slope;

    const expectedRandomPeaks = Math.max(1, Math.floor(series.length / 8));
    const seasonalityScore = Math.min(
      100,
      (peakCount / expectedRandomPeaks) * 35 + Math.min(65, (vol / (avg + 5)) * 40),
    );

    return {
      keyword,
      average: avg,
      momentum,
      volatility: vol,
      seasonalityScore,
      peak,
      trough,
      peakCount,
    };
  });
}

function argmaxBy<T>(items: T[], score: (t: T) => number): T | null {
  if (!items.length) return null;
  let best = items[0];
  let bestScore = score(best);
  for (let i = 1; i < items.length; i++) {
    const s = score(items[i]);
    if (s > bestScore) {
      best = items[i];
      bestScore = s;
    }
  }
  return best;
}

function argminBy<T>(items: T[], score: (t: T) => number): T | null {
  if (!items.length) return null;
  let best = items[0];
  let bestScore = score(best);
  for (let i = 1; i < items.length; i++) {
    const s = score(items[i]);
    if (s < bestScore) {
      best = items[i];
      bestScore = s;
    }
  }
  return best;
}

export function pickWinners(metrics: KeywordMetrics[]): CompareWinners {
  if (!metrics.length) {
    return {
      topPerformer: null,
      mostStable: null,
      mostSeasonal: null,
      mostPromising: null,
      peakLeader: null,
    };
  }

  const topPerformer = argmaxBy(metrics, (m) => m.average)?.keyword ?? null;
  const mostStable = argminBy(metrics, (m) => m.volatility)?.keyword ?? null;
  const mostSeasonal = argmaxBy(metrics, (m) => m.seasonalityScore)?.keyword ?? null;
  const mostPromising = argmaxBy(metrics, (m) => m.momentum)?.keyword ?? null;
  const peakLeader = argmaxBy(metrics, (m) => m.peak)?.keyword ?? null;

  return { topPerformer, mostStable, mostSeasonal, mostPromising, peakLeader };
}

/** True when two top scores are within relativeTolerance (e.g. 0.08 = 8%). */
export function metricsAmbiguous(
  metrics: KeywordMetrics[],
  getter: (m: KeywordMetrics) => number,
  relativeTolerance = 0.08,
): boolean {
  if (metrics.length < 2) return false;
  const nums = metrics.map(getter).filter((n) => Number.isFinite(n));
  if (nums.length < 2) return true;
  const sorted = [...nums].sort((a, b) => b - a);
  const a = sorted[0];
  const b = sorted[1];
  if (a === 0) return Math.abs(b - a) < 1e-6;
  return Math.abs(a - b) / Math.abs(a) < relativeTolerance;
}
