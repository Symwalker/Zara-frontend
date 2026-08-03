"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Phone, CheckCircle2, Send } from "lucide-react";
import { api } from "@/lib/api";
import { StartCampaignDialog } from "@/components/dashboard/StartCampaignDialog";
import { WebsiteFilter, type WebsiteBucket } from "@/components/dashboard/WebsiteFilter";
import type { BusinessSummary, Campaign } from "@/lib/types";

// Statuses during which the crew is actively working (keep polling).
const ACTIVE = new Set(["discovering", "messaging"]);

function websitePill(status: string) {
  const map: Record<string, string> = {
    no_website: "bg-emerald-50 text-emerald-700 border-emerald-200",
    has_website: "bg-slate-100 text-slate-500 border-slate-200",
    lookup_failed: "bg-red-50 text-red-600 border-red-200",
    no_contact_found: "bg-amber-50 text-amber-700 border-amber-200",
    pending: "bg-slate-50 text-slate-400 border-slate-200",
  };
  return map[status] ?? "bg-slate-50 text-slate-500 border-slate-200";
}

export function CampaignBusinesses({ campaignId }: { campaignId: number }) {
  const [businesses, setBusinesses] = useState<BusinessSummary[]>([]);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [websiteFilter, setWebsiteFilter] = useState<WebsiteBucket>("all");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const poll = useCallback(async () => {
    try {
      const [biz, camp] = await Promise.all([
        api.getCampaignBusinesses(campaignId),
        api.getCampaign(campaignId),
      ]);
      setBusinesses(biz);
      setCampaign(camp);
      setError(null);
      if (ACTIVE.has(camp.status)) {
        timerRef.current = setTimeout(poll, 3000);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load businesses");
      timerRef.current = setTimeout(poll, 5000);
    }
  }, [campaignId]);

  useEffect(() => {
    poll();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [poll]);

  async function confirmStart(scope: "no_website" | "all") {
    setStarting(true);
    try {
      await api.startCampaign(campaignId, scope);
      setStartOpen(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      poll(); // resume polling through the messaging phase
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start campaign");
    } finally {
      setStarting(false);
    }
  }

  const status = campaign?.status ?? "pending";
  const discovering = status === "discovering" || status === "pending";
  const discovered = status === "discovered";
  const messaging = status === "messaging";
  const completed = status === "completed";
  const withPhone = businesses.filter((b) => b.phone).length;

  const visibleBusinesses =
    websiteFilter === "all" ? businesses : businesses.filter((b) => b.website_status === websiteFilter);
  const websiteCounts = {
    all: businesses.length,
    no_website: businesses.filter((b) => b.website_status === "no_website").length,
    has_website: businesses.filter((b) => b.website_status === "has_website").length,
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            Campaign #{campaignId} — Businesses
            {(discovering || messaging) && <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />}
            {completed && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {discovering && "Discovering contacts (Checker)…"}
            {discovered && "Contacts discovered. Ready to start outreach."}
            {messaging && "Generating & logging messages (Writer → Sender)…"}
            {completed && "Campaign complete."}
            {campaign && (
              <>
                {" · "}
                {campaign.processed_count}/{campaign.total_businesses} processed ·{" "}
                <span className="font-semibold text-emerald-600">{withPhone}</span> with contact
              </>
            )}
          </p>
        </div>

        {discovered && (
          <button
            onClick={() => setStartOpen(true)}
            disabled={starting}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-60 text-white font-semibold px-4 py-2 rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-2 text-sm transition-all"
          >
            {starting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Starting…
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Start Campaign
              </>
            )}
          </button>
        )}
      </div>

      <StartCampaignDialog
        open={startOpen}
        title={campaign?.name}
        busy={starting}
        onClose={() => setStartOpen(false)}
        onConfirm={confirmStart}
      />

      {/* Filter rows by website status */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-xs font-semibold text-slate-500">Filter:</span>
        <WebsiteFilter value={websiteFilter} onChange={setWebsiteFilter} counts={websiteCounts} />
      </div>

      {error && <p className="text-xs text-red-600">API error: {error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="p-3">Business Name</th>
              <th className="p-3">City</th>
              <th className="p-3">Category</th>
              <th className="p-3">Website</th>
              <th className="p-3">Contact (Phone)</th>
              <th className="p-3">Channel</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {visibleBusinesses.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3 font-semibold text-slate-900">{b.name}</td>
                <td className="p-3 text-slate-500">{b.city}</td>
                <td className="p-3 text-slate-500">{b.category}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full border text-[11px] ${websitePill(b.website_status)}`}>
                    {b.website_status}
                  </span>
                </td>
                <td className="p-3">
                  {b.phone ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                      <Phone className="w-3 h-3" /> {b.phone}
                    </span>
                  ) : discovering ? (
                    <span className="text-slate-400">checking…</span>
                  ) : (
                    <span className="text-red-500 font-semibold">missing</span>
                  )}
                </td>
                <td className="p-3 text-slate-500">{b.channel_decision}</td>
              </tr>
            ))}
            {visibleBusinesses.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-400">
                  {discovering
                    ? "Importing & discovering contacts…"
                    : businesses.length === 0
                      ? "No businesses."
                      : "No businesses match this filter."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
