export interface TimelineValue {
  query: string;
  value: string;
  extracted_value: number;
}

export interface TimelineDataPoint {
  date: string;
  timestamp: string;
  values: TimelineValue[];
}

export interface RegionValue {
  query: string;
  value: string;
  extracted_value: number;
}

export interface RegionDataPoint {
  location: string;
  max_value_index?: number;
  // single term
  value?: string;
  extracted_value?: number;
  // multi term
  values?: RegionValue[];
}

export interface RelatedItem {
  query?: string;
  topic?: { title: string; type: string };
  value: string;
  extracted_value: number;
  link?: string;
}

export interface TrendsResponse {
  terms: string[];
  interest_over_time: TimelineDataPoint[];
  interest_by_region: RegionDataPoint[];
  related_queries: {
    rising: RelatedItem[];
    top: RelatedItem[];
  };
  related_topics: {
    rising: RelatedItem[];
    top: RelatedItem[];
  };
}

export interface HistoryEntry {
  id: string;
  terms: string[];
  timestamp: string;
  file_path: string;
}
