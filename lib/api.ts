// Typed client for the Zara FastAPI backend. Client-side fetch (components are "use client").
import type {
  Campaign,
  LeadList,
  CsvValidation,
  BusinessSummary,
  MessageLog,
  RecalculateResult,
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
  // Campaigns
  listCampaigns: (offset = 0, limit = 50) =>
    fetch(`${V1}/campaign/?offset=${offset}&limit=${limit}`).then((r) => toJson<Campaign[]>(r)),

  getCampaign: (id: number) => fetch(`${V1}/campaign/${id}`).then((r) => toJson<Campaign>(r)),

  getCampaignBusinesses: (id: number) =>
    fetch(`${V1}/campaign/${id}/businesses`).then((r) => toJson<BusinessSummary[]>(r)),

  // Phase 2 — start the messaging (Writer + Router + Sender) for a discovered campaign.
  startCampaign: (id: number) =>
    fetch(`${V1}/campaign/${id}/start`, { method: "POST" }).then((r) => toJson<Campaign>(r)),

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
