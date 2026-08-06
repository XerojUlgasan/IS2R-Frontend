import React, { useState } from "react";
import { addMaterialStock } from "../../api/material.api";

// Modal for replenishing a material's stock. Shows material details and
// collects quantity + mfg_price for the incoming batch.
function AddStockModal({ material, onClose, onSaved, onUnauthorized }) {
  const [form, setForm] = useState({ quantity: "", mfg_price: "" });
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

    const quantity = Number(form.quantity);
    if (!form.quantity || Number.isNaN(quantity) || quantity <= 0) {
      setFieldError("Enter a quantity greater than 0.");
      return;
    }

    const mfgPrice = Number(form.mfg_price);
    if (form.mfg_price === "" || Number.isNaN(mfgPrice) || mfgPrice < 0) {
      setFieldError("Enter a valid manufacturing price.");
      return;
    }
    setFieldError("");

    const payload = { quantity, mfg_price: mfgPrice };

    setSubmitting(true);
    try {
      const data = await addMaterialStock(material.id, payload);
      onSaved(data.material);
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
            <h2 className="font-headline-lg text-headline-md text-on-surface uppercase tracking-tight">Add Stock</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Record an incoming batch for this material.</p>
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

        {/* Material details */}
        <div className="border border-outline-variant bg-surface-container p-md flex flex-col gap-xs">
          <span className="font-body-md text-body-md text-on-surface font-bold">{material.name || "Untitled material"}</span>
          <div className="flex gap-lg font-body-sm text-body-sm text-on-surface-variant">
            <span>Type: {material.type}</span>
            <span>Unit: {material.unit}</span>
            <span>On hand: {material.quantity ?? 0}</span>
          </div>
        </div>

        <form className="flex flex-col gap-md" onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-xs">
            <label className={labelClass} htmlFor="quantity">
              Quantity <span className="text-error">*</span>
            </label>
            <input className={fieldClass} id="quantity" type="number" min="0" step="any" placeholder="0" value={form.quantity} onChange={handleChange} />
            {fieldError && <span className="font-body-sm text-body-sm text-error">{fieldError}</span>}
          </div>

          <div className="flex flex-col gap-xs">
            <label className={labelClass} htmlFor="mfg_price">
              Mfg Price (₱) <span className="text-error">*</span>
            </label>
            <input className={fieldClass} id="mfg_price" type="number" min="0" step="any" placeholder="0.00" value={form.mfg_price} onChange={handleChange} />
          </div>

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
                  Adding...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">add_box</span>
                  Add Stock
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStockModal;
