import React, { useState } from "react";

// Confirmation modal for removing a member. The user must type the member's
// exact email before the destructive action is enabled.
function RemoveMemberModal({ member, onClose, onConfirm }) {
  const [typed, setTyped] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const targetEmail = (member.email || "").trim();
  const matches = typed.trim().toLowerCase() === targetEmail.toLowerCase() && targetEmail !== "";

  const handleConfirm = async () => {
    if (!matches) return;
    setError(null);
    setSubmitting(true);
    try {
      await onConfirm(member);
    } catch (err) {
      if (err && err.status === 401) return; // caller handles redirect
      setError(err);
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
            <h2 className="font-headline-lg text-headline-md text-on-surface uppercase tracking-tight">Remove Member</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              You're about to remove <span className="font-bold text-on-surface">{member.name || "this member"}</span> from
              the workspace. This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant" htmlFor="confirmEmail">
            Type <span className="font-mono text-primary normal-case tracking-normal">{targetEmail}</span> to confirm
          </label>
          <input
            id="confirmEmail"
            type="email"
            autoComplete="off"
            className="w-full bg-surface-container border border-outline-variant p-md font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:border-2 transition-all"
            placeholder={targetEmail}
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
          />
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
            disabled={!matches || submitting}
            className="px-lg py-md bg-error text-on-error font-label-md text-label-md uppercase tracking-widest border border-error hover:bg-surface-container-lowest hover:text-error transition-colors flex items-center gap-sm disabled:opacity-50 disabled:pointer-events-none"
          >
            {submitting ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                Removing...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">person_remove</span>
                Remove Member
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RemoveMemberModal;
