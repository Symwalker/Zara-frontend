"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Phone,
  Mail,
  Star,
  MapPin,
  ExternalLink,
  Globe,
  MessageSquare,
  Flame,
} from "lucide-react";
import { api } from "@/lib/api";
import type { BusinessDetailFull } from "@/lib/types";

function href(url: string | null): string | undefined {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `https://${url}`;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <div className="text-sm text-slate-800 font-medium">{children}</div>
    </div>
  );
}

const DASH = <span className="text-slate-300">—</span>;

function bandCls(band: string | null) {
  if (band === "hot") return "bg-amber-100 text-amber-800";
  if (band === "warm") return "bg-orange-100 text-orange-700";
  return "bg-sky-100 text-sky-700";
}

export default function BusinessDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);

  const [biz, setBiz] = useState<BusinessDetailFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id || Number.isNaN(id)) {
      setError("Invalid business id");
      setLoading(false);
      return;
    }
    try {
      setBiz(await api.getBusinessDetail(id));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load business");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <button
        onClick={() => router.push("/businesses")}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Businesses
      </button>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
        </div>
      ) : error || !biz ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-rose-600 text-sm">
          {error ?? "Business not found."}
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{biz.name}</h1>
                <p className="text-sm text-slate-500 mt-1">
                  {biz.city} · {biz.category}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {biz.online_presence_score != null && (
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Presence {biz.online_presence_score}/100
                  </span>
                )}
                {biz.recommendation && (
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-600">
                    {biz.recommendation}
                  </span>
                )}
                {biz.opted_out && (
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-rose-100 text-rose-700">
                    Opted out
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Apify snapshot */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-600" /> Apify Discovery
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5">
              <Field label="Phone">
                {biz.phone ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700">
                    <Phone className="w-3.5 h-3.5" /> {biz.phone}
                  </span>
                ) : DASH}
              </Field>
              <Field label="Phone Source">{biz.phone_source ?? DASH}</Field>
              <Field label="Email">
                {biz.email ? (
                  <span className="inline-flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" /> {biz.email}
                  </span>
                ) : DASH}
              </Field>
              <Field label="Website">
                {biz.website_status === "has_website" && biz.website_url ? (
                  <a href={href(biz.website_url)} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline inline-flex items-center gap-1">
                    {biz.website_url} <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="capitalize">{biz.website_status.replace(/_/g, " ")}</span>
                )}
              </Field>
              <Field label="Rating">
                {biz.rating != null ? (
                  <span className="inline-flex items-center gap-1 text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {biz.rating}
                  </span>
                ) : DASH}
              </Field>
              <Field label="Reviews">{biz.reviews_count ?? DASH}</Field>
              <Field label="Google Maps">
                {biz.google_maps_url ? (
                  <a href={biz.google_maps_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> View listing
                  </a>
                ) : DASH}
              </Field>
              <Field label="Facebook">
                {biz.facebook ? (
                  <a href={href(biz.facebook)} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline inline-flex items-center gap-1">
                    Profile <ExternalLink className="w-3 h-3" />
                  </a>
                ) : DASH}
              </Field>
              <Field label="Instagram">
                {biz.instagram ? (
                  <a href={href(biz.instagram)} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline inline-flex items-center gap-1">
                    Profile <ExternalLink className="w-3 h-3" />
                  </a>
                ) : DASH}
              </Field>
              <Field label="LinkedIn">
                {biz.linkedin ? (
                  <a href={href(biz.linkedin)} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline inline-flex items-center gap-1">
                    Profile <ExternalLink className="w-3 h-3" />
                  </a>
                ) : DASH}
              </Field>
              <Field label="WhatsApp Reachable">
                {biz.whatsapp_available == null ? DASH : biz.whatsapp_available ? "Yes" : "No"}
              </Field>
              <Field label="Channel Decision">{biz.channel_decision}</Field>
              <Field label="Added">{biz.created_at ? new Date(biz.created_at).toLocaleString() : DASH}</Field>
            </div>
          </div>

          {/* Lead score */}
          {biz.lead_score && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" /> Lead Score
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-slate-900">{biz.lead_score.score}</span>
                {biz.lead_score.band && (
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${bandCls(biz.lead_score.band)}`}>
                    {biz.lead_score.band}
                  </span>
                )}
              </div>
              {biz.lead_score.score_breakdown && Object.keys(biz.lead_score.score_breakdown).length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {Object.entries(biz.lead_score.score_breakdown).map(([k, v]) => (
                    <span key={k} className="text-[11px] bg-slate-50 border border-slate-200 rounded-md px-2 py-0.5 text-slate-600">
                      {k.replace(/_/g, " ")}: <span className="font-semibold">{v > 0 ? `+${v}` : v}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Message variations */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" /> Generated Messages
              <span className="text-slate-400 font-normal">({biz.variations.length})</span>
            </h2>
            {biz.variations.length === 0 ? (
              <p className="text-xs text-slate-400">No messages generated yet.</p>
            ) : (
              <div className="space-y-2">
                {biz.variations.map((v) => (
                  <div key={v.id} className="text-xs bg-slate-50 border border-slate-100 rounded-lg p-3">
                    <span className="font-bold text-indigo-600">#{v.variation_number}</span>{" "}
                    <span className="text-slate-700">{v.message_text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Messages + replies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 mb-3">Outreach Log ({biz.messages.length})</h2>
              {biz.messages.length === 0 ? (
                <p className="text-xs text-slate-400">No messages sent/queued.</p>
              ) : (
                <div className="space-y-2">
                  {biz.messages.map((m) => (
                    <div key={m.id} className="text-xs flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-600 capitalize">{m.channel}{m.is_followup ? " · follow-up" : ""}</span>
                      <span className="font-semibold text-slate-700 capitalize">{m.delivery_status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 mb-3">Replies ({biz.replies.length})</h2>
              {biz.replies.length === 0 ? (
                <p className="text-xs text-slate-400">No replies yet.</p>
              ) : (
                <div className="space-y-2">
                  {biz.replies.map((r) => (
                    <div key={r.id} className="text-xs bg-slate-50 border border-slate-100 rounded-lg p-2.5">
                      <p className="text-slate-700">{r.reply_text}</p>
                      <p className="text-[10px] text-slate-400 mt-1 capitalize">
                        {r.intent.replace(/_/g, " ")} · {new Date(r.received_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
