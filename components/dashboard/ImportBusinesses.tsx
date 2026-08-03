"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Phone, CheckCircle2, Send, Globe2 } from "lucide-react";
import { api } from "@/lib/api";
import { WebsiteFilter, type WebsiteBucket } from "@/components/dashboard/WebsiteFilter";
import type { BulkImportDetail } from "@/lib/types";

// Card statuses during which the Apify Checker is still working (keep polling).
const ACTIVE = new Set(["pending", "running"]);

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

function Stat({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <p className="text-xs font-semibold text-slate-400 uppercase">{label}</p>
      <p className={`text-2xl font-black mt-1 ${tone ?? "text-slate-800"}`}>{value}</p>
    </div>
  );
}

export function ImportBusinesses({ importId }: { importId: number }) {
  const [detail, setDetail] = useState<BulkImportDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [startMsg, setStartMsg] = useState<string | null>(null);
  const [websiteFilter, setWebsiteFilter] = useState<WebsiteBucket>("all");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const poll = useCallback(async () => {
    try {
      const d = await api.getImportCard(importId);
      setDetail(d);
      setError(null);
      if (ACTIVE.has(d.status)) {
        timerRef.current = setTimeout(poll, 3000);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load import");
      timerRef.current = setTimeout(poll, 5000);
    }
  }, [importId]);

  useEffect(() => {
    poll();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [poll]);

  async function handleStart() {
    setStarting(true);
    setStartMsg(null);
    try {
      const res = await api.startImportCampaign(importId);
      setStartMsg(res.message || "Accepted.");
    } catch (e) {
      setStartMsg(e instanceof Error ? e.message : "Failed to start campaign");
    } finally {
      setStarting(false);
    }
  }

  const status = detail?.status ?? "pending";
  const checking = ACTIVE.has(status);
  const done = status === "done";
  const failed = status === "failed";
  const businesses = detail?.businesses ?? [];
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
            <Globe2 className="w-4 h-4 text-indigo-600" /> {detail?.filename ?? `Import #${importId}`}
            {checking && <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />}
            {done && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {checking && "Checking businesses (Apify Checker)…"}
            {done && "Discovery complete."}
            {failed && "Discovery failed."}
            {detail && (
              <>
                {" · "}
                {detail.processed}/{detail.total} processed ·{" "}
                <span className="font-semibold text-emerald-600">{detail.phones_found}</span> with phone
              </>
            )}
          </p>
        </div>

        <button
          onClick={handleStart}
          disabled={!done || starting}
          title={done ? "Start outreach for this list" : "Available once checking is complete"}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-semibold px-4 py-2 rounded-xl flex items-center gap-2 text-sm transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          {starting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Start Campaign
        </button>
      </div>

      {startMsg && (
        <div className="text-xs bg-amber-50 border border-amber-200 text-amber-700 rounded-lg p-3">
          {startMsg}
        </div>
      )}

      {/* Live discovery counters */}
      {detail && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Stat label="Total" value={detail.total} />
          <Stat label="Checked" value={detail.checked} tone="text-indigo-600" />
          <Stat label="Phones Found" value={detail.phones_found} tone="text-emerald-600" />
          <Stat label="Skipped" value={detail.skipped} tone="text-slate-500" />
          <Stat label="Failed" value={detail.failed_count} tone="text-rose-500" />
        </div>
      )}

      {error && <p className="text-xs text-red-600">API error: {error}</p>}

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-xs font-semibold text-slate-500">Filter:</span>
        <WebsiteFilter value={websiteFilter} onChange={setWebsiteFilter} counts={websiteCounts} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="p-3">Business Name</th>
              <th className="p-3">City</th>
              <th className="p-3">Website</th>
              <th className="p-3">Contact (Phone)</th>
              <th className="p-3">Presence Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {visibleBusinesses.map((b) => {
              const stillChecking = b.website_status === "pending";
              return (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-semibold text-slate-900">{b.name}</td>
                  <td className="p-3 text-slate-500">{b.city}</td>
                  <td className="p-3">
                    {stillChecking ? (
                      <span className="inline-flex items-center gap-1 text-slate-400">
                        <Loader2 className="w-3 h-3 animate-spin" /> checking…
                      </span>
                    ) : (
                      <span className={`px-2 py-0.5 rounded-full border text-[11px] ${websitePill(b.website_status)}`}>
                        {b.website_status}
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    {b.phone ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                        <Phone className="w-3 h-3" /> {b.phone}
                      </span>
                    ) : stillChecking ? (
                      <span className="text-slate-400">checking…</span>
                    ) : (
                      <span className="text-red-500 font-semibold">missing</span>
                    )}
                  </td>
                  <td className="p-3">
                    {b.online_presence_score != null ? (
                      <span className="font-semibold text-slate-700">
                        {b.online_presence_score}
                        {b.recommendation ? (
                          <span className="text-slate-400 font-normal"> · {b.recommendation}</span>
                        ) : null}
                      </span>
                    ) : stillChecking ? (
                      <span className="text-slate-400">—</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {visibleBusinesses.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-400">
                  {checking
                    ? "Importing & checking businesses…"
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
