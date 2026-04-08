import fs from "fs";
import path from "path";
import type { TrendsResponse } from "@/types/trends";
import { isLocalFilePersistenceEnabled } from "@/lib/env";

export function saveTrendsToCSV(data: TrendsResponse): string | null {
  if (!isLocalFilePersistenceEnabled()) {
    return null;
  }

  const exportsDir = path.join(process.cwd(), "data", "exports");
  if (!fs.existsSync(exportsDir)) fs.mkdirSync(exportsDir, { recursive: true });

  const slug = data.terms
    .join("_")
    .replace(/[^a-zA-Z0-9_]/g, "")
    .toLowerCase();
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `${slug}_${timestamp}.csv`;
  const filePath = path.join(exportsDir, fileName);

  const rows: string[] = [];

  // Header row
  rows.push(["date", ...data.terms].join(","));

  // One row per timeline data point
  for (const point of data.interest_over_time) {
    const values = data.terms.map((term) => {
      const match = point.values.find((v) => v.query === term);
      return match?.extracted_value ?? 0;
    });
    rows.push([`"${point.date}"`, ...values].join(","));
  }

  fs.writeFileSync(filePath, rows.join("\n"));

  return path.join("data", "exports", fileName);
}
