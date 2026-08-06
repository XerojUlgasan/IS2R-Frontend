import React, { useState } from "react";
import { createSale } from "../../api/sales.api";
import { SALE_STATUS_OPTIONS } from "../../constants/saleOptions";
import MaterialSearchSelect from "../materials/MaterialSearchSelect";

// Modal for recording a sale. The material is chosen via search but only its
// id is submitted. Fields: material, quantity, total, status, remarks.
function RecordSaleModal({ businessId, onClose, onSaved, onUnauthorized }) {
  const [material, setMaterial] = useState(null); // { id, name }
  const [form, setForm] = useState({
    qty_used: "",
    total_amount: "",
    status: SALE_STATUS_OPTIONS[0].value,
    remarks: "",
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

    if (!material) {
      setFieldError("Select a material.");
      return;
    }
    const qty = Number(form.qty_used);
    if (!form.qty_used || Number.isNaN(qty) || qty <= 0) {
      setFieldError("Enter a quantity greater than 0.");
      return;
    }
    const total = Number(form.total_amount);
    if (form.total_amount === "" || Number.isNaN(total) || total < 0) {
      setFieldError("Enter a valid total amount.");
      return;
    }
    setFieldError("");

    setSubmitting(true);
    try {
      const data = await createSale(businessId, {
        materialId: material.id,
        qty_used: qty,
        total_amount: total,
        status: form.status,
        remarks: form.remarks.trim() || undefined,
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
        className="w-full max-w-lg bg-surface-container-lowest border-2 border-primary p-xl flex flex-col gap-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-xs">
            <h2 className="font-headline-lg text-headline-md text-on-surface uppercase tracking-tight">Record Sale</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Log material usage and its charge.</p>
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
            <label className={labelClass}>
              Material <span className="text-error">*</span>
            </label>
            <MaterialSearchSelect businessId={businessId} value={material} onChange={setMaterial} />
          </div>

          <div className="grid grid-cols-2 gap-md">
            <div className="flex flex-col gap-xs">
              <label className={labelClass} htmlFor="qty_used">
                Quantity <span className="text-error">*</span>
              </label>
              <input className={fieldClass} id="qty_used" type="number" min="0" step="any" placeholder="0" value={form.qty_used} onChange={handleChange} />
            </div>
            <div className="flex flex-col gap-xs">
              <label className={labelClass} htmlFor="total_amount">
                Total (₱) <span className="text-error">*</span>
              </label>
              <input className={fieldClass} id="total_amount" type="number" min="0" step="any" placeholder="0.00" value={form.total_amount} onChange={handleChange} />
            </div>
          </div>

          <div className="flex flex-col gap-xs">
            <label className={labelClass} htmlFor="status">
              Status
            </label>
            <select className={fieldClass} id="status" value={form.status} onChange={handleChange}>
              {SALE_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-xs">
            <label className={labelClass} htmlFor="remarks">
              Remarks
            </label>
            <textarea
              className={`${fieldClass} resize-none`}
              id="remarks"
              rows={4}
              placeholder="Optional notes about this sale..."
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
                  Recording...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Record Sale
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RecordSaleModal;
