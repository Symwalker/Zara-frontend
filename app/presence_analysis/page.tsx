"use client";

import { Globe2 } from "lucide-react";
import { DigitalPresenceOverview } from "@/components/presence_analysis/DigitalPresenceOverview";
import { AuditDistributionChart } from "@/components/presence_analysis/AuditDistributionChart";
import { AuditAnalysisGrid } from "@/components/presence_analysis/AuditAnalysisGrid";

const sampleRecords = [
  {
    id: 1,
    name: "Al-Rehman AC Repair",
    city: "Karachi",
    category: "HVAC Services",
    hasWebsite: false,
    hasSocial: true,
    socialSummary: "FB Active (2022)",
    searchQuery: "Al-Rehman AC Repair Karachi website"
  },
  {
    id: 2,
    name: "Lumina Dynamics",
    city: "Karachi",
    category: "Software Development",
    hasWebsite: true,
    hasSocial: true,
    socialSummary: "LinkedIn & FB Active",
    searchQuery: "Lumina Dynamics Karachi domain"
  },
  {
    id: 3,
    name: "Tariq Plumbing Experts",
    city: "Lahore",
    category: "Plumbing",
    hasWebsite: false,
    hasSocial: false,
    socialSummary: "Zero Footprint",
    searchQuery: "Tariq Plumbing Lahore contact site"
  },
  {
    id: 4,
    name: "Apex Catering Services",
    city: "Islamabad",
    category: "Catering",
    hasWebsite: false,
    hasSocial: true,
    socialSummary: "FB Page Active",
    searchQuery: "Apex Catering Islamabad menu site"
  }
];

export default function PresenceAnalysisPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Globe2 className="w-6 h-6 text-indigo-600" /> Digital Presence Analysis
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Detailed breakdown of web domain checks and social media footprints performed by the Checker Agent.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <DigitalPresenceOverview records={sampleRecords} />

      {/* Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <AuditDistributionChart />
        </div>
        <div className="lg:col-span-7">
          <AuditAnalysisGrid records={sampleRecords} />
        </div>
      </div>
    </div>
  );
}