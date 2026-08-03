import { Search, Flame } from "lucide-react";

interface Lead {
  name: string;
  city: string;
  category: string;
  status: string;
  score: number;
}

export function LeadsLedgerTable({ leads }: { leads: Lead[] }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900">📊 Live Leads Ledger</h3>
        <div className="relative w-48">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="p-3">Business Name</th>
              <th className="p-3">City</th>
              <th className="p-3">Category</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Lead Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {leads.map((lead, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3 font-semibold text-slate-900">{lead.name}</td>
                <td className="p-3 text-slate-500">{lead.city}</td>
                <td className="p-3 text-slate-500">{lead.category}</td>
                <td className="p-3">
                  {lead.status === "Hot Lead" ? (
                    <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                      <Flame className="w-3 h-3 fill-amber-500" /> {lead.status}
                    </span>
                  ) : (
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      {lead.status}
                    </span>
                  )}
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          lead.score > 80 ? "bg-amber-500" : "bg-indigo-600"
                        }`}
                        style={{ width: `${lead.score}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-900">{lead.score}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}