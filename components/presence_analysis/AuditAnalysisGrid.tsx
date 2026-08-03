import { Globe, Share2, XCircle, CheckCircle2, Search } from "lucide-react";

export function AuditAnalysisGrid({ records }: { records: any[] }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Audited Business Records</h3>
        <span className="text-xs text-slate-400">Inspected by Checker Agent</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {records.map((item) => (
          <div
            key={item.id}
            className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/50 hover:bg-white hover:border-indigo-200 transition-all shadow-2xs"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                <p className="text-xs text-slate-500">{item.city} • {item.category}</p>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.hasWebsite
                    ? "bg-slate-100 text-slate-600"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {item.hasWebsite ? "Skipped" : "Audited Candidate"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                {item.hasWebsite ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-rose-500" />
                )}
                <span className="text-slate-600 font-medium">
                  {item.hasWebsite ? "Website Live" : "No Domain Found"}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-sky-500" />
                <span className="text-slate-600 font-medium">{item.socialSummary}</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-lg p-2.5 text-[11px] font-mono text-slate-600">
              <span className="text-indigo-600 font-bold">[Tavily Query]:</span> "{item.searchQuery}"
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}