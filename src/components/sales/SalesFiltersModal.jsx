import React, { useState } from "react";
import { SALE_STATUS_OPTIONS } from "../../constants/saleOptions";
import MaterialSearchSelect from "../materials/MaterialSearchSelect";

// Modal for filtering the sales ledger by date range, status, and material.
// `initial` seeds the current filter values; `onApply` receives the new filters.
function SalesFiltersModal({ businessId, initial, onClose, onApply }) {
  const [status, setStatus] = useState(initial?.status || "");
  const [dateFrom, setDateFrom] = useState(initial?.dateFrom || "");
  const [dateTo, setDateTo] = useState(initial?.dateTo || "");
  const [material, setMaterial] = useState(initial?.material || null); // { id, name }

  const handleApply = (e) => {
    e.preventDefault();
    onApply({
      status,
      dateFrom,
      dateTo,
      materialId: material?.id || "",
      material: material || null,
    });
  };

  const handleClear = () => {
    onApply({ status: "", dateFrom: "", dateTo: "", materialId: "", material: null });
  };

  const fieldClass =
    "w-full bg-surface-container border border-outline-variant p-md font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:border-2 transition-all";
  const labelClass = "font-label-md text-label-md uppercase tracking-widest text-on-surface-variant";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-md" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-surface-container-lowest border-2 border-primary p-xl flex flex-col gap-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-xs">
            <h2 className="font-headline-lg text-headline-md text-on-surface uppercase tracking-tight">Filter Sales</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Narrow the ledger by date, status, or material.</p>
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
          <div className="grid grid-cols-2 gap-md">
            <div className="flex flex-col gap-xs">
              <label className={labelClass} htmlFor="dateFrom">
                Date From
              </label>
              <input className={fieldClass} id="dateFrom" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div className="flex flex-col gap-xs">
              <label className={labelClass} htmlFor="dateTo">
                Date To
              </label>
              <input className={fieldClass} id="dateTo" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
          </div>

          <div className="flex flex-col gap-xs">
            <label className={labelClass} htmlFor="status">
              Status
            </label>
            <select className={fieldClass} id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All statuses</option>
              {SALE_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-xs">
            <label className={labelClass}>Material</label>
            <MaterialSearchSelect businessId={businessId} value={material} onChange={setMaterial} placeholder="Any material..." />
          </div>

          <div className="flex justify-between gap-sm pt-md border-t border-outline-variant mt-sm">
            <button
              type="button"
              onClick={handleClear}
              className="px-lg py-md border border-error text-error font-label-md text-label-md uppercase tracking-widest hover:bg-error-container transition-colors"
            >
              Clear All
            </button>
            <div className="flex gap-sm">
              <button
                type="button"
                onClick={onClose}
                className="px-lg py-md border border-primary text-primary font-label-md text-label-md uppercase tracking-widest hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-lg py-md bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest border border-primary hover:bg-surface-container-lowest hover:text-primary transition-colors flex items-center gap-sm"
              >
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                Apply Filters
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SalesFiltersModal;
