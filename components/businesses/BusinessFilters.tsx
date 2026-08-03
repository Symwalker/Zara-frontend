import { Search } from "lucide-react";

interface FilterProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  selectedCity: string;
  setSelectedCity: (v: string) => void;
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  selectedStatus: string;
  setSelectedStatus: (v: string) => void;
}

export function BusinessFilters({
  searchQuery,
  setSearchQuery,
  selectedCity,
  setSelectedCity,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
}: FilterProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Search business name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 font-medium"
        />
      </div>

      <select
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none font-medium"
      >
        <option value="All">All Cities</option>
        <option value="Karachi">Karachi</option>
        <option value="Lahore">Lahore</option>
        <option value="Islamabad">Islamabad</option>
        <option value="Multan">Multan</option>
      </select>

      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none font-medium"
      >
        <option value="All">All Categories</option>
        <option value="HVAC & Repair">HVAC & Repair</option>
        <option value="IT Services">IT Services</option>
        <option value="Plumbing">Plumbing</option>
        <option value="Fashion & Retail">Fashion & Retail</option>
        <option value="Catering">Catering</option>
      </select>

      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none font-medium"
      >
        <option value="All">All Statuses</option>
        <option value="📧 Email Sent">📧 Email Sent</option>
        <option value="🔥 Hot Lead">🔥 Hot Lead</option>
        <option value="⏭️ Skipped (Has Site)">⏭️ Skipped (Has Site)</option>
        <option value="⚠️ No Email Found">⚠️ No Email Found</option>
      </select>
    </div>
  );
}