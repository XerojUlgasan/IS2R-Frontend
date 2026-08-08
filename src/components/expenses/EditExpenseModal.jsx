import React, { useState } from "react";
import { updateExpense } from "../../api/expense.api";
import { EXPENSE_CATEGORY_OPTIONS } from "../../constants/expenseOptions";

// Modal for editing an expense. Fields: title, category, amount, remarks.
function EditExpenseModal({ expense, onClose, onSaved, onUnauthorized }) {
  const [form, setForm] = useState({
    title: expense.title || "",
    category: String(expense.category || EXPENSE_CATEGORY_OPTIONS[0].value).toUpperCase(),
    amount: expense.amount ?? "",
    remarks: expense.remarks || "",
  });
  const [fieldError, setFieldError] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.title.trim()) {
      setFieldError("Enter a title for this expense.");
      return;
    }
    const amount = Number(form.amount);
    if (form.amount === "" || Number.isNaN(amount) || amount < 0 || !Number.isInteger(amount)) {
      setFieldError("Enter a valid whole amount (₱).");
      return;
    }
    setFieldError("");

    setSubmitting(true);
    try {
      const data = await updateExpense(expense.id, {
        title: form.title.trim(),
        category: form.category,
        amount,
        remarks: form.remarks.trim() || undefined,
      });
      onSaved(data.expense);
    } catch (err) {
      if (err && err.status === 401) return onUnauthorized();
      setError(err);
    } finally {
      setSubmitting(false);
    }
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
            <h2 className="font-headline-lg text-headline-md text-on-surface uppercase tracking-tight">Edit Expense</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Update this expense's details.</p>
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

        <form className="flex flex-col gap-md" onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-xs">
            <label className={labelClass} htmlFor="title">
              Title <span className="text-error">*</span>
            </label>
            <input className={fieldClass} id="title" type="text" placeholder="e.g. Ink cartridge restock" value={form.title} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-2 gap-md">
            <div className="flex flex-col gap-xs">
              <label className={labelClass} htmlFor="category">
                Category
              </label>
              <select className={fieldClass} id="category" value={form.category} onChange={handleChange}>
                {EXPENSE_CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-xs">
              <label className={labelClass} htmlFor="amount">
                Amount (₱) <span className="text-error">*</span>
              </label>
              <input className={fieldClass} id="amount" type="number" min="0" step="1" placeholder="0" value={form.amount} onChange={handleChange} />
            </div>
          </div>

          <div className="flex flex-col gap-xs">
            <label className={labelClass} htmlFor="remarks">
              Remarks
            </label>
            <textarea
              className={`${fieldClass} resize-none`}
              id="remarks"
              rows={4}
              placeholder="Optional notes about this expense..."
              value={form.remarks}
              onChange={handleChange}
            />
          </div>

          {fieldError && <span className="font-body-sm text-body-sm text-error">{fieldError}</span>}
          {error && (
            <div className="border border-error bg-error-container text-on-error-container p-sm font-body-sm text-body-sm flex items-start gap-sm">
              <span className="material-symbols-outlined text-[18px] text-error">error</span>
              <span>{error.message}</span>
            </div>
          )}

          <div className="flex justify-end gap-sm pt-md border-t border-outline-variant mt-sm">
            <button
              type="button"
              onClick={onClose}
              className="px-lg py-md border border-primary text-primary font-label-md text-label-md uppercase tracking-widest hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-lg py-md bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest border border-primary hover:bg-surface-container-lowest hover:text-primary transition-colors flex items-center gap-sm disabled:opacity-60 disabled:pointer-events-none"
            >
              {submitting ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                  Saving...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditExpenseModal;
