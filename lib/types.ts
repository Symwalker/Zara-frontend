// TypeScript mirrors of the Zara backend schemas (app/schemas/*).

export interface Campaign {
  id: number;
  name: string;
  csv_filename: string;
  status: string; // pending | running | completed | failed
  total_businesses: number;
  processed_count: number;
  no_website_count: number;
  contacted_count: number;
  uncontactable_count: number;
  created_at: string;
  updated_at: string | null;
}

export interface Lead {
  business_id: number;
  name: string;
  city: string;
  category: string;
  score: number;
  band: string | null; // cold | warm | hot
  channel_decision: string;
  phone: string | null;
  email: string | null;
}

export interface LeadList {
  band: string | null;
  count: number;
  leads: Lead[];
}

export interface CsvRowError {
  row: number;
  reason: string;
}
export interface CsvDuplicateRow {
  row: number;
  matches_row: number;
}
export interface CsvValidation {
  total_rows: number;
  valid_rows: number;
  invalid_rows: CsvRowError[];
  duplicate_rows: CsvDuplicateRow[];
}

export interface BusinessSummary {
  id: number;
  name: string;
  city: string;
  category: string;
  website_status: string;
  phone: string | null;
  email: string | null;
  channel_decision: string;
  opted_out: boolean;
}

export interface MessageRow {
  id: number;
  business_id: number;
  campaign_id: number;
  variation_id: number | null;
  channel: string;
  is_followup: boolean;
  sent_at: string | null;
  delivery_status: string;
  delivered_at: string | null;
  read_at: string | null;
  created_at: string;
  updated_at: string | null;
}
export interface MessageLog {
  total: number;
  rows: MessageRow[];
  offset: number;
  limit: number;
}

export interface RecalculateResult {
  recalculated_count: number;
  updated_bands: { business_id: number; old_band: string | null; new_band: string | null }[];
}
