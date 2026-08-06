import React, { useState } from "react";
import { createMaterial, updateMaterial } from "../../api/material.api";
import { MATERIAL_TYPE_OPTIONS, MATERIAL_UNIT_OPTIONS } from "../../constants/materialOptions";

// Modal for creating or editing a material's core fields: name, type, unit.
// mode: "create" (needs businessId) | "edit" (needs material).
function MaterialFormModal({ mode, businessId, material, onClose, onSaved, onUnauthorized }) {
  const isEdit = mode === "edit";
  const [form, setForm] = useState({
    name: material?.name || "",
    type: material?.type || MATERIAL_TYPE_OPTIONS[0].value,
    unit: material?.unit || MATERIAL_UNIT_OPTIONS[0],
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

    if (!form.name.trim()) {
      setFieldError("Material name is required.");
      return;
    }
    setFieldError("");

    const payload = { name: form.name.trim(), type: form.type, unit: form.unit };

    setSubmitting(true);
    try {
      const data = isEdit
        ? await updateMaterial(material.id, payload)
        : await createMaterial(businessId, payload);
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
            <h2 className="font-headline-lg text-headline-md text-on-surface uppercase tracking-tight">
              {isEdit ? "Edit Material" : "Add Material"}
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {isEdit ? "Update the material's name, type, and unit." : "Register a new raw material."}
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
            <label className={labelClass} htmlFor="name">
              Name <span className="text-error">*</span>
            </label>
            <input className={fieldClass} id="name" type="text" placeholder="Premium Matte Canvas Roll" value={form.name} onChange={handleChange} />
            {fieldError && <span className="font-body-sm text-body-sm text-error">{fieldError}</span>}
          </div>

          <div className="grid grid-cols-2 gap-md">
            <div className="flex flex-col gap-xs">
              <label className={labelClass} htmlFor="type">
                Type
              </label>
              <select className={fieldClass} id="type" value={form.type} onChange={handleChange}>
                {MATERIAL_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-xs">
              <label className={labelClass} htmlFor="unit">
                Unit
              </label>
              <select className={fieldClass} id="unit" value={form.unit} onChange={handleChange}>
                {MATERIAL_UNIT_OPTIONS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
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
                  Saving...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">{isEdit ? "check" : "add"}</span>
                  {isEdit ? "Save Changes" : "Add Material"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MaterialFormModal;
