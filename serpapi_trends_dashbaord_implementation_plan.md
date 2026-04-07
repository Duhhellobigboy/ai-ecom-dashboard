# SerpAPI Trends Dashboard – Implementation Plan

## Overview
Build a local dashboard using Next.js + React + TypeScript to visualize Google Trends data via SerpAPI.

---

## Tech Stack
- Next.js (App Router)
- React
- TypeScript
- TailwindCSS (dark/light + neon UI)
- Recharts (charts)
- Node.js API routes (server-side SerpAPI calls)
- Local file storage (CSV + JSON)

---

## Features (V1)

### 1. Search
- Input: product keyword(s)
- Support multi-term comparison (max 5 terms)

### 2. Trends Chart
- Interest over time
- Multi-line comparison

### 3. Related Data
- Related queries (top + rising)
- Related topics

### 4. Region Insights
- Interest by region table

### 5. Save Results
- Save search results to:
  - CSV file
  - local JSON history

### 6. Load Previous Searches
- Sidebar or dropdown
- Reload previous queries

---

## Folder Structure

/app
  /api/trends/route.ts
  /page.tsx

/components
  SearchBar.tsx
  TrendChart.tsx
  RegionTable.tsx
  RelatedQueries.tsx
  HistoryPanel.tsx

/lib
  serpapi.ts
  csv.ts
  storage.ts

/data
  history.json
  exports/

---

## API Route (Server Only)

- Endpoint: `/api/trends`
- Calls SerpAPI with `.env` key
- Returns:
  - interest_over_time
  - interest_by_region
  - related_queries
  - related_topics

---

## Environment Variables (.env)

SERP_API_KEY=your_key
SUPABASE_URL=...
SUPABASE_ANON_KEY=...

---

## CSV Saving Logic

- Convert JSON → CSV
- Save to `/data/exports/{keyword}.csv`

---

## History System

- Store:
  - keyword
  - timestamp
  - file path

File:
`/data/history.json`

---

## UI/UX Plan

### Theme
- Dark mode default
- Neon accents (blue/purple glow)

### Layout
- Top: Search bar
- Middle: Chart
- Bottom: Data panels
- Side: History

---

## Future Features

- Trend momentum score
- Alerts (rising trends)
- Product opportunity score
- Export charts as images
- Supabase storage (cloud)

---

## Security

- Never expose API keys in frontend
- Use server-side API routes only

---

## Run Locally

npm install
npm run dev

---

## Goal

Turn trend data into actionable product insights.
