import { ChevronRight, CheckCircle2, XCircle, Flame } from "lucide-react";

export function BusinessTable({
  businesses,
  selectedBizId,
  setSelectedBizId,
}: {
  businesses: any[];
  selectedBizId: number;
  setSelectedBizId: (id: number) => void;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-sm">Target Leads Ledger</h3>
        <span className="text-xs text-slate-400">Click any row to view agent audit findings</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="p-3.5">Business Name</th>
              <th className="p-3.5">City</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Website Status</th>
              <th className="p-3.5">Social Footprint</th>
              <th className="p-3.5">Outreach Status</th>
              <th className="p-3.5 text-right">Lead Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {businesses.map((biz) => {
              const isSelected = biz.id === selectedBizId;
              return (
                <tr
                  key={biz.id}
                  onClick={() => setSelectedBizId(biz.id)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? "bg-indigo-50/60" : "hover:bg-slate-50/80"
                  }`}
                >
                  <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                    <ChevronRight className={`w-3.5 h-3.5 text-indigo-600 transition-transform ${isSelected ? "rotate-90" : ""}`} />
                    {biz.name}
                  </td>
                  <td className="p-3.5 text-slate-500">{biz.city}</td>
                  <td className="p-3.5 text-slate-500">{biz.category}</td>
                  <td className="p-3.5">
                    {biz.hasWebsite ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-semibold">
                        <CheckCircle2 className="w-3 h-3" /> Has Website
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md font-semibold">
                        <XCircle className="w-3 h-3" /> No Website
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-slate-600">{biz.socialPresence}</td>
                  <td className="p-3.5">
                    {biz.emailStatus.includes("Hot Lead") ? (
                      <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                        <Flame className="w-3 h-3 fill-amber-500" /> Hot Lead
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">
                        {biz.emailStatus}
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-right font-bold text-slate-900">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${biz.score > 80 ? "bg-amber-500" : "bg-indigo-600"}`}
                          style={{ width: `${biz.score}%` }}
                        />
                      </div>
                      {biz.score}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}