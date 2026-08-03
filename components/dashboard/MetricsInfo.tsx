import { Rocket, Building2 } from "lucide-react";
import type { DashboardStats } from "@/lib/types";

interface MetricsInfoProps {
  stats: DashboardStats | null;
}

export function MetricsInfo({ stats }: MetricsInfoProps) {
  const leadsProcessed = stats?.leads_processed ?? 0;
  const campaignsLaunched = stats?.campaigns_launched ?? 0;
  const campaignsActive = stats?.campaigns_active ?? 0;
  const campaignsCompleted = stats?.campaigns_completed ?? 0;
  const outreached = stats?.outreached_businesses ?? 0;

  // Progress bar = share of launched campaigns that have completed.
  const completionRate = campaignsLaunched > 0
    ? Math.round((campaignsCompleted / campaignsLaunched) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Metric 1: Total Leads Processed (businesses checked by the Checker) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Total Leads Processed
        </p>
        <div className="flex items-baseline justify-between mt-2">
          <span className="text-3xl font-extrabold text-slate-900">
            {leadsProcessed.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Metric 2: Campaigns Launched */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Campaigns Launched
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Rocket className="w-4 h-4 text-indigo-600" /> {campaignsLaunched} Launched
          </span>
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            {campaignsActive} Active
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Metric 3: Total Outreached Businesses */}
      <div className="bg-gradient-to-br from-amber-500/10 via-white to-white border border-amber-400/40 rounded-2xl p-5 shadow-sm relative overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-600 tracking-wider flex items-center gap-1.5 uppercase">
            <Building2 className="w-4 h-4 text-amber-500" /> Total Outreached Businesses
          </span>
          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Pipeline
          </span>
        </div>
        <div className="mt-2 text-3xl font-extrabold text-slate-900">
          {outreached.toLocaleString()}{" "}
          <span className="text-xs font-normal text-slate-500">businesses contacted</span>
        </div>
      </div>
    </div>
  );
}
