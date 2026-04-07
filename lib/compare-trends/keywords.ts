const MIN_KEYWORDS = 2;
const MAX_KEYWORDS = 5;
const MAX_LENGTH = 100;

function sanitizeOne(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

/** Normalize, dedupe case-insensitively, cap count. Returns error message if invalid. */
export function normalizeCompareKeywords(raw: string[]): {
  keywords: string[];
  error?: string;
} {
  const seen = new Set<string>();
  const out: string[] = [];

  for (const item of raw) {
    const s = sanitizeOne(String(item));
    if (!s) continue;

    if (s.length > MAX_LENGTH) {
      return {
        keywords: [],
        error: `Each keyword must be at most ${MAX_LENGTH} characters.`,
      };
    }

    const key = s.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
    if (out.length >= MAX_KEYWORDS) break;
  }

  if (out.length < MIN_KEYWORDS) {
    return {
      keywords: out,
      error: `Enter at least ${MIN_KEYWORDS} unique keywords (max ${MAX_KEYWORDS}).`,
    };
  }

  return { keywords: out };
}

export const compareKeywordLimits = {
  min: MIN_KEYWORDS,
  max: MAX_KEYWORDS,
  maxLength: MAX_LENGTH,
};
