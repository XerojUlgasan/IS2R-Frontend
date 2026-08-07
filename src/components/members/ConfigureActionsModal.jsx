import React, { useState } from "react";
import PermissionsPicker from "./PermissionsPicker";

// Modal for configuring a member's allowed actions, grouped by domain
// (Materials, Stocks, Sales, Members). `member.permissions` seeds the picker;
// on save the updated array is reported back.
function ConfigureActionsModal({ member, onClose, onSave }) {
  const [permissions, setPermissions] = useState(member.permissions || []);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await onSave(member, permissions);
    } catch (err) {
      if (err && err.status === 401) return; // caller handles redirect
      setError(err);
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-md" onClick={onClose}>
      <div
        className="w-full max-w-2xl bg-surface-container-lowest border-2 border-primary p-xl flex flex-col gap-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-xs">
            <h2 className="font-headline-lg text-headline-md text-on-surface uppercase tracking-tight">Configure Allowed Actions</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Set what <span className="font-bold text-on-surface">{member.name || "this member"}</span> is permitted to do.
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

        <PermissionsPicker value={permissions} onChange={setPermissions} />

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
            onClick={handleSave}
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
                <span className="material-symbols-outlined text-[18px]">check</span>
                Save Permissions
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfigureActionsModal;
