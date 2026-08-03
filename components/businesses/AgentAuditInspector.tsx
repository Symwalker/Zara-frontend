import { Bot, Globe, Sparkles, X } from "lucide-react";

interface InspectorProps {
  selectedBiz: any;
  isOpen: boolean;
  onClose: () => void;
}

export function AgentAuditInspector({ selectedBiz, isOpen, onClose }: InspectorProps) {
  if (!selectedBiz) return null;

  return (
    <>
      {/* Slide-over backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 transition-opacity duration-300"
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed top-0 bottom-0 right-0 z-50 w-full sm:w-[500px] bg-slate-900 border-l border-slate-800 shadow-2xl p-6 text-slate-100 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex-1 overflow-y-auto space-y-6 pr-1">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Bot className="w-4 h-4" /> Agent Audit Findings
              </span>
              <h3 className="text-lg font-bold text-white mt-1 leading-snug">{selectedBiz.name}</h3>
              <p className="text-xs text-slate-400 mt-1">
                City: <span className="text-slate-200">{selectedBiz.city}</span> | Category: <span className="text-slate-200">{selectedBiz.category}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors focus:outline-none"
              aria-label="Close panel"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Details */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-2.5 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-900">
              <span className="text-slate-400">Lead Score:</span>
              <span className="bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {selectedBiz.score}/100
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Email:</span>
              <span className="text-slate-200 font-mono select-all">{selectedBiz.email}</span>
            </div>
            {selectedBiz.date && (
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Date Discovered:</span>
                <span className="text-slate-200 font-medium">{selectedBiz.date}</span>
              </div>
            )}
          </div>

          {/* Checker Agent Analysis */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> Checker Agent Web Analysis
            </h4>
            <div className="text-xs space-y-2.5 leading-relaxed">
              <p className="text-slate-300">
                <strong className="text-slate-100">Website:</strong> {selectedBiz.websiteDetail}
              </p>
              <p className="text-slate-300">
                <strong className="text-slate-100">Socials:</strong> {selectedBiz.socialDetail}
              </p>
            </div>
          </div>

          {/* Writer Agent Generated Copy */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Writer Agent Generated Copy
            </h4>
            <p className="text-[11px] text-slate-400">
              Strategy: <span className="text-purple-300 font-semibold">{selectedBiz.variationUsed}</span>
            </p>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 font-mono text-xs text-indigo-300 leading-relaxed whitespace-pre-wrap">
              "{selectedBiz.generatedVariation}"
            </div>
          </div>
        </div>
      </div>
    </>
  );
}