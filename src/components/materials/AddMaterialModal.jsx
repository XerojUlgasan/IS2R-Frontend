import React, { useState } from "react";
import Modal from "../Modal";
import { useCreateMaterial } from "../../hooks/useMaterialMutations";
import { MATERIAL_TYPES, MATERIAL_UNITS } from "../../constants/materials";

const fieldClass =
  "w-full bg-surface-container border border-outline-variant p-md font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:border-2 transition-all";
const labelClass = "font-label-md text-label-md uppercase tracking-widest text-on-surface-variant";

// Modal to create a new material (name, type, unit).
function AddMaterialModal({ businessId, onClose, onCreated, onUnauthorized }) {
  const { create, submitting, error, setError } = useCreateMaterial(businessId);
  const [name, setName] = useState("");
  const [type, setType] = useState(MATERIAL_TYPES[0].value);
  const [unit, setUnit] = useState(MATERIAL_UNITS[0].value);
  const [nameError, setNameError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setNameError("Material name is required.");
      return;
    }
    setNameError("");

    try {
      const material = await create({ name: name.trim(), type, unit });
      onCreated(material);
    } catch (err) {
      if (err && err.status === 401) onUnauthorized();
    }
  };

  return (
    <Modal title="Add Material" subtitle="Register a new material in this workspace." onClose={onClose}>
      <form className="flex flex-col gap-md" onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-xs">
          <label className={labelClass} htmlFor="name">
            Name <span className="text-error">*</span>
          </label>
          <input
            className={fieldClass}
            id="name"
            type="text"
            placeholder="Premium Matte Canvas Roll"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {nameError && <span className="font-body-sm text-body-sm text-error">{nameError}</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <div className="flex flex-col gap-xs">
            <label className={labelClass} htmlFor="type">
              Type
            </label>
            <select className={fieldClass} id="type" value={type} onChange={(e) => setType(e.target.value)}>
              {MATERIAL_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-xs">
            <label className={labelClass} htmlFor="unit">
              Unit
            </label>
            <select className={fieldClass} id="unit" value={unit} onChange={(e) => setUnit(e.target.value)}>
              {MATERIAL_UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
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
                <span className="material-symbols-outlined text-[18px]">add</span>
                Add Material
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default AddMaterialModal;
