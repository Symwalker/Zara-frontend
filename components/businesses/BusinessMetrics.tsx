export function BusinessMetrics({ businesses }: { businesses: any[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <p className="text-xs font-semibold text-slate-500 uppercase">Total Loaded</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{businesses.length}</p>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <p className="text-xs font-semibold text-slate-500 uppercase">No Website Targets</p>
        <p className="text-2xl font-bold text-rose-600 mt-1">
          {businesses.filter((b) => !b.hasWebsite).length}
        </p>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <p className="text-xs font-semibold text-slate-500 uppercase">Emails Dispatched</p>
        <p className="text-2xl font-bold text-indigo-600 mt-1">
          {businesses.filter((b) => b.emailStatus.includes("Email Sent")).length}
        </p>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <p className="text-xs font-semibold text-slate-500 uppercase">Hot Leads Escalated</p>
        <p className="text-2xl font-bold text-amber-600 mt-1">
          {businesses.filter((b) => b.emailStatus.includes("Hot Lead")).length}
        </p>
      </div>
    </div>
  );
}