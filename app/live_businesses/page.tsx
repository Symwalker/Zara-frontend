"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";
import { BusinessMetrics } from "@/components/businesses/BusinessMetrics";
import { BusinessFilters } from "@/components/businesses/BusinessFilters";
import { BusinessTable } from "@/components/businesses/BusinessTable";
import { AgentAuditInspector } from "@/components/businesses/AgentAuditInspector";

// Sample dataset (Can be replaced with an API hook)
const sampleBusinesses = [
  { id: 101, name: "Al-Rehman AC Repair", city: "Karachi", category: "HVAC & Repair", website: "❌ No Website", hasWebsite: false, socialPresence: "FB Active (2022)", emailStatus: "📧 Email Sent", score: 88, email: "info@alrehman-repair.pk", websiteDetail: "Checked Tavily API: No dedicated domain found.", socialDetail: "Facebook page found (last post Nov 2022).", generatedVariation: "Assalam-o-Alaikum Al-Rehman Team...", variationUsed: "Variation #2 (Roman Urdu - Service Offer)" },
  { id: 102, name: "Lumina Dynamics", city: "Karachi", category: "IT Services", website: "✅ luminadynamics.com", hasWebsite: true, socialPresence: "FB & LinkedIn Active", emailStatus: "⏭️ Skipped (Has Site)", score: 15, email: "contact@luminadynamics.com", websiteDetail: "Website verified live.", socialDetail: "Active footprint found.", generatedVariation: "N/A — Qualified out.", variationUsed: "None" },
  { id: 103, name: "Tariq Plumbing Experts", city: "Lahore", category: "Plumbing", website: "❌ No Website", hasWebsite: false, socialPresence: "❌ None Found", emailStatus: "🔥 Hot Lead", score: 95, email: "tariqplumbing.lhr@gmail.com", websiteDetail: "No website found on Google.", socialDetail: "Zero digital footprint found.", generatedVariation: "AOA Tariq Sb, Lahore mein plumbing services...", variationUsed: "Variation #1 (Roman Urdu - Direct Hook)" },
];

export default function LiveBusinessesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedBizId, setSelectedBizId] = useState<number>(101);

  // Filter Logic
  const filteredBusinesses = sampleBusinesses.filter((biz) => {
    const matchesSearch = biz.name.toLowerCase().includes(searchQuery.toLowerCase()) || biz.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === "All" || biz.city === selectedCity;
    const matchesCategory = selectedCategory === "All" || biz.category === selectedCategory;
    const matchesStatus = selectedStatus === "All" || biz.emailStatus === selectedStatus;
    return matchesSearch && matchesCity && matchesCategory && matchesStatus;
  });

  const selectedBiz = sampleBusinesses.find((b) => b.id === selectedBizId);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Building2 className="w-6 h-6 text-indigo-600" /> Live Businesses Roster
        </h1>
        <p className="text-sm text-slate-500 mt-1">Real-time execution view showing website verifications and outreach log[cite: 2].</p>
      </div>

      {/* Modular Components Render */}
      <BusinessMetrics businesses={filteredBusinesses} />
      
      <BusinessFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      <BusinessTable
        businesses={filteredBusinesses}
        selectedBizId={selectedBizId}
        setSelectedBizId={setSelectedBizId}
      />

      <AgentAuditInspector selectedBiz={selectedBiz} />
    </div>
  );
}