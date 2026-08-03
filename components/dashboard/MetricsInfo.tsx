import { Mail, Flame, ArrowUpRight } from "lucide-react";

export function MetricsInfo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Metric 1 */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          Total Leads Processed
        </p>
        <div className="flex items-baseline justify-between mt-2">
          <span className="text-3xl font-extrabold text-slate-900">12,842</span>
          <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            +14.2% <ArrowUpRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>
      </div>

      {/* Metric 2 */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          Channel Dispatched
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Mail className="w-4 h-4 text-indigo-600" /> Gmail Outreach
          </span>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            100% Active
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-emerald-500 h-full w-full" />
        </div>
      </div>

      {/* Metric 3 */}
      <div className="bg-gradient-to-br from-amber-500/10 via-white to-white border border-amber-400/40 rounded-2xl p-5 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-600 tracking-wider flex items-center gap-1.5 uppercase">
            <Flame className="w-4 h-4 fill-amber-500" /> Hot Leads Identified
          </span>
          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
            Priority
          </span>
        </div>
        <div className="mt-2 text-3xl font-extrabold text-slate-900">
          428 <span className="text-xs font-normal text-slate-500">Ready for Follow-up</span>
        </div>
      </div>
    </div>
  );
}