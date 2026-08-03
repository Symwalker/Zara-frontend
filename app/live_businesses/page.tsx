"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";
import { BusinessFilters } from "@/components/businesses/BusinessFilters";
import { BusinessTable } from "@/components/businesses/BusinessTable";
import { AgentAuditInspector } from "@/components/businesses/AgentAuditInspector";

import { sampleBusinesses } from "@/lib/mockData";

export default function LiveBusinessesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedWebsiteStatus, setSelectedWebsiteStatus] = useState("All");
  
  const [selectedBizId, setSelectedBizId] = useState<number | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  // Filter Logic
  const filteredBusinesses = sampleBusinesses.filter((biz) => {
    const matchesSearch = biz.name.toLowerCase().includes(searchQuery.toLowerCase()) || biz.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === "All" || biz.city === selectedCity;
    const matchesDate = !selectedDate || biz.date === selectedDate;
    
    let matchesWebsite = true;
    if (selectedWebsiteStatus === "HasWebsite") {
      matchesWebsite = biz.hasWebsite;
    } else if (selectedWebsiteStatus === "NoWebsite") {
      matchesWebsite = !biz.hasWebsite;
    }

    return matchesSearch && matchesCity && matchesDate && matchesWebsite;
  });

  const selectedBiz = sampleBusinesses.find((b) => b.id === selectedBizId);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Building2 className="w-6 h-6 text-indigo-600" /> Live Businesses Roster
        </h1>
        <p className="text-sm text-slate-500 mt-1">Real-time execution view showing website verifications and outreach log.</p>
      </div>
      
      <BusinessFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedWebsiteStatus={selectedWebsiteStatus}
        setSelectedWebsiteStatus={setSelectedWebsiteStatus}
      />

      <BusinessTable
        businesses={filteredBusinesses}
        selectedBizId={selectedBizId}
        setSelectedBizId={(id) => {
          setSelectedBizId(id);
          setIsInspectorOpen(true);
        }}
      />

      <AgentAuditInspector 
        selectedBiz={selectedBiz} 
        isOpen={isInspectorOpen} 
        onClose={() => setIsInspectorOpen(false)} 
      />
    </div>
  );
}