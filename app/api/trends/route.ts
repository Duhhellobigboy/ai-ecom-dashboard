import { NextRequest, NextResponse } from "next/server";
import { fetchTrends } from "@/lib/serpapi";
import { saveTrendsToCSV } from "@/lib/csv";
import { saveHistory, readHistory } from "@/lib/storage";
import { randomUUID } from "crypto";

export async function GET() {
  const history = readHistory();
  return NextResponse.json({ history });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const terms: string[] = (body.terms ?? [])
    .map((t: string) => t.trim())
    .filter(Boolean)
    .slice(0, 5);

  if (!terms.length) {
    return NextResponse.json({ error: "Provide at least one search term." }, { status: 400 });
  }

  try {
    const data = await fetchTrends(terms);
    const filePath = saveTrendsToCSV(data);
    if (filePath) {
      saveHistory({
        id: randomUUID(),
        terms,
        timestamp: new Date().toISOString(),
        file_path: filePath,
      });
    }
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "SerpAPI error";
    console.error(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
