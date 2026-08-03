"use client";

import React from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Send, 
  MessageSquareCheck, 
  Zap,  
  PieChart, 
  Sparkles,
  ArrowUpRight,
  ShieldCheck
} from "lucide-react";

interface VariationPerformance {
  variation: string;
  sent: number;
  replies: number;
  conversionRate: number;
}

const VARIATION_DATA: VariationPerformance[] = [
  { variation: "Var #1 (Direct Pitch)", sent: 4280, replies: 320, conversionRate: 7.48 },
  { variation: "Var #2 (Problem-Focused)", sent: 4281, replies: 512, conversionRate: 11.96 },
  { variation: "Var #3 (Social Proof)", sent: 4281, replies: 324, conversionRate: 7.57 },
];

const MARKET_PRESENCE_DATA = [
  { category: "No Online Presence", count: 4520, percentage: 35.2, color: "bg-red-500" },
  { category: "Website Only", count: 3110, percentage: 24.2, color: "bg-amber-500" },
  { category: "Social Only", count: 2800, percentage: 21.8, color: "bg-blue-500" },
  { category: "Both Web & Social", count: 2412, percentage: 18.8, color: "bg-emerald-500" },
];

export default function AnalyticsPage() {
  const totalContacted = 12842;
  const totalReplied = 1156;
  const overallConversion = ((totalReplied / totalContacted) * 100).toFixed(2);
  const hotLeadsIdentified = 428;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-50 border border-violet-200 text-violet-600 shadow-sm">
            <BarChart3 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
              Campaign Analytics & Insights
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Performance metrics, dispatch rate stability, prompt variation analysis, and market footprint breakdown.
            </p>
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-violet-600" />
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Total Contacted</span>
            <Send className="w-4 h-4 text-violet-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {totalContacted.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">Dispatched via Gmail</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Total Replies</span>
            <MessageSquareCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {totalReplied.toLocaleString()}
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-1">
            Inbound response signal
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Conversion Rate</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2 flex items-baseline gap-2">
            {overallConversion}%
            <span className="text-xs font-semibold text-emerald-600">+1.2% vs avg</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Overall reply conversion</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Hot Leads Filtered</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {hotLeadsIdentified}
          </div>
          <p className="text-xs text-amber-600 font-semibold mt-1">
            High-priority operator queue
          </p>
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Prompt Variation Performance (A/B Testing) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-600" />
                Writer Agent Variation A/B Performance
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluating conversion efficiency across AI message prompt strategies.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200">
              Claude 3.5 Sonnet
            </span>
          </div>

          <div className="space-y-5">
            {VARIATION_DATA.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-800">{item.variation}</span>
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="text-slate-500">{item.replies} / {item.sent} replies</span>
                    <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded border border-violet-100">
                      {item.conversionRate}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar Container */}
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-violet-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(item.conversionRate / 15) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Key Insight Callout */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-start gap-3">
            <div className="p-2 bg-violet-100 text-violet-700 rounded-lg shrink-0 mt-0.5">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-900 block">Performance Highlight</span>
              <p className="leading-relaxed">
                <strong>Variation #2 (Problem-Focused)</strong> achieved the highest conversion at <strong>11.96%</strong>. 
                Outreach highlighting gaps in existing digital footprints outperforms direct sales pitches.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Target Market Digital Presence Breakdown */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-600" />
              Target Market Presence Share
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Digital footprint distribution identified by Checker Agent.
            </p>
          </div>

          {/* Visual Distribution Stack */}
          <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-100">
            {MARKET_PRESENCE_DATA.map((item, idx) => (
              <div 
                key={idx}
                className={`${item.color} h-full`}
                style={{ width: `${item.percentage}%` }}
                title={`${item.category}: ${item.percentage}%`}
              />
            ))}
          </div>

          {/* Breakdown Ledger */}
          <div className="space-y-3 pt-2">
            {MARKET_PRESENCE_DATA.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="font-semibold text-slate-700">{item.category}</span>
                </div>
                <div className="font-mono text-slate-600">
                  <span className="font-bold text-slate-900">{item.count.toLocaleString()}</span> ({item.percentage}%)
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Rate-limiting active
            </span>
            <span className="font-mono">Max 250 msgs/hr</span>
          </div>
        </div>
      </div>
    </div>
  );
}