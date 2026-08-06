import React, { useState } from "react";
import { deleteMaterial } from "../../api/material.api";

// Confirmation dialog for permanently deleting a material.
function DeleteMaterialDialog({ material, onClose, onDeleted, onUnauthorized }) {
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await deleteMaterial(material.id);
      onDeleted(material.id);
    } catch (err) {
      if (err && err.status === 401) return onUnauthorized();
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-md" onClick={onClose}>
      <div
        className="w-full max-w-md bg-surface-container-lowest border-2 border-primary p-xl flex flex-col gap-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-md">
          <span className="material-symbols-outlined text-[32px] text-error">warning</span>
          <div className="flex flex-col gap-xs">
            <h2 className="font-headline-lg text-headline-md text-on-surface uppercase tracking-tight">Delete Material</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Delete <span className="font-bold text-on-surface">{material.name || "this material"}</span>? This action cannot be undone.
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
            onClick={handleDelete}
            disabled={submitting}
            className="px-lg py-md bg-error text-on-error font-label-md text-label-md uppercase tracking-widest border border-error hover:bg-surface-container-lowest hover:text-error transition-colors flex items-center gap-sm disabled:opacity-60 disabled:pointer-events-none"
          >
            {submitting ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                Deleting...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">delete</span>
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteMaterialDialog;
