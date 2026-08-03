"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Search, Loader2, Phone, Mail, Star, MapPin, ExternalLink } from "lucide-react";
import { api } from "@/lib/api";
import { WebsiteFilter, type WebsiteBucket } from "@/components/dashboard/WebsiteFilter";
import type { BusinessSummary } from "@/lib/types";

function websiteBadge(status: string) {
  if (status === "has_website") return { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Has Website" };
  if (status === "no_website") return { cls: "bg-rose-50 text-rose-700 border-rose-200", label: "No Website" };
  if (status === "no_contact_found") return { cls: "bg-amber-50 text-amber-700 border-amber-200", label: "No Contact" };
  if (status === "lookup_failed") return { cls: "bg-slate-100 text-slate-500 border-slate-200", label: "Lookup Failed" };
  return { cls: "bg-slate-50 text-slate-400 border-slate-200", label: status };
}

function SocialPill({ href, label }: { href: string | null; label: string }) {
  if (!href) return null;
  return (
    <a
      href={href.startsWith("http") ? href : `https://${href}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
    >
      {label}
    </a>
  );
}

export default function AllBusinessesPage() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<BusinessSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("All");
  const [website, setWebsite] = useState<WebsiteBucket>("all");
  const [date, setDate] = useState("");

  const load = useCallback(async () => {
    try {
      setBusinesses(await api.listBusinesses());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load businesses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const cities = useMemo(
    () => ["All", ...Array.from(new Set(businesses.map((b) => b.city).filter(Boolean))).sort()],
    [businesses],
  );

  const filtered = businesses.filter((b) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q || b.name.toLowerCase().includes(q) || (b.email ?? "").toLowerCase().includes(q);
    const matchesCity = city === "All" || b.city === city;
    const matchesWebsite = website === "all" || b.website_status === website;
    const matchesDate =
      !date || (b.created_at ? new Date(b.created_at).toISOString().split("T")[0] === date : false);
    return matchesSearch && matchesCity && matchesWebsite && matchesDate;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Building2 className="w-6 h-6 text-indigo-600" /> All Businesses
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Every business uploaded across all campaigns &amp; imports, with the data discovered from Apify.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row gap-3 lg:items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email…"
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
          />
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none"
          style={{ colorScheme: "light" }}
        />
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none"
        >
          {cities.map((c) => (
            <option key={c} value={c}>
              {c === "All" ? "All Cities" : c}
            </option>
          ))}
        </select>
        <WebsiteFilter value={website} onChange={setWebsite} />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">
            Businesses <span className="text-slate-400 font-normal">({filtered.length})</span>
          </h3>
          <span className="text-xs text-slate-400">Click any row for full Apify detail</span>
        </div>

        {error && <p className="px-4 py-3 text-xs text-rose-600">API error: {error}</p>}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Business Name</th>
                <th className="p-3">City</th>
                <th className="p-3">Category</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Website</th>
                <th className="p-3">Email</th>
                <th className="p-3">Social</th>
                <th className="p-3">Maps</th>
                <th className="p-3 text-right">Rating</th>
                <th className="p-3 text-right">Reviews</th>
                <th className="p-3 text-right">Presence</th>
                <th className="p-3">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map((b) => {
                const wb = websiteBadge(b.website_status);
                return (
                  <tr
                    key={b.id}
                    onClick={() => router.push(`/businesses/${b.id}`)}
                    className="cursor-pointer hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="p-3 font-semibold text-slate-900">{b.name}</td>
                    <td className="p-3 text-slate-500">{b.city}</td>
                    <td className="p-3 text-slate-500">{b.category}</td>
                    <td className="p-3">
                      {b.phone ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                          <Phone className="w-3 h-3" /> {b.phone}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] ${wb.cls}`}>
                        {wb.label}
                        {b.website_url && (
                          <a
                            href={b.website_url.startsWith("http") ? b.website_url : `https://${b.website_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </span>
                    </td>
                    <td className="p-3">
                      {b.email ? (
                        <span className="inline-flex items-center gap-1 text-slate-600">
                          <Mail className="w-3 h-3" /> {b.email}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <SocialPill href={b.facebook} label="FB" />
                        <SocialPill href={b.instagram} label="IG" />
                        <SocialPill href={b.linkedin} label="LI" />
                        {!b.facebook && !b.instagram && !b.linkedin && <span className="text-slate-300">—</span>}
                      </div>
                    </td>
                    <td className="p-3">
                      {b.google_maps_url ? (
                        <a
                          href={b.google_maps_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {b.rating != null ? (
                        <span className="inline-flex items-center gap-1 text-amber-600 font-semibold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {b.rating}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="p-3 text-right text-slate-500">{b.reviews_count ?? "—"}</td>
                    <td className="p-3 text-right font-bold text-slate-900">
                      {b.online_presence_score ?? "—"}
                    </td>
                    <td className="p-3 text-slate-500">{b.recommendation ?? "—"}</td>
                  </tr>
                );
              })}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={12} className="p-6 text-center text-slate-400">
                    {businesses.length === 0 ? "No businesses yet." : "No businesses match these filters."}
                  </td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan={12} className="p-8 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-600" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
