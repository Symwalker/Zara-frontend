"use client";

export type WebsiteBucket = "all" | "no_website" | "has_website";

const BUCKETS: { value: WebsiteBucket; label: string }[] = [
  { value: "all", label: "All" },
  { value: "no_website", label: "No Website" },
  { value: "has_website", label: "Has Website" },
];

export function WebsiteFilter({
  value,
  onChange,
  counts,
}: {
  value: WebsiteBucket;
  onChange: (b: WebsiteBucket) => void;
  counts?: Partial<Record<WebsiteBucket, number>>;
}) {
  return (
    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1">
      {BUCKETS.map((b) => (
        <button
          key={b.value}
          onClick={() => onChange(b.value)}
          className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors ${
            value === b.value ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {b.label}
          {counts && counts[b.value] != null ? ` (${counts[b.value]})` : ""}
        </button>
      ))}
    </div>
  );
}
