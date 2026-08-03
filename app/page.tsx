"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { MetricsInfo } from "@/components/dashboard/MetricsInfo";
import { BusinessTable } from "@/components/businesses/BusinessTable";
import { api } from "@/lib/api";
import { sampleBusinesses } from "@/lib/mockData";
import type { Lead, Campaign } from "@/lib/types";

export default function HomePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const loadLeads = useCallback(async () => {
    try {
      const data = await api.getLeads();
      setLeads(data.leads);
    } catch (e) {
      console.error("Failed to load leads", e);
    }
  }, []);

  const loadCampaigns = useCallback(async () => {
    try {
      const data = await api.listCampaigns();
      setCampaigns(data);
    } catch (e) {
      console.error("Failed to load campaigns", e);
    }
  }, []);

  useEffect(() => {
    loadLeads();
    loadCampaigns();
  }, [loadLeads, loadCampaigns]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header with redirection action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Zara Workspace Overview</h1>
          <p className="text-sm text-slate-500 mt-1">
            Autonomous cold outreach SDR pipeline powered by CrewAI &amp; Gemini.
          </p>
        </div>
        <Link
          href="/presence_analysis"
          className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4.5 py-2.5 rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-600/20 transition-all gap-2 duration-300"
        >
          Start Campaign
        </Link>
      </div>

      {/* Dynamic Key Performance Indicators */}
      <MetricsInfo leads={leads} campaigns={campaigns} />

      {/* Read-Only Lead ledger showing business data */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pl-1">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Lead Registry</h2>
            <p className="text-xs text-slate-500">Read-only sync of target leads log</p>
          </div>
        </div>
        
        <BusinessTable
          businesses={sampleBusinesses}
          selectedBizId={null}
          setSelectedBizId={() => {}}
        />
      </div>
    </div>
  );
}
