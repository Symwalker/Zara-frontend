import { Bot, Globe, Sparkles } from "lucide-react";

export function AgentAuditInspector({ selectedBiz }: { selectedBiz: any }) {
  if (!selectedBiz) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <Bot className="w-4 h-4" /> Agent Audit Findings
          </span>
          <h3 className="text-lg font-bold text-white mt-0.5">{selectedBiz.name}</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Email: <span className="text-slate-200 font-mono">{selectedBiz.email}</span> | City: {selectedBiz.city} | Category: {selectedBiz.category}
          </p>
        </div>
        <span className="bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full">
          Score: {selectedBiz.score}/100
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" /> Checker Agent Web Analysis
          </h4>
          <div className="text-xs space-y-2">
            <p className="text-slate-300"><strong className="text-slate-100">Website Status:</strong> {selectedBiz.websiteDetail}</p>
            <p className="text-slate-300"><strong className="text-slate-100">Social Footprint:</strong> {selectedBiz.socialDetail}</p>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Writer Agent Generated Copy
          </h4>
          <p className="text-[11px] text-slate-400">Strategy: <span className="text-purple-300 font-semibold">{selectedBiz.variationUsed}</span></p>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 font-mono text-xs text-indigo-300 leading-relaxed">
            "{selectedBiz.generatedVariation}"
          </div>
        </div>
      </div>
    </div>
  );
}