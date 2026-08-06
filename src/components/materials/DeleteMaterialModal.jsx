import React from "react";
import Modal from "../Modal";
import { useDeleteMaterial } from "../../hooks/useMaterialMutations";

// Confirmation modal for deleting a material.
function DeleteMaterialModal({ material, onClose, onDeleted, onUnauthorized }) {
  const { remove, submitting, error } = useDeleteMaterial();

  const handleDelete = async () => {
    try {
      await remove(material.id);
      onDeleted(material.id);
    } catch (err) {
      if (err && err.status === 401) onUnauthorized();
    }
  };

  return (
    <Modal title="Delete Material" subtitle="This action cannot be undone." onClose={onClose}>
      <p className="font-body-md text-body-md text-on-surface">
        Are you sure you want to delete{" "}
        <span className="font-bold">{material.name || "this material"}</span>? It will be permanently removed from this
        workspace.
      </p>

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
    </Modal>
  );
}

export default DeleteMaterialModal;
