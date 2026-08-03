export function AuditDistributionChart() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-slate-900">Digital Maturity Breakdown</h3>
      
      <div className="space-y-3 text-xs">
        <div>
          <div className="flex justify-between font-medium text-slate-700 mb-1">
            <span>No Website, Social Only (Prime Outreach Target)</span>
            <span className="font-bold text-amber-600">58%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full w-[58%]" />
          </div>
        </div>

        <div>
          <div className="flex justify-between font-medium text-slate-700 mb-1">
            <span>Complete Website & Social Active (Skip)</span>
            <span className="font-bold text-slate-500">24%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-slate-400 h-full w-[24%]" />
          </div>
        </div>

        <div>
          <div className="flex justify-between font-medium text-slate-700 mb-1">
            <span>No Website & No Social (High Cold Outreach Risk)</span>
            <span className="font-bold text-rose-600">18%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-rose-500 h-full w-[18%]" />
          </div>
        </div>
      </div>
    </div>
  );
}