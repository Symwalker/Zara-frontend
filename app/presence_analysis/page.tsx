"use client";

import { useCallback, useEffect, useState } from "react";
import { 
  Building2, 
  Upload, 
  Play, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Plus, 
  Clock, 
  Database,
  Globe2,
  FileText
} from "lucide-react";
import { api } from "@/lib/api";
import type { Campaign, BusinessSummary, CsvValidation } from "@/lib/types";

// Mock Fallback Campaigns when API is offline
const mockCampaigns: Campaign[] = [
  {
    id: 1,
    name: "Karachi HVAC Outreaches",
    csv_filename: "karachi_hvac.csv",
    status: "completed",
    total_businesses: 3,
    processed_count: 3,
    no_website_count: 2,
    contacted_count: 2,
    uncontactable_count: 0,
    created_at: "2026-08-01T10:00:00Z",
    updated_at: "2026-08-01T12:00:00Z"
  },
  {
    id: 2,
    name: "Lahore Tech Startups",
    csv_filename: "lhr_tech.csv",
    status: "running",
    total_businesses: 2,
    processed_count: 1,
    no_website_count: 1,
    contacted_count: 1,
    uncontactable_count: 0,
    created_at: "2026-08-03T09:00:00Z",
    updated_at: null
  },
  {
    id: 3,
    name: "Islamabad Retail Chains",
    csv_filename: "isb_retail.csv",
    status: "pending",
    total_businesses: 1,
    processed_count: 0,
    no_website_count: 0,
    contacted_count: 0,
    uncontactable_count: 0,
    created_at: "2026-08-03T15:30:00Z",
    updated_at: null
  }
];

// Mock Fallback Campaign Businesses when API is offline
const mockCampaignBusinesses: Record<number, BusinessSummary[]> = {
  1: [
    {
      id: 101,
      name: "Al-Rehman AC Repair",
      city: "Karachi",
      category: "HVAC & Repair",
      website_status: "No Website",
      email: "info@alrehman-repair.pk",
      phone: "0300-1234567",
      channel_decision: "email",
      opted_out: false
    },
    {
      id: 102,
      name: "Lumina Dynamics",
      city: "Karachi",
      category: "IT Services",
      website_status: "Live",
      email: "contact@luminadynamics.com",
      phone: null,
      channel_decision: "none",
      opted_out: false
    },
    {
      id: 103,
      name: "Tariq Plumbing Experts",
      city: "Lahore",
      category: "Plumbing",
      website_status: "No Website",
      email: "tariqplumbing.lhr@gmail.com",
      phone: null,
      channel_decision: "email",
      opted_out: false
    }
  ],
  2: [
    {
      id: 104,
      name: "Vortex Systems",
      city: "Islamabad",
      category: "IT Services",
      website_status: "No Website",
      email: "outreach@vortex.com.pk",
      phone: null,
      channel_decision: "email",
      opted_out: false
    },
    {
      id: 105,
      name: "Khyber Catering Services",
      city: "Peshawar",
      category: "Catering",
      website_status: "Live",
      email: "contact@khybercatering.com",
      phone: null,
      channel_decision: "none",
      opted_out: false
    }
  ],
  3: [
    {
      id: 106,
      name: "Hassan Fashion & Retail",
      city: "Karachi",
      category: "Fashion & Retail",
      website_status: "No Website",
      email: "hassan.fashion.khi@gmail.com",
      phone: null,
      channel_decision: "email",
      opted_out: false
    }
  ]
};

type UploaderPhase = "idle" | "validating" | "valid" | "launching" | "done" | "error";

export default function PresenceAnalysisPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);
  const [campaignBusinesses, setCampaignBusinesses] = useState<BusinessSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  // Filter & interaction states
  const [selectedDateFilter, setSelectedDateFilter] = useState("");
  const [startingId, setStartingId] = useState<number | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Upload modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [campaignName, setCampaignName] = useState("");
  const [uploadPhase, setUploadPhase] = useState<UploaderPhase>("idle");
  const [validationResult, setValidationResult] = useState<CsvValidation | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [agentStatus, setAgentStatus] = useState("Initializing agents...");

  const loadCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.listCampaigns();
      setCampaigns(data.length > 0 ? data : mockCampaigns);
    } catch (e) {
      console.warn("Using mock campaigns fallback:", e);
      setCampaigns(mockCampaigns);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCampaignDetail = useCallback(async (id: number) => {
    setDetailLoading(true);
    try {
      const data = await api.getCampaignBusinesses(id);
      setCampaignBusinesses(data.length > 0 ? data : (mockCampaignBusinesses[id] || []));
    } catch (e) {
      console.warn("Using mock campaign detail fallback:", e);
      setCampaignBusinesses(mockCampaignBusinesses[id] || []);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  useEffect(() => {
    if (selectedCampaignId !== null) {
      loadCampaignDetail(selectedCampaignId);
    }
  }, [selectedCampaignId, loadCampaignDetail]);

  // Handle auto dismiss for starting notification banner
  useEffect(() => {
    if (notification) {
      const bannerTimer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(bannerTimer);
    }
  }, [notification]);

  const handleStartCampaign = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering card click selection
    setStartingId(id);
    setNotification(null);
    try {
      await api.startCampaign(id);
      loadCampaigns();
      if (selectedCampaignId === id) {
        loadCampaignDetail(id);
      }
      setNotification(`Campaign started! Scanning domains and composing drafts...`);
    } catch (err) {
      console.error("Failed to start campaign, running mock simulation", err);
      // Fallback state update for mock testing
      setTimeout(() => {
        setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: "running" } : c));
        setNotification(`Campaign #${id} has successfully started! (Mock Execution Mode)`);
        setStartingId(null);
      }, 1000);
      return;
    }
    setStartingId(null);
  };

  // Uploader Logic
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);
    setCampaignName(file.name.replace(/\.csv$/i, ""));
    setUploadPhase("validating");
    setUploadMessage("");
    setValidationResult(null);
    try {
      const val = await api.validateCsv(file);
      setValidationResult(val);
      setUploadPhase("valid");
    } catch (err) {
      setUploadPhase("error");
      setUploadMessage(err instanceof Error ? err.message : "Validation failed");
    }
  };

  const handleUploadLaunch = async () => {
    if (!csvFile) return;
    setUploadPhase("launching");
    setUploadMessage("");
    setAgentStatus("Parsing CSV data & loading records...");

    const t1 = setTimeout(() => setAgentStatus("Checker Agent: resolving domain checks & social footprint..."), 1800);
    const t2 = setTimeout(() => setAgentStatus("Writer Agent: draft copy copyediting & personalization..."), 3600);
    const t3 = setTimeout(() => setAgentStatus("Router Agent: setting up channels (Email/Skip/WhatsApp)..."), 5400);
    const t4 = setTimeout(() => setAgentStatus("Finalizing leads records and auditing parameters..."), 7200);

    try {
      const result = await api.createCampaign(campaignName || csvFile.name, csvFile);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      setUploadPhase("done");
      setUploadMessage(`Campaign #${result.id} successfully created!`);
      setTimeout(() => {
        setIsModalOpen(false);
        resetUploadForm();
        loadCampaigns();
      }, 1500);
    } catch (err) {
      // Mock fallback creation for offline testing
      console.warn("Creating mock campaign offline:", err);
      setTimeout(() => {
        const newMockId = campaigns.length + 1;
        const newMockCampaign: Campaign = {
          id: newMockId,
          name: campaignName || csvFile.name,
          csv_filename: csvFile.name,
          status: "pending",
          total_businesses: 3,
          processed_count: 0,
          no_website_count: 0,
          contacted_count: 0,
          uncontactable_count: 0,
          created_at: new Date().toISOString(),
          updated_at: null
        };
        mockCampaignBusinesses[newMockId] = [
          {
            id: newMockId * 100 + 1,
            name: "Mock Discovered Biz A",
            city: "Lahore",
            category: "General",
            website_status: "No Website",
            email: "biz-a@mock.com",
            phone: null,
            channel_decision: "email",
            opted_out: false
          }
        ];
        setCampaigns(prev => [newMockCampaign, ...prev]);
        setUploadPhase("done");
        setUploadMessage("Mock campaign imported successfully (Offline Sandbox Mode)!");
        setTimeout(() => {
          setIsModalOpen(false);
          resetUploadForm();
        }, 1500);
      }, 8500); // 8.5 seconds simulation
    }
  };

  const resetUploadForm = () => {
    setCsvFile(null);
    setCampaignName("");
    setUploadPhase("idle");
    setValidationResult(null);
    setUploadMessage("");
    setAgentStatus("Initializing agents...");
  };

  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);

  // Filter logic by date picker
  const filteredCampaigns = campaigns.filter(c => {
    if (!selectedDateFilter) return true;
    const campaignDate = new Date(c.created_at).toISOString().split("T")[0];
    return campaignDate === selectedDateFilter;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Starting notification banner */}
      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-xl flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{notification}</span>
          </div>
          <button 
            onClick={() => setNotification(null)} 
            className="text-emerald-500 hover:text-emerald-700 font-bold ml-4 text-sm"
          >
            &times;
          </button>
        </div>
      )}

      {/* 1. Header / Page Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Globe2 className="w-6 h-6 text-indigo-600" /> All Campaigns/CSVs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create, manage, and audit campaigns. Upload target lists, check domain presence, and initiate cold outreaches.
          </p>
        </div>
        {!selectedCampaignId && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-600/20 transition-all gap-2 duration-300 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Upload CSV
          </button>
        )}
      </div>

      {/* 2. Filter Bar (Visible in list view only) */}
      {!selectedCampaignId && (
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter Campaigns:</span>
          <div className="relative flex items-center bg-slate-55 border border-slate-200 rounded-xl px-3 py-1.5 w-full sm:w-52">
            <Clock className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
            <input
              type="date"
              value={selectedDateFilter}
              onChange={(e) => setSelectedDateFilter(e.target.value)}
              className="w-full bg-transparent border-none text-xs focus:outline-none font-medium text-slate-700 cursor-pointer"
              style={{ colorScheme: 'light' }}
            />
            {selectedDateFilter && (
              <button 
                onClick={() => setSelectedDateFilter("")}
                className="text-xs text-slate-400 hover:text-slate-600 ml-1 font-bold flex-shrink-0"
                title="Clear date"
              >
                &times;
              </button>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600 mb-2" />
          Loading campaigns...
        </div>
      ) : selectedCampaignId === null ? (
        /* 3. MAIN LIST VIEW */
        filteredCampaigns.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-xs">
            No campaigns found matching the filtered parameters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((camp) => {
              const isRunning = camp.status === "running" || startingId === camp.id;
              const isCompleted = camp.status === "completed";
              const completionPercent = camp.total_businesses > 0 
                ? Math.round((camp.processed_count / camp.total_businesses) * 100) 
                : 0;

              return (
                <div
                  key={camp.id}
                  onClick={() => setSelectedCampaignId(camp.id)}
                  className={`bg-white border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer relative group flex flex-col justify-between ${
                    isRunning 
                      ? "border-indigo-400/50 bg-indigo-50/5 ring-1 ring-indigo-400/10" 
                      : isCompleted 
                      ? "border-emerald-300 bg-emerald-50/5" 
                      : camp.status === "failed"
                      ? "border-rose-300"
                      : "border-slate-200"
                  }`}
                >
                  <div>
                    {/* Card Badge Header */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> 
                        {new Date(camp.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isRunning 
                          ? "bg-indigo-100 text-indigo-800 animate-pulse" 
                          : isCompleted 
                          ? "bg-emerald-100 text-emerald-800" 
                          : camp.status === "failed"
                          ? "bg-rose-100 text-rose-800" 
                          : "bg-slate-100 text-slate-700"
                      }`}>
                        {isRunning ? "running" : camp.status}
                      </span>
                    </div>

                    {/* Card Title */}
                    <h3 className="font-bold text-slate-800 text-base leading-tight group-hover:text-indigo-600 transition-colors">
                      {camp.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-1 select-all">{camp.csv_filename}</p>

                    {/* Statistics */}
                    <div className="grid grid-cols-3 gap-2 my-5 text-center bg-slate-50/70 border border-slate-100 rounded-xl p-2.5">
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium">Total</p>
                        <p className="text-sm font-bold text-slate-900">{camp.total_businesses}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium">Contacted</p>
                        <p className="text-sm font-bold text-indigo-600">{camp.contacted_count}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium">No Website</p>
                        <p className="text-sm font-bold text-rose-500">{camp.no_website_count}</p>
                      </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="space-y-1 mb-5">
                      <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                        <span>Outreach Progress</span>
                        <span>{completionPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCompleted ? "bg-emerald-500" : "bg-indigo-600"
                          }`}
                          style={{ width: `${completionPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer Action buttons */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between mt-auto gap-2">
                    <span className="text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      View Results &rarr;
                    </span>
                    <button
                      onClick={(e) => handleStartCampaign(camp.id, e)}
                      disabled={startingId !== null || camp.status === "running"}
                      className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
                    >
                      {startingId === camp.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Starting...
                        </>
                      ) : camp.status === "running" ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Running
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 fill-current" /> Start Campaign
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* 4. DETAIL WORKSPACE VIEW */
        <div className="space-y-6">
          {/* Detail Back Button & Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
            <div className="space-y-1.5">
              <button
                onClick={() => setSelectedCampaignId(null)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Campaigns
              </button>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
                  {selectedCampaign?.name}
                </h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  (selectedCampaign?.status === "running" || startingId === selectedCampaign?.id)
                    ? "bg-indigo-100 text-indigo-800 animate-pulse" 
                    : selectedCampaign?.status === "completed" 
                    ? "bg-emerald-100 text-emerald-800" 
                    : "bg-slate-100 text-slate-700"
                }`}>
                  {(startingId === selectedCampaign?.id) ? "running" : selectedCampaign?.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">File: {selectedCampaign?.csv_filename}</p>
            </div>

            {/* Start Button ALWAYS visible and interactive with visual loading states */}
            {selectedCampaign && (
              <button
                onClick={(e) => handleStartCampaign(selectedCampaign.id, e)}
                disabled={startingId !== null || selectedCampaign.status === "running"}
                className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-150 disabled:text-slate-400 disabled:border-slate-200 text-white text-xs font-semibold px-4.5 py-2.5 rounded-xl shadow-md shadow-indigo-600/10 hover:shadow transition-all gap-2 cursor-pointer border border-transparent"
              >
                {startingId === selectedCampaign.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Starting Campaign...
                  </>
                ) : selectedCampaign.status === "running" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-400" /> Campaign Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current animate-pulse" /> Start Campaign
                  </>
                )}
              </button>
            )}
          </div>

          {/* Campaign Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase">Total Businesses</p>
              <p className="text-2xl font-black text-slate-800 mt-1">{selectedCampaign?.total_businesses}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase">Processed</p>
              <p className="text-2xl font-black text-indigo-600 mt-1">{selectedCampaign?.processed_count}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase">No Website Targets</p>
              <p className="text-2xl font-black text-rose-500 mt-1">{selectedCampaign?.no_website_count}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase">Contacted (Outreached)</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">{selectedCampaign?.contacted_count}</p>
            </div>
          </div>

          {/* Campaign Detailed Leads Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Database className="w-4 h-4 text-slate-400" /> Discovered Leads &amp; Outreach Results
              </h3>
              <span className="text-xs text-slate-400">Total list loaded from source CSV</span>
            </div>

            {detailLoading ? (
              <div className="p-12 text-center text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-600 mb-2" />
                Fetching campaign ledger...
              </div>
            ) : campaignBusinesses.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No business records found for this campaign. Click 'Start Campaign' to run domain checks and identify targets.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Business Name</th>
                      <th className="p-3.5">City</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Website Audit</th>
                      <th className="p-3.5">Reach Channel</th>
                      <th className="p-3.5">Outreach Copy Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {campaignBusinesses.map((biz) => {
                      const hasSite = biz.website_status.toLowerCase() !== "no website";
                      return (
                        <tr key={biz.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3.5 font-bold text-slate-900">{biz.name}</td>
                          <td className="p-3.5 text-slate-500">{biz.city}</td>
                          <td className="p-3.5 text-slate-500">{biz.category}</td>
                          <td className="p-3.5">
                            {hasSite ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-semibold text-[10px]">
                                {biz.website_status}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md font-semibold text-[10px]">
                                No Website
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-slate-600">
                            {biz.channel_decision === "none" ? (
                              <span className="text-slate-400 text-[10px]">Skipped</span>
                            ) : (
                              <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded uppercase text-[10px] font-bold font-mono">
                                {biz.channel_decision}
                              </span>
                            )}
                          </td>
                          <td className="p-3.5">
                            {biz.email ? (
                              <span className="text-indigo-600 select-all font-mono text-[10px]">
                                {biz.email}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic text-[10px]">
                                No Contact Details Found
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. MODAL DIALOG UPLOADER OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blurred backdrop */}
          <div 
            onClick={() => { if (uploadPhase !== "launching") setIsModalOpen(false); }}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
          />

          {/* Modal Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl w-full max-w-md relative z-10 space-y-4 transform transition-all animate-in fade-in zoom-in-95 duration-200 mx-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-955 flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-600" /> Upload Target CSV
              </h3>
              <button 
                onClick={() => { if (uploadPhase !== "launching") setIsModalOpen(false); }}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg focus:outline-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Conditionally hide input form when launching (running AI agents) */}
            {uploadPhase !== "launching" ? (
              <>
                {/* Campaign Name Input */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Campaign Name</label>
                  <input
                    type="text"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="e.g. Karachi HVAC Services"
                    disabled={uploadPhase === "validating"}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 font-medium"
                  />
                </div>

                {/* Dashed CSV uploader field */}
                <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/40 rounded-xl p-6 text-center hover:bg-indigo-50/80 transition-colors">
                  <input 
                    type="file" 
                    accept=".csv" 
                    onChange={handleFileChange} 
                    className="hidden" 
                    id="csv-upload-modal" 
                    disabled={uploadPhase === "validating"}
                  />
                  <label htmlFor="csv-upload-modal" className="cursor-pointer space-y-2 block">
                    <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md shadow-indigo-500/30">
                      {uploadPhase === "validating" ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <FileText className="w-5 h-5" />
                      )}
                    </div>
                    <p className="text-xs font-semibold text-slate-700">
                      {csvFile ? `${csvFile.name}` : "Click to select targets list CSV"}
                    </p>
                    <p className="text-[10px] text-slate-400">Headers must include: name, city, category</p>
                  </label>
                </div>

                {/* Validation output details */}
                {uploadPhase === "valid" && validationResult && (
                  <div className="text-[10px] bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1">
                    <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      {validationResult.valid_rows} valid records / {validationResult.total_rows} total rows
                    </p>
                    {validationResult.duplicate_rows.length > 0 && (
                      <p className="text-amber-600 font-medium pl-5">{validationResult.duplicate_rows.length} duplicate rows skipped</p>
                    )}
                    {validationResult.invalid_rows.length > 0 && (
                      <p className="text-red-600 font-medium pl-5">{validationResult.invalid_rows.length} invalid rows ignored</p>
                    )}
                  </div>
                )}
              </>
            ) : (
              /* High-Fidelity Agent Scanning Loader view with dynamic ticker */
              <div className="flex flex-col items-center justify-center py-8 px-4 bg-slate-900 border border-slate-800 rounded-xl text-center space-y-4 shadow-inner">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin" />
                  <Database className="w-6 h-6 text-indigo-400 animate-pulse" />
                </div>
                <div className="space-y-1.5 w-full">
                  <p className="text-xs font-bold text-white tracking-wide uppercase">AI Agent Executing</p>
                  <p className="text-xs font-semibold text-indigo-300 animate-pulse transition-all duration-300 px-2 min-h-8">
                    {agentStatus}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Running verifications, scraping contacts &amp; auditing copy...
                  </p>
                </div>
              </div>
            )}

            {/* Error or Done Messages */}
            {uploadMessage && (
              <div className={`text-[10px] flex items-start gap-1.5 rounded-xl p-3 ${
                uploadPhase === "error"
                  ? "bg-rose-50 border border-rose-200 text-rose-600"
                  : "bg-emerald-50 border border-emerald-200 text-emerald-700"
              }`}>
                {uploadPhase === "error" ? (
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                )}
                <span>{uploadMessage}</span>
              </div>
            )}

            {/* Actions Footer */}
            {uploadPhase !== "launching" && (
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 focus:outline-none transition-colors border border-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                {((uploadPhase === "valid") && (validationResult?.valid_rows ?? 0) > 0) && (
                  <button
                    type="button"
                    onClick={handleUploadLaunch}
                    className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-600/10 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Import List
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