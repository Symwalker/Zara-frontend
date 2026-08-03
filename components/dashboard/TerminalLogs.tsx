export function TerminalLogs() {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="text-slate-400 font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Live Terminal Logs
        </span>
        <span className="text-[10px] text-slate-600">SESSION: ZARA-TX</span>
      </div>
      <div className="space-y-1.5 text-slate-300 h-60 overflow-y-auto pr-2">
        <p><span className="text-slate-600">[09:41:02]</span> Initializing CrewAI Orchestrator...</p>
        <p><span className="text-slate-600">[09:41:05]</span> <span className="text-sky-400 font-bold">[Checker Agent]</span> Searching Tavily API...</p>
        <p><span className="text-slate-600">[09:41:08]</span> <span className="text-sky-400 font-bold">[Checker Agent]</span> No website found. Flagged.</p>
        <p><span className="text-slate-600">[09:41:12]</span> <span className="text-purple-400 font-bold">[Writer Agent]</span> Calling Claude API (Variation #2)...</p>
        <p><span className="text-slate-600">[09:41:15]</span> <span className="text-amber-400 font-bold">[Score Agent]</span> Hot Lead Flagged! Score: 94</p>
        <p><span className="text-slate-600">[09:41:18]</span> <span className="text-emerald-400 font-bold">[Sender Agent]</span> Email sent via Gmail MCP...</p>
        <p><span className="text-slate-600">[09:41:22]</span> Enforcing 45s randomized delay...</p>
      </div>
    </div>
  );
}