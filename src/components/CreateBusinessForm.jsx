import React, { useState } from "react";
import { useCreateBusiness } from "../hooks/useCreateBusiness";

// Modal form for creating a business. Validates `name` client-side (mirrors the
// backend rule) but still surfaces server errors as the source of truth.
function CreateBusinessForm({ onClose, onCreated, onUnauthorized }) {
  const { submit, submitting, error, setError } = useCreateBusiness();
  const [form, setForm] = useState({
    name: "",
    description: "",
    contact_number: "",
    address: "",
  });
  const [nameError, setNameError] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setNameError("Business name is required.");
      return;
    }
    setNameError("");

    try {
      const business = await submit({
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        contact_number: form.contact_number.trim() || undefined,
        address: form.address.trim() || undefined,
      });
      onCreated(business);
    } catch (err) {
      if (err && err.status === 401) onUnauthorized();
      // Other errors render inline via `error` below.
    }
  };

  const fieldClass =
    "w-full bg-surface-container border border-outline-variant p-md font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:border-2 transition-all";
  const labelClass = "font-label-md text-label-md uppercase tracking-widest text-on-surface-variant";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-md" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-surface-container-lowest border-2 border-primary p-xl flex flex-col gap-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-xs">
            <h2 className="font-headline-lg text-headline-md text-on-surface uppercase tracking-tight">New Workspace</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Create a new business you'll own.</p>
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
            <label className={labelClass} htmlFor="name">
              Business Name <span className="text-error">*</span>
            </label>
            <input className={fieldClass} id="name" type="text" placeholder="ABC Printing" value={form.name} onChange={handleChange} />
            {nameError && <span className="font-body-sm text-body-sm text-error">{nameError}</span>}
          </div>

          <div className="flex flex-col gap-xs">
            <label className={labelClass} htmlFor="description">
              Description
            </label>
            <textarea
              className={`${fieldClass} resize-none`}
              id="description"
              rows={2}
              placeholder="Tarpaulin and sticker printing shop"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div className="flex flex-col gap-xs">
              <label className={labelClass} htmlFor="contact_number">
                Contact Number
              </label>
              <input
                className={fieldClass}
                id="contact_number"
                type="tel"
                placeholder="09171234567"
                value={form.contact_number}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-xs">
              <label className={labelClass} htmlFor="address">
                Address
              </label>
              <input
                className={fieldClass}
                id="address"
                type="text"
                placeholder="Quezon City, Philippines"
                value={form.address}
                onChange={handleChange}
              />
            </div>
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
                  Creating...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Create Workspace
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateBusinessForm;
