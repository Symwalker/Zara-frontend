"use client";

import React, { useState } from "react";
import { 
  Flame, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  MessageSquareText, 
  Sparkles,
  ArrowUpRight
} from "lucide-react";

interface HotLead {
  id: number;
  name: string;
  city: string;
  score: number;
  lastReply: string;
  status: "HOT LEAD FOLLOW-UP NEEDED" | "CONTACTED BY HUMAN";
  humanContacted: boolean;
}

const INITIAL_HOT_LEADS: HotLead[] = [
  {
    id: 1,
    name: "Lumina Dynamics",
    city: "San Francisco",
    score: 94,
    lastReply: "Yes, we are looking for automated marketing solutions. Can you send pricing?",
    status: "HOT LEAD FOLLOW-UP NEEDED",
    humanContacted: false
  },
  {
    id: 2,
    name: "Solaris Peak",
    city: "Denver",
    score: 89,
    lastReply: "Sounds interesting, let's schedule a call tomorrow afternoon.",
    status: "HOT LEAD FOLLOW-UP NEEDED",
    humanContacted: false
  },
  {
    id: 3,
    name: "OmniCloud LLC",
    city: "Seattle",
    score: 76,
    lastReply: "Can you elaborate on how your AI agent works with Gmail?",
    status: "HOT LEAD FOLLOW-UP NEEDED",
    humanContacted: false
  }
];

export default function HotLeadsPage() {
  const [leads, setLeads] = useState<HotLead[]>(INITIAL_HOT_LEADS);

  // Toggle Human Contacted Status
  const handleTakeover = (id: number) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id
          ? {
              ...lead,
              humanContacted: true,
              status: "CONTACTED BY HUMAN"
            }
          : lead
      )
    );
  };

  const totalHot = leads.length;
  const pendingCount = leads.filter((l) => !l.humanContacted).length;
  const actionedCount = leads.filter((l) => l.humanContacted).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 shadow-sm">
            <Flame className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              Hot Leads Workspace
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              High-priority prospect queue filtered by lead score threshold. Human operator takeover point.
            </p>
          </div>
        </div>
      </div>

      {/* Top Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-indigo-600" />
          <div className="text-xs font-bold text-violet-600 uppercase tracking-wider">
            Total Hot Leads Identified
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2 flex items-baseline gap-2">
            {totalHot}
            <span className="text-xs font-semibold text-emerald-600">+14.2%</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
          <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">
            Pending Human Takeover
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2 flex items-baseline gap-2">
            {pendingCount}
            <span className="text-xs font-semibold text-amber-600">Action Needed</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
          <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Actioned / Dispatched
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {actionedCount}
          </div>
        </div>
      </div>

      {/* Priority Leads Feed */}
      <div className="space-y-4 pt-2">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          Priority Action Ledger
        </h2>

        {leads
          .sort((a, b) => b.score - a.score)
          .map((lead) => (
            <div
              key={lead.id}
              className="bg-white border border-slate-200 hover:border-violet-300 rounded-xl p-6 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Business Info */}
                <div className="md:col-span-4 space-y-1">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    {lead.name}
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {lead.city}
                  </div>
                </div>

                {/* Score */}
                <div className="md:col-span-3">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Confidence Score
                  </div>
                  <div className="text-2xl font-black text-violet-600 font-mono mt-0.5">
                    {lead.score}
                    <span className="text-xs text-slate-400 font-normal"> / 100</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="md:col-span-3">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Pipeline Status
                  </div>
                  {lead.humanContacted ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <UserCheck className="w-3.5 h-3.5" />
                      CONTACTED BY HUMAN
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <Clock className="w-3.5 h-3.5" />
                      ACTION REQUIRED
                    </span>
                  )}
                </div>

                {/* Takeover Button */}
                <div className="md:col-span-2 flex justify-start md:justify-end">
                  {!lead.humanContacted ? (
                    <button
                      onClick={() => handleTakeover(lead.id)}
                      className="w-full md:w-auto flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-4 py-2.5 rounded-lg shadow-sm hover:shadow transition-all text-xs"
                    >
                      <span>Takeover Lead</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" /> Handled
                    </span>
                  )}
                </div>
              </div>

              {/* Inbound Signal Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
                <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                  <MessageSquareText className="w-3.5 h-3.5 text-violet-600" />
                  Inbound Reply Signal Detected
                </div>
                <p className="text-xs font-mono text-slate-700 leading-relaxed italic">
                  "{lead.lastReply}"
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}