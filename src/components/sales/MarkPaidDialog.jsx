import React, { useState } from "react";
import { updateSale } from "../../api/sales.api";

// Confirmation dialog for marking a sale as paid.
function MarkPaidDialog({ sale, onClose, onUpdated, onUnauthorized }) {
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await updateSale(sale.id, { status: "PAID" });
      onUpdated(sale.id);
    } catch (err) {
      if (err && err.status === 401) return onUnauthorized();
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const label = sale.material_name || sale.material?.name || "this sale";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-md" onClick={onClose}>
      <div
        className="w-full max-w-md bg-surface-container-lowest border-2 border-primary p-xl flex flex-col gap-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-md">
          <span className="material-symbols-outlined text-[32px] text-primary">paid</span>
          <div className="flex flex-col gap-xs">
            <h2 className="font-headline-lg text-headline-md text-on-surface uppercase tracking-tight">Mark as Paid</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Mark the sale for <span className="font-bold text-on-surface">{label}</span> as paid?
            </p>
          </div>
        </div>

        {error && (
          <div className="border border-error bg-error-container text-on-error-container p-sm font-body-sm text-body-sm flex items-start gap-sm">
            <span className="material-symbols-outlined text-[18px] text-error">error</span>
            <span>{error.message}</span>
          </div>
        )}

        <div className="flex justify-end gap-sm pt-md border-t border-outline-variant">
          <button
            type="button"
            onClick={onClose}
            className="px-lg py-md border border-primary text-primary font-label-md text-label-md uppercase tracking-widest hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className="px-lg py-md bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest border border-primary hover:bg-surface-container-lowest hover:text-primary transition-colors flex items-center gap-sm disabled:opacity-60 disabled:pointer-events-none"
          >
            {submitting ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                Marking...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">check</span>
                Mark Paid
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MarkPaidDialog;
