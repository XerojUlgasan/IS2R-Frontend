import React, { useState } from "react";
import DateRangePresets from "../DateRangePresets";

// Modal for querying calendar data by custom date range.
// `onApply` receives the fromDate and toDate as ISO date strings.
function DateRangeModal({ onClose, onApply }) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleApply = (e) => {
    e.preventDefault();
    if (!fromDate || !toDate) {
      alert("Please select both from and to dates");
      return;
    }
    if (new Date(fromDate) > new Date(toDate)) {
      alert("From date must be before or equal to to date");
      return;
    }
    onApply(fromDate, toDate);
  };

  const fieldClass =
    "w-full bg-surface-container border border-outline-variant p-md font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:border-2 transition-all";
  const labelClass = "font-label-md text-label-md uppercase tracking-widest text-on-surface-variant";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-sm sm:p-md" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-surface-container-lowest border-2 border-primary p-md sm:p-xl flex flex-col gap-md sm:gap-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-sm sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-xs">
            <h2 className="font-headline-lg text-headline-md text-on-surface uppercase tracking-tight">Custom Date Range</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Query calendar data for a specific date range.</p>
          </div>
          <button
            onClick={onClose}
            className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors"
            aria-label="Close"
            type="button"
          >
            close
          </button>
        </div>

        <form className="flex flex-col gap-md" onSubmit={handleApply}>
          <DateRangePresets
            dateFrom={fromDate}
            dateTo={toDate}
            onSelect={(from, to) => {
              setFromDate(from);
              setToDate(to);
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            <div className="flex flex-col gap-xs">
              <label className={labelClass} htmlFor="fromDate">
                Date From
              </label>
              <input className={fieldClass} id="fromDate" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>
            <div className="flex flex-col gap-xs">
              <label className={labelClass} htmlFor="toDate">
                Date To
              </label>
              <input className={fieldClass} id="toDate" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-sm pt-md border-t border-outline-variant mt-sm sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-lg py-md border border-primary text-primary font-label-md text-label-md uppercase tracking-widest hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-lg py-md bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest border border-primary hover:bg-surface-container-lowest hover:text-primary transition-colors flex items-center justify-center gap-sm"
            >
              <span className="material-symbols-outlined text-[18px]">search</span>
              Query Range
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DateRangeModal;