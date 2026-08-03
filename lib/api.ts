// Typed client for the Zara FastAPI backend. Client-side fetch (components are "use client").
import type {
  Campaign,
  LeadList,
  CsvValidation,
  BusinessSummary,
  MessageLog,
  RecalculateResult,
  BulkImportResult,
  BulkImportCard,
  BulkImportDetail,
  StartCampaignResult,
  DashboardStats,
  BusinessDetailFull,
} from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const V1 = `${BASE}/api/v1`;

async function toJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = "";
    try {
      const body = await res.json();
      detail = body?.error?.message ?? body?.detail ?? JSON.stringify(body);
    } catch {
      detail = await res.text();
    }
    throw new Error(`${res.status}: ${detail}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  // Dashboard KPIs (server-side aggregate).
  getStats: () => fetch(`${V1}/stats`).then((r) => toJson<DashboardStats>(r)),

  // All businesses (across every campaign + import), with the full Apify snapshot.
  listBusinesses: (offset = 0, limit = 200, websiteStatus?: string) =>
    fetch(
      `${V1}/business?offset=${offset}&limit=${limit}${websiteStatus ? `&website_status=${encodeURIComponent(websiteStatus)}` : ""}`,
    ).then((r) => toJson<BusinessSummary[]>(r)),

  getBusinessDetail: (id: number) =>
    fetch(`${V1}/business/${id}`).then((r) => toJson<BusinessDetailFull>(r)),

  // Campaigns
  listCampaigns: (offset = 0, limit = 50, date?: string) =>
    fetch(
      `${V1}/campaign/?offset=${offset}&limit=${limit}${date ? `&date=${encodeURIComponent(date)}` : ""}`,
    ).then((r) => toJson<Campaign[]>(r)),

  getCampaign: (id: number) => fetch(`${V1}/campaign/${id}`).then((r) => toJson<Campaign>(r)),

  getCampaignBusinesses: (id: number) =>
    fetch(`${V1}/campaign/${id}/businesses`).then((r) => toJson<BusinessSummary[]>(r)),

  // Bulk import — discovery-only "job" cards (Apify Checker, no outreach).
  importBulk: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return fetch(`${V1}/bulk_import`, { method: "POST", body: fd }).then((r) =>
      toJson<BulkImportResult>(r),
    );
  },

  listImportCards: (offset = 0, limit = 50, date?: string) =>
    fetch(
      `${V1}/bulk_import?offset=${offset}&limit=${limit}${date ? `&date=${encodeURIComponent(date)}` : ""}`,
    ).then((r) => toJson<BulkImportCard[]>(r)),

  getImportCard: (id: number, websiteStatus?: string) =>
    fetch(
      `${V1}/bulk_import/${id}${websiteStatus ? `?website_status=${encodeURIComponent(websiteStatus)}` : ""}`,
    ).then((r) => toJson<BulkImportDetail>(r)),

  // Stub for now — validates the card is 'done' and accepts; real messaging comes later.
  startImportCampaign: (id: number) =>
    fetch(`${V1}/bulk_import/${id}/start`, { method: "POST" }).then((r) =>
      toJson<StartCampaignResult>(r),
    ),

  // Phase 2 — start the messaging (Writer + Router + Sender) for a discovered campaign.
  // scope: "no_website" (default) messages only no-website leads; "all" messages every
  // lead with a discovered phone.
  startCampaign: (id: number, scope: "no_website" | "all" = "no_website") =>
    fetch(`${V1}/campaign/${id}/start?scope=${scope}`, { method: "POST" }).then((r) =>
      toJson<Campaign>(r),
    ),

  validateCsv: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return fetch(`${V1}/campaign/validate`, { method: "POST", body: fd }).then((r) =>
      toJson<CsvValidation>(r),
    );
  },

  createCampaign: (name: string, file: File) => {
    const fd = new FormData();
    fd.append("name", name);
    fd.append("file", file);
    return fetch(`${V1}/campaign/`, { method: "POST", body: fd }).then((r) => toJson<Campaign>(r));
  },

  // Leads
  getLeads: (band?: string) =>
    fetch(`${V1}/lead/${band ? `?band=${encodeURIComponent(band)}` : ""}`).then((r) =>
      toJson<LeadList>(r),
    ),

  recalculateScores: () =>
    fetch(`${V1}/lead/recalculate`, { method: "POST" }).then((r) => toJson<RecalculateResult>(r)),

  // Messages
  getMessages: (params: { campaign_id?: number; business_id?: number } = {}) => {
    const q = new URLSearchParams();
    if (params.campaign_id != null) q.set("campaign_id", String(params.campaign_id));
    if (params.business_id != null) q.set("business_id", String(params.business_id));
    const qs = q.toString();
    return fetch(`${V1}/message/${qs ? `?${qs}` : ""}`).then((r) => toJson<MessageLog>(r));
  },
};
