"use client";

import { useCallback, useEffect, useState } from "react";
import { MetricsInfo } from "@/components/dashboard/MetricsInfo";
import { CampaignControl } from "@/components/dashboard/CampaignControl";
import { TerminalLogs } from "@/components/dashboard/TerminalLogs";
import { LeadsLedgerTable } from "@/components/dashboard/LeadsLedgerTable";
import { CampaignBusinesses } from "@/components/dashboard/CampaignBusinesses";
import { api } from "@/lib/api";
import type { Lead } from "@/lib/types";

function bandToStatus(band: string | null): string {
  if (band === "hot") return "Hot Lead";
  if (band === "warm") return "Warm";
  if (band === "cold") return "Cold";
  return "Scored";
}

export default function HomePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [launchedCampaignId, setLaunchedCampaignId] = useState<number | null>(null);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getLeads();
      setLeads(data.leads);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const tableLeads = leads.map((l) => ({
    name: l.name,
    city: l.city,
    category: l.category,
    status: bandToStatus(l.band),
    score: l.score,
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Zara Workspace Overview</h1>
        <p className="text-sm text-slate-500 mt-1">
          Autonomous cold outreach SDR pipeline powered by CrewAI &amp; Gemini.
        </p>
      </div>

      <MetricsInfo />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-6">
          <CampaignControl
            onLaunched={(id) => {
              setLaunchedCampaignId(id);
              loadLeads();
            }}
          />
          <TerminalLogs />
        </div>

        <div className="lg:col-span-7">
          {launchedCampaignId ? (
            <CampaignBusinesses campaignId={launchedCampaignId} />
          ) : error ? (
            <div className="bg-white border border-red-200 rounded-2xl p-5 text-sm text-red-600">
              Could not reach the API: {error}
              <p className="text-xs text-slate-400 mt-1">
                Is the backend running on {process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}?
              </p>
            </div>
          ) : loading ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 text-sm text-slate-400">
              Loading leads…
            </div>
          ) : tableLeads.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 text-sm text-slate-500">
              No scored leads yet. Upload a CSV and run a campaign, then recalculate scores.
            </div>
          ) : (
            <LeadsLedgerTable leads={tableLeads} />
          )}
        </div>
      </div>
    </div>
  );
}
