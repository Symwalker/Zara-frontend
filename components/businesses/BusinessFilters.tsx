import { Search, Calendar, Filter } from "lucide-react";

interface FilterProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  selectedCity: string;
  setSelectedCity: (v: string) => void;
  selectedDate: string;
  setSelectedDate: (v: string) => void;
  selectedWebsiteStatus: string;
  setSelectedWebsiteStatus: (v: string) => void;
}

export function BusinessFilters({
  searchQuery,
  setSearchQuery,
  selectedCity,
  setSelectedCity,
  selectedDate,
  setSelectedDate,
  selectedWebsiteStatus,
  setSelectedWebsiteStatus,
}: FilterProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {/* 1. Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Search name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 font-medium"
        />
      </div>

      {/* 2. Date Picker (Calendar filter, no range) */}
      <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
        <Calendar className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full bg-transparent border-none text-xs focus:outline-none font-medium text-slate-700 cursor-pointer"
          style={{ colorScheme: 'light' }}
        />
        {selectedDate && (
          <button 
            onClick={() => setSelectedDate("")}
            className="text-xs text-slate-400 hover:text-slate-600 ml-1 font-bold flex-shrink-0"
            title="Clear date"
          >
            ×
          </button>
        )}
      </div>

      {/* 3. Has Website / No Website Filter */}
      <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
        <Filter className="w-3.5 h-3.5 text-slate-400 mr-2 flex-shrink-0" />
        <select
          value={selectedWebsiteStatus}
          onChange={(e) => setSelectedWebsiteStatus(e.target.value)}
          className="w-full bg-transparent border-none text-xs focus:outline-none font-medium text-slate-700 cursor-pointer"
        >
          <option value="All">All Websites</option>
          <option value="HasWebsite">Has Website</option>
          <option value="NoWebsite">No Website</option>
        </select>
      </div>

      {/* 4. City Filter */}
      <select
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none font-medium text-slate-700 cursor-pointer"
      >
        <option value="All">All Cities</option>
        <option value="Karachi">Karachi</option>
        <option value="Lahore">Lahore</option>
        <option value="Islamabad">Islamabad</option>
        <option value="Peshawar">Peshawar</option>
      </select>
    </div>
  );
}