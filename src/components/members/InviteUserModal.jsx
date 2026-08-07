import React, { useState } from "react";
import PermissionsPicker from "./PermissionsPicker";
import { MEMBER_ROLE_OPTIONS } from "../../constants/memberRoles";

// Modal for inviting a new member. Collects email, role, and allowed actions.
function InviteUserModal({ onClose, onInvite }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(MEMBER_ROLE_OPTIONS[0].value);
  const [permissions, setPermissions] = useState([]);
  const [fieldError, setFieldError] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const trimmed = email.trim();
    // Basic email shape check; the server remains the source of truth.
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setFieldError("Enter a valid email address.");
      return;
    }
    setFieldError("");

    setSubmitting(true);
    try {
      await onInvite({ email: trimmed, role, permissions });
    } catch (err) {
      if (err && err.status === 401) return; // caller handles redirect
      setError(err);
      setSubmitting(false);
    }
  };

  const fieldClass =
    "w-full bg-surface-container border border-outline-variant p-md font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:border-2 transition-all";
  const labelClass = "font-label-md text-label-md uppercase tracking-widest text-on-surface-variant";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-md" onClick={onClose}>
      <div
        className="w-full max-w-2xl bg-surface-container-lowest border-2 border-primary p-xl flex flex-col gap-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-xs">
            <h2 className="font-headline-lg text-headline-md text-on-surface uppercase tracking-tight">Invite User</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Send an invitation and set the member's role and allowed actions.
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div className="flex flex-col gap-xs">
              <label className={labelClass} htmlFor="email">
                Email <span className="text-error">*</span>
              </label>
              <input
                className={fieldClass}
                id="email"
                type="email"
                autoComplete="off"
                placeholder="operator@monolith.print"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-xs">
              <label className={labelClass} htmlFor="role">
                Role
              </label>
              <select className={fieldClass} id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                {MEMBER_ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-sm">
            <span className={labelClass}>Allowed Actions</span>
            <PermissionsPicker value={permissions} onChange={setPermissions} />
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
                  Sending...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  Send Invite
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InviteUserModal;
