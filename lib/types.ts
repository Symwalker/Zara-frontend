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
  website_url: string | null;
  phone: string | null;
  phone_source: string | null;
  email: string | null;
  whatsapp_available: boolean | null;
  email_valid: boolean | null;
  channel_decision: string;
  opted_out: boolean;
  // Apify online-presence snapshot (extracted by the Checker)
  rating: number | null;
  reviews_count: number | null;
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  google_maps_url: string | null;
  online_presence_score: number | null;
  recommendation: string | null;
  created_at: string | null;
}

// Nested children of the full business detail (mirrors app/schemas/business_schema.py).
export interface MessageVariationOut {
  id: number;
  variation_number: number;
  message_text: string;
  subject: string | null;
}
export interface MessageOut {
  id: number;
  channel: string;
  is_followup: boolean;
  variation_id: number | null;
  sent_at: string | null;
  delivery_status: string;
  delivered_at: string | null;
  read_at: string | null;
}
export interface ReplyOut {
  id: number;
  channel: string;
  reply_text: string;
  intent: string;
  received_at: string;
}
export interface LeadScoreOut {
  score: number;
  band: string | null;
  score_breakdown: Record<string, number> | null;
  updated_at: string | null;
}

// GET /api/v1/business/{id} — the complete per-business detail.
export interface BusinessDetailFull {
  id: number;
  name: string;
  city: string;
  category: string;
  dedupe_key: string;
  website_status: string;
  website_url: string | null;
  phone: string | null;
  phone_source: string | null;
  email: string | null;
  email_source: string | null;
  whatsapp_available: boolean | null;
  email_valid: boolean | null;
  channel_decision: string;
  opted_out: boolean;
  opted_out_at: string | null;
  created_at: string;
  updated_at: string | null;
  rating: number | null;
  reviews_count: number | null;
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  google_maps_url: string | null;
  online_presence_score: number | null;
  recommendation: string | null;
  variations: MessageVariationOut[];
  messages: MessageOut[];
  replies: ReplyOut[];
  lead_score: LeadScoreOut | null;
}

// ---- Bulk import (discovery-only "job" cards) — mirrors app/schemas/import_schema.py ----

export interface BulkImportResult {
  job_id: string;
  status: string;
  total_rows: number;
  valid_rows: number;
  invalid_rows: CsvRowError[];
  duplicate_rows: CsvDuplicateRow[];
}

export interface BulkImportCard {
  id: number;
  filename: string;
  status: string; // pending | running | done | failed
  total: number;
  processed: number;
  checked: number;
  phones_found: number;
  created: number;
  skipped: number;
  failed_count: number;
  error: string | null;
  campaign_id: number | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string | null;
}

export interface BulkImportDetail extends BulkImportCard {
  businesses: BusinessSummary[];
}

export interface StartCampaignResult {
  import_id: number;
  campaign_id: number | null;
  status: string;
  message: string;
}

// Unified card for the "All Campaigns/CSVs" grid: a discovery job or a full campaign.
export type JobCard =
  | ({ kind: "import" } & BulkImportCard)
  | ({ kind: "campaign" } & Campaign);

// Home-page KPI aggregates (GET /api/v1/stats) — mirrors app/schemas/stats_schema.py.
export interface DashboardStats {
  leads_processed: number;
  businesses_total: number;
  campaigns_launched: number;
  campaigns_active: number;
  campaigns_completed: number;
  outreached_businesses: number;
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
