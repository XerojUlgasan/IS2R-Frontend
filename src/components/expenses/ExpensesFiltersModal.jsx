import React, { useState } from "react";
import { EXPENSE_CATEGORY_OPTIONS } from "../../constants/expenseOptions";
import DateRangePresets from "../DateRangePresets";

// Modal for filtering expenses by date range and category.
// `initial` seeds the current filter values; `onApply` receives the new filters.
function ExpensesFiltersModal({ initial, onClose, onApply }) {
  const [category, setCategory] = useState(initial?.category || "");
  const [dateFrom, setDateFrom] = useState(initial?.dateFrom || "");
  const [dateTo, setDateTo] = useState(initial?.dateTo || "");

  const handleApply = (e) => {
    e.preventDefault();
    onApply({ category, dateFrom, dateTo });
  };

  const handleClear = () => {
    onApply({ category: "", dateFrom: "", dateTo: "" });
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
            <h2 className="font-headline-lg text-headline-md text-on-surface uppercase tracking-tight">Filter Expenses</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Narrow the ledger by date, status, or category.</p>
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
            dateFrom={dateFrom}
            dateTo={dateTo}
            onSelect={(from, to) => {
              setDateFrom(from);
              setDateTo(to);
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
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
            <label className={labelClass} htmlFor="category">
              Category
            </label>
            <select className={fieldClass} id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All categories</option>
              {EXPENSE_CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col-reverse gap-sm pt-md border-t border-outline-variant mt-sm sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={handleClear}
              className="w-full sm:w-auto px-lg py-md border border-error text-error font-label-md text-label-md uppercase tracking-widest hover:bg-error-container transition-colors"
            >
              Clear All
            </button>
            <div className="flex flex-col gap-sm sm:flex-row">
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

export default ExpensesFiltersModal;
