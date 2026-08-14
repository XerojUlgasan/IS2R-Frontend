import React, { useState } from "react";
import { createSale } from "../../api/sales.api";

// Modal for recording rejected material for a specific material row.
// Posts to POST /api/businesses/:businessId/sales with status REJECT and total_amount 0.
function AddRejectModal({ material, businessId, onClose, onSaved, onUnauthorized }) {
  const [qty, setQty] = useState("");
  const [remarks, setRemarks] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const quantity = Number(qty);
    if (!qty || Number.isNaN(quantity) || quantity <= 0) {
      setFieldError("Enter a quantity greater than 0.");
      return;
    }
    setFieldError("");

    setSubmitting(true);
    try {
      const data = await createSale(businessId, {
        materialId: material.id,
        qty_used: quantity,
        total_amount: 0,
        status: "REJECT",
        remarks: remarks.trim() || undefined,
      });
      onSaved(data.sale);
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
        className="w-full max-w-md bg-surface-container-lowest border-2 border-primary p-xl flex flex-col gap-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-xs">
            <h2 className="font-headline-lg text-headline-md text-on-surface uppercase tracking-tight">Add Reject</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Record rejected quantity for <span className="font-bold text-on-surface">{material.name || "this material"}</span>.
            </p>
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
            <label className={labelClass} htmlFor="reject_qty">
              Rejected Quantity <span className="text-error">*</span>
            </label>
            <input
              className={fieldClass}
              id="reject_qty"
              type="number"
              min="0"
              step="any"
              placeholder="0"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-xs">
            <label className={labelClass} htmlFor="reject_remarks">
              Remarks
            </label>
            <textarea
              className={`${fieldClass} resize-none`}
              id="reject_remarks"
              rows={3}
              placeholder="Optional reason for rejection..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
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
              className="px-lg py-md bg-error text-on-error font-label-md text-label-md uppercase tracking-widest border border-error hover:bg-surface-container-lowest hover:text-error transition-colors flex items-center gap-sm disabled:opacity-60 disabled:pointer-events-none"
            >
              {submitting ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                  Saving...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">remove_circle</span>
                  Add Reject
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddRejectModal;
