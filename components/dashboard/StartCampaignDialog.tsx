"use client";

import { useState } from "react";
import { Send, Loader2, Globe2, Users } from "lucide-react";

type Scope = "no_website" | "all";

export function StartCampaignDialog({
  open,
  title,
  busy = false,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title?: string;
  busy?: boolean;
  onClose: () => void;
  onConfirm: (scope: Scope) => void;
}) {
  const [scope, setScope] = useState<Scope>("no_website");
  if (!open) return null;

  const options: { value: Scope; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      value: "no_website",
      label: "No-website leads only",
      desc: "Message only businesses confirmed to have no website (the default target).",
      icon: <Globe2 className="w-4 h-4" />,
    },
    {
      value: "all",
      label: "All leads with a phone",
      desc: "Message every business in this campaign that has a discovered phone number.",
      icon: <Users className="w-4 h-4" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div onClick={() => !busy && onClose()} className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs" />
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl w-full max-w-md relative z-10 space-y-4 mx-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Send className="w-4 h-4 text-indigo-600" /> Start Campaign
          </h3>
          {title && <p className="text-xs text-slate-400 mt-1 truncate">{title}</p>}
        </div>

        <p className="text-xs text-slate-500">Who should receive messages in this campaign?</p>

        <div className="space-y-2">
          {options.map((o) => (
            <label
              key={o.value}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                scope === o.value
                  ? "border-indigo-400 bg-indigo-50/60"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="scope"
                value={o.value}
                checked={scope === o.value}
                onChange={() => setScope(o.value)}
                className="mt-0.5 accent-indigo-600"
              />
              <span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                  {o.icon} {o.label}
                </span>
                <span className="block text-[11px] text-slate-500 mt-0.5">{o.desc}</span>
              </span>
            </label>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            disabled={busy}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 border border-slate-200 rounded-xl cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(scope)}
            disabled={busy}
            className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            Start
          </button>
        </div>
      </div>
    </div>
  );
}
