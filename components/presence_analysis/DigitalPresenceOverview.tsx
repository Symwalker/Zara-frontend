import { Globe, Share2, AlertCircle, CheckCircle2 } from "lucide-react";

export function DigitalPresenceOverview({ records }: { records: any[] }) {
  const total = records.length;
  const missingWebsite = records.filter((r) => !r.hasWebsite).length;
  const activeSocial = records.filter((r) => r.hasSocial).length;
  const noDigitalFootprint = records.filter((r) => !r.hasWebsite && !r.hasSocial).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase">Audited Companies</span>
          <Globe className="w-4 h-4 text-indigo-600" />
        </div>
        <p className="text-2xl font-bold text-slate-900 mt-2">{total}</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase">Missing Website</span>
          <AlertCircle className="w-4 h-4 text-rose-500" />
        </div>
        <p className="text-2xl font-bold text-rose-600 mt-2">{missingWebsite}</p>
        <p className="text-[11px] text-slate-400 mt-0.5">Primary targets for outreach</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase">Active Social Media</span>
          <Share2 className="w-4 h-4 text-sky-500" />
        </div>
        <p className="text-2xl font-bold text-sky-600 mt-2">{activeSocial}</p>
        <p className="text-[11px] text-slate-400 mt-0.5">FB, Insta, or LinkedIn detected</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase">Zero Digital Footprint</span>
          <CheckCircle2 className="w-4 h-4 text-amber-500" />
        </div>
        <p className="text-2xl font-bold text-amber-600 mt-2">{noDigitalFootprint}</p>
        <p className="text-[11px] text-slate-400 mt-0.5">Highest conversion opportunity</p>
      </div>
    </div>
  );
}