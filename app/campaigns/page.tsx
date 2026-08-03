"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Upload,
  Play,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Plus,
  Clock,
  Globe2,
  FileText,
  Search,
  Rocket,
} from "lucide-react";
import { api } from "@/lib/api";
import { ImportBusinesses } from "@/components/dashboard/ImportBusinesses";
import { CampaignBusinesses } from "@/components/dashboard/CampaignBusinesses";
import { StartCampaignDialog } from "@/components/dashboard/StartCampaignDialog";
import type { Campaign, BulkImportCard, JobCard } from "@/lib/types";

type StatusBucket = "all" | "active" | "done" | "failed";

// Statuses (across both kinds) during which a background job is still working.
const ACTIVE_STATUSES = new Set(["pending", "running", "discovering", "messaging"]);
const DONE_STATUSES = new Set(["done", "completed"]);

type Selection = { kind: "import" | "campaign"; id: number } | null;
type UploaderPhase = "idle" | "importing" | "done" | "error";

function cardTime(c: JobCard): number {
  const t = c.created_at ? new Date(c.created_at).getTime() : 0;
  return Number.isNaN(t) ? 0 : t;
}

function statusMeta(status: string): { label: string; cls: string; pulse: boolean } {
  if (ACTIVE_STATUSES.has(status))
    return { label: status, cls: "bg-indigo-100 text-indigo-800", pulse: true };
  if (DONE_STATUSES.has(status))
    return { label: status, cls: "bg-emerald-100 text-emerald-800", pulse: false };
  if (status === "failed") return { label: status, cls: "bg-rose-100 text-rose-800", pulse: false };
  return { label: status, cls: "bg-slate-100 text-slate-700", pulse: false };
}

// Friendlier wording for a discovery job's raw status, matching the detail table.
function importLabel(status: string): string {
  const map: Record<string, string> = { pending: "queued", running: "checking", done: "done", failed: "failed" };
  return map[status] ?? status;
}

export default function PresenceAnalysisPage() {
  const [cards, setCards] = useState<JobCard[]>([]);
  const [selected, setSelected] = useState<Selection>(null);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusBucket>("all");
  const [startingKey, setStartingKey] = useState<string | null>(null);
  const [startDialogFor, setStartDialogFor] = useState<number | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Upload modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploadPhase, setUploadPhase] = useState<UploaderPhase>("idle");
  const [uploadMessage, setUploadMessage] = useState("");

  const loadCards = useCallback(async () => {
    try {
      const date = dateFilter || undefined; // server-side single-day filter
      const [campaigns, imports] = await Promise.all([
        api.listCampaigns(0, 50, date).catch(() => [] as Campaign[]),
        api.listImportCards(0, 50, date).catch(() => [] as BulkImportCard[]),
      ]);
      const merged: JobCard[] = [
        ...imports.map((c) => ({ kind: "import" as const, ...c })),
        ...campaigns.map((c) => ({ kind: "campaign" as const, ...c })),
      ].sort((a, b) => cardTime(b) - cardTime(a));
      setCards(merged);
      setListError(null);

      // Keep polling while any job is still working.
      if (merged.some((c) => ACTIVE_STATUSES.has(c.status))) {
        timerRef.current = setTimeout(loadCards, 3000);
      }
    } catch (e) {
      setListError(e instanceof Error ? e.message : "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [dateFilter]);

  useEffect(() => {
    loadCards();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [loadCards]);

  useEffect(() => {
    if (notification) {
      const t = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(t);
    }
  }, [notification]);

  const refreshList = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    loadCards();
  }, [loadCards]);

  // ---- Campaign Start: open the scope dialog (all vs no-website), then run ----
  const openStartDialog = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setStartDialogFor(id);
  };

  const confirmStartCampaign = async (scope: "no_website" | "all") => {
    if (startDialogFor == null) return;
    const id = startDialogFor;
    setStartingKey(`campaign-${id}`);
    setNotification(null);
    try {
      await api.startCampaign(id, scope);
      setNotification(
        scope === "all"
          ? "Campaign started — messaging all leads with a phone…"
          : "Campaign started — messaging no-website leads…",
      );
      setStartDialogFor(null);
      refreshList();
    } catch (err) {
      setNotification(err instanceof Error ? `Start failed: ${err.message}` : "Start failed");
    } finally {
      setStartingKey(null);
    }
  };

  // ---- Discovery-job Start (stub for now — surfaces the backend "coming soon" message) ----
  const handleStartImport = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setStartingKey(`import-${id}`);
    setNotification(null);
    try {
      const res = await api.startImportCampaign(id);
      setNotification(res.message || "Accepted.");
      refreshList();
    } catch (err) {
      setNotification(err instanceof Error ? `Start failed: ${err.message}` : "Start failed");
    } finally {
      setStartingKey(null);
    }
  };

  // ---- Upload → bulk-import discovery job ----
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);
    setUploadPhase("idle");
    setUploadMessage("");
  };

  const handleImport = async () => {
    if (!csvFile) return;
    setUploadPhase("importing");
    setUploadMessage("");
    try {
      const result = await api.importBulk(csvFile);
      setUploadPhase("done");
      setUploadMessage(
        `Import #${result.job_id} queued — ${result.valid_rows}/${result.total_rows} rows. Checking contacts…`,
      );
      // Do NOT open the detail table — just surface the new card in the grid. The card
      // is clickable to open the live table, and polls its checking/running status.
      setTimeout(() => {
        setIsModalOpen(false);
        resetUpload();
        setNotification("Discovery job created — checking contacts. Click the card to watch progress.");
        refreshList();
      }, 900);
    } catch (err) {
      setUploadPhase("error");
      setUploadMessage(err instanceof Error ? err.message : "Import failed");
    }
  };

  const resetUpload = () => {
    setCsvFile(null);
    setUploadPhase("idle");
    setUploadMessage("");
  };

  const startDialogCampaign = cards.find(
    (c): c is Extract<JobCard, { kind: "campaign" }> => c.kind === "campaign" && c.id === startDialogFor,
  );

  // Date filtering is server-side; status is a client-side bucket over both kinds.
  const filteredCards = cards.filter((c) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "failed") return c.status === "failed";
    if (statusFilter === "done") return DONE_STATUSES.has(c.status);
    return ACTIVE_STATUSES.has(c.status); // "active"
  });

  // ================= DETAIL VIEW =================
  if (selected) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <button
          onClick={() => {
            setSelected(null);
            refreshList();
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Jobs
        </button>
        {selected.kind === "import" ? (
          <ImportBusinesses importId={selected.id} />
        ) : (
          <CampaignBusinesses campaignId={selected.id} />
        )}
      </div>
    );
  }

  // ================= LIST VIEW =================
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-500 hover:text-emerald-700 font-bold ml-4">
            &times;
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Globe2 className="w-6 h-6 text-indigo-600" /> All Campaigns/CSVs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Discovery jobs (Apify contact check) and outreach campaigns, all in one place. Upload a
            list to check contacts, then start a campaign.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-lg transition-all gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Upload CSV
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter:</span>
        <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 w-full sm:w-52">
          <Clock className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full bg-transparent border-none text-xs focus:outline-none font-medium text-slate-700 cursor-pointer"
            style={{ colorScheme: "light" }}
          />
          {dateFilter && (
            <button onClick={() => setDateFilter("")} className="text-xs text-slate-400 hover:text-slate-600 ml-1 font-bold">
              &times;
            </button>
          )}
        </div>

        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider sm:ml-2">Status:</span>
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1">
          {(["all", "active", "done", "failed"] as StatusBucket[]).map((b) => (
            <button
              key={b}
              onClick={() => setStatusFilter(b)}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg capitalize transition-colors ${
                statusFilter === b ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        {listError && <span className="text-xs text-rose-600">API error: {listError}</span>}
      </div>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600 mb-2" />
          Loading jobs…
        </div>
      ) : filteredCards.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-xs">
          No jobs yet. Click <span className="font-semibold text-slate-600">Upload CSV</span> to run a discovery job.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) =>
            card.kind === "import" ? (
              <ImportCardTile
                key={`i${card.id}`}
                card={card}
                starting={startingKey === `import-${card.id}`}
                onOpen={() => setSelected({ kind: "import", id: card.id })}
                onStart={(e) => handleStartImport(card.id, e)}
              />
            ) : (
              <CampaignCardTile
                key={`c${card.id}`}
                card={card}
                starting={startingKey === `campaign-${card.id}`}
                onOpen={() => setSelected({ kind: "campaign", id: card.id })}
                onStart={(e) => openStartDialog(card.id, e)}
              />
            ),
          )}
        </div>
      )}

      {/* Start-campaign scope dialog */}
      <StartCampaignDialog
        open={startDialogFor != null}
        title={startDialogCampaign?.name}
        busy={startingKey === `campaign-${startDialogFor}`}
        onClose={() => setStartDialogFor(null)}
        onConfirm={confirmStartCampaign}
      />

      {/* Upload modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            onClick={() => uploadPhase !== "importing" && setIsModalOpen(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
          />
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl w-full max-w-md relative z-10 space-y-4 mx-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-600" /> Upload Target CSV
              </h3>
              <button
                onClick={() => uploadPhase !== "importing" && setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            {uploadPhase === "importing" ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 bg-slate-900 rounded-xl text-center space-y-3">
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin" />
                  <Search className="w-5 h-5 text-indigo-400 animate-pulse" />
                </div>
                <p className="text-xs font-bold text-white uppercase tracking-wide">Creating discovery job…</p>
                <p className="text-[10px] text-slate-500">Parsing rows &amp; queuing the Apify Checker</p>
              </div>
            ) : (
              <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/40 rounded-xl p-6 text-center hover:bg-indigo-50/80 transition-colors">
                <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" id="csv-upload-modal" />
                <label htmlFor="csv-upload-modal" className="cursor-pointer space-y-2 block">
                  <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                    <FileText className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700">
                    {csvFile ? csvFile.name : "Click to select target list CSV"}
                  </p>
                  <p className="text-[10px] text-slate-400">Headers must include: name, city</p>
                </label>
              </div>
            )}

            {uploadMessage && (
              <div
                className={`text-[10px] flex items-start gap-1.5 rounded-xl p-3 ${
                  uploadPhase === "error"
                    ? "bg-rose-50 border border-rose-200 text-rose-600"
                    : "bg-emerald-50 border border-emerald-200 text-emerald-700"
                }`}
              >
                {uploadPhase === "error" ? (
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                )}
                <span>{uploadMessage}</span>
              </div>
            )}

            {uploadPhase !== "importing" && (
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 border border-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                {csvFile && (
                  <button
                    onClick={handleImport}
                    className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" /> Import &amp; Check
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Card tiles ----

function TileShell({
  children,
  onOpen,
  accent,
}: {
  children: React.ReactNode;
  onOpen: () => void;
  accent: string;
}) {
  return (
    <div
      onClick={onOpen}
      className={`bg-white border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between ${accent}`}
    >
      {children}
    </div>
  );
}

function KindBadge({ kind }: { kind: "import" | "campaign" }) {
  return kind === "import" ? (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 uppercase tracking-wider">
      <Search className="w-3 h-3" /> Discovery
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200 uppercase tracking-wider">
      <Rocket className="w-3 h-3" /> Campaign
    </span>
  );
}

function pct(done: number, total: number): number {
  return total > 0 ? Math.round((done / total) * 100) : 0;
}

function ProgressBar({ value, done }: { value: number; done: boolean }) {
  return (
    <div className="space-y-1 mb-4">
      <div className="flex justify-between text-[10px] font-semibold text-slate-500">
        <span>Progress</span>
        <span>{value}%</span>
      </div>
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${done ? "bg-emerald-500" : "bg-indigo-600"}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function ImportCardTile({
  card,
  starting,
  onOpen,
  onStart,
}: {
  card: BulkImportCard;
  starting: boolean;
  onOpen: () => void;
  onStart: (e: React.MouseEvent) => void;
}) {
  const s = statusMeta(card.status);
  const done = card.status === "done";
  return (
    <TileShell onOpen={onOpen} accent={s.pulse ? "border-indigo-300" : done ? "border-emerald-200" : "border-slate-200"}>
      <div>
        <div className="flex items-center justify-between mb-3">
          <KindBadge kind="import" />
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${s.cls} ${s.pulse ? "animate-pulse" : ""}`}>
            {starting ? "starting" : importLabel(card.status)}
          </span>
        </div>
        <h3 className="font-bold text-slate-800 text-base leading-tight truncate">{card.filename}</h3>
        <p className="text-xs text-slate-400 mt-1">
          {card.created_at ? new Date(card.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "—"}
        </p>

        <div className="grid grid-cols-3 gap-2 my-4 text-center bg-slate-50/70 border border-slate-100 rounded-xl p-2.5">
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Total</p>
            <p className="text-sm font-bold text-slate-900">{card.total}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Checked</p>
            <p className="text-sm font-bold text-indigo-600">{card.checked}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Phones</p>
            <p className="text-sm font-bold text-emerald-600">{card.phones_found}</p>
          </div>
        </div>

        <ProgressBar value={pct(card.processed, card.total)} done={done} />
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between mt-auto gap-2">
        <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1">View Results &rarr;</span>
        <button
          onClick={onStart}
          disabled={!done || starting}
          title={done ? "Start outreach for this list" : "Available once checking is complete"}
          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          {starting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3 h-3 fill-current" />}
          Start Campaign
        </button>
      </div>
    </TileShell>
  );
}

function CampaignCardTile({
  card,
  starting,
  onOpen,
  onStart,
}: {
  card: Campaign;
  starting: boolean;
  onOpen: () => void;
  onStart: (e: React.MouseEvent) => void;
}) {
  const s = statusMeta(card.status);
  const done = card.status === "completed";
  const canStart = card.status === "discovered";
  return (
    <TileShell onOpen={onOpen} accent={s.pulse ? "border-indigo-300" : done ? "border-emerald-200" : "border-slate-200"}>
      <div>
        <div className="flex items-center justify-between mb-3">
          <KindBadge kind="campaign" />
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${s.cls} ${s.pulse ? "animate-pulse" : ""}`}>
            {starting ? "starting" : s.label}
          </span>
        </div>
        <h3 className="font-bold text-slate-800 text-base leading-tight truncate">{card.name}</h3>
        <p className="text-xs text-slate-400 font-mono mt-1 truncate">{card.csv_filename}</p>

        <div className="grid grid-cols-3 gap-2 my-4 text-center bg-slate-50/70 border border-slate-100 rounded-xl p-2.5">
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Total</p>
            <p className="text-sm font-bold text-slate-900">{card.total_businesses}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Contacted</p>
            <p className="text-sm font-bold text-indigo-600">{card.contacted_count}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium">No Website</p>
            <p className="text-sm font-bold text-rose-500">{card.no_website_count}</p>
          </div>
        </div>

        <ProgressBar value={pct(card.processed_count, card.total_businesses)} done={done} />
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between mt-auto gap-2">
        <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1">View Results &rarr;</span>
        <button
          onClick={onStart}
          disabled={!canStart || starting}
          title={canStart ? "Start outreach" : "Available once discovery is complete"}
          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          {starting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3 h-3 fill-current" />}
          Start Campaign
        </button>
      </div>
    </TileShell>
  );
}
