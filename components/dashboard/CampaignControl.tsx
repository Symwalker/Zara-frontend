"use client";

import { useState } from "react";
import { Upload, Play, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import type { CsvValidation } from "@/lib/types";

type Phase = "idle" | "validating" | "valid" | "launching" | "done" | "error";

export function CampaignControl({ onLaunched }: { onLaunched?: (campaignId: number) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [validation, setValidation] = useState<CsvValidation | null>(null);
  const [message, setMessage] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setName(f.name.replace(/\.csv$/i, ""));
    setPhase("validating");
    setMessage("");
    setValidation(null);
    try {
      const v = await api.validateCsv(f);
      setValidation(v);
      setPhase("valid");
    } catch (err) {
      setPhase("error");
      setMessage(err instanceof Error ? err.message : "Validation failed");
    }
  }

  async function launch() {
    if (!file) return;
    setPhase("launching");
    setMessage("");
    try {
      const campaign = await api.createCampaign(name || file.name, file);
      setPhase("done");
      setMessage(`Campaign #${campaign.id} imported — discovering contacts for ${campaign.total_businesses} businesses…`);
      onLaunched?.(campaign.id);
    } catch (err) {
      setPhase("error");
      setMessage(err instanceof Error ? err.message : "Launch failed");
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
        <Upload className="w-4 h-4 text-indigo-600" /> Campaign Control
      </h3>

      <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/40 rounded-xl p-6 text-center hover:bg-indigo-50/80 transition-colors">
        <input type="file" accept=".csv" onChange={handleFile} className="hidden" id="csv-upload" />
        <label htmlFor="csv-upload" className="cursor-pointer space-y-2 block">
          <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md shadow-indigo-500/30">
            {phase === "validating" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
          </div>
          <p className="text-sm font-semibold text-slate-700">
            {file ? `${file.name} loaded` : "Click to upload target CSV"}
          </p>
          <p className="text-xs text-slate-400">Must include: name, city, category</p>
        </label>
      </div>

      {phase === "valid" && validation && (
        <div className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
          <p className="font-semibold text-slate-700">
            {validation.valid_rows} valid / {validation.total_rows} rows
          </p>
          {validation.duplicate_rows.length > 0 && (
            <p className="text-amber-600">{validation.duplicate_rows.length} duplicate row(s) will be skipped</p>
          )}
          {validation.invalid_rows.length > 0 && (
            <p className="text-red-600">{validation.invalid_rows.length} invalid row(s) ignored</p>
          )}
        </div>
      )}

      {message && (
        <div
          className={`text-xs flex items-start gap-1.5 rounded-lg p-3 ${
            phase === "error"
              ? "bg-red-50 border border-red-200 text-red-600"
              : "bg-emerald-50 border border-emerald-200 text-emerald-700"
          }`}
        >
          {phase === "error" ? (
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          )}
          <span>{message}</span>
        </div>
      )}

      {(phase === "valid" || phase === "launching") && (validation?.valid_rows ?? 0) > 0 && (
        <button
          onClick={launch}
          disabled={phase === "launching"}
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 text-sm transition-all"
        >
          {phase === "launching" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Importing…
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" /> Import &amp; Discover Contacts
            </>
          )}
        </button>
      )}
    </div>
  );
}
