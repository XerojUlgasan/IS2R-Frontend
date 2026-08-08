import React from "react";

// Quick date-range presets shared across the filter modals. Each button sets
// dateFrom = today - (days - 1) and dateTo = today (inclusive) as YYYY-MM-DD.
// 7D and 1W intentionally map to the same 7-day window.
const PRESETS = [
  { label: "1D", days: 1 },
  { label: "3D", days: 3 },
  { label: "7D", days: 7 },
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
];

function toISODate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function rangeForDays(days) {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - (days - 1)); // include today in the window
  return { from: toISODate(from), to: toISODate(to) };
}

function DateRangePresets({ dateFrom, dateTo, onSelect, label = "Quick Range" }) {
  const labelClass = "font-label-md text-label-md uppercase tracking-widest text-on-surface-variant";

  const isActive = (days) => {
    const { from, to } = rangeForDays(days);
    return dateFrom === from && dateTo === to;
  };

  return (
    <div className="flex flex-col gap-xs">
      <span className={labelClass}>{label}</span>
      <div className="flex flex-wrap gap-xs">
        {PRESETS.map((preset) => {
          const active = isActive(preset.days);
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                const { from, to } = rangeForDays(preset.days);
                onSelect(from, to);
              }}
              className={`px-md py-sm font-label-md text-label-md uppercase tracking-widest border transition-colors ${
                active
                  ? "bg-primary text-on-primary border-primary"
                  : "bg-surface-container border-outline-variant text-on-surface hover:border-primary hover:text-primary"
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default DateRangePresets;
