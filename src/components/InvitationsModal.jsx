import React, { useState } from "react";
import Modal from "./Modal";

// A single invitation row with accept/decline actions and an inline
// confirmation step. Busy state disables both actions while a request runs.
function InvitationRow({ invite, onAccept, onDecline }) {
  // null = no confirmation shown, "accept" | "decline" = awaiting confirmation.
  const [confirming, setConfirming] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const run = async (action) => {
    setBusy(true);
    setError(null);
    try {
      if (action === "accept") {
        await onAccept(invite);
      } else {
        await onDecline(invite);
      }
      // On success the parent removes this invite from the list, so no local
      // state reset is needed.
    } catch (err) {
      setError(err?.message || "Something went wrong, try again.");
      setBusy(false);
      setConfirming(null);
    }
  };

  return (
    <li className="border-2 border-outline-variant p-md flex flex-col gap-sm">
      <div className="flex items-center gap-md">
        <div className="w-[40px] h-[40px] shrink-0 bg-surface border border-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-[22px] text-primary">domain</span>
        </div>
        <div className="flex flex-col gap-xs min-w-0">
          <span className="font-label-md text-label-md text-on-surface uppercase tracking-wide truncate">
            {invite.name}
          </span>
          {invite.role && (
            <span className="font-body-sm text-body-sm text-on-surface-variant">Invited as {invite.role}</span>
          )}
        </div>
      </div>

      {error && <p className="font-body-sm text-body-sm text-error">{error}</p>}

      {confirming ? (
        <div className="flex flex-col gap-sm bg-surface-container-low border border-outline-variant p-sm">
          <p className="font-body-sm text-body-sm text-on-surface">
            {confirming === "accept"
              ? `Join "${invite.name}"?`
              : `Decline the invitation to "${invite.name}"? This can't be undone.`}
          </p>
          <div className="flex gap-sm">
            <button
              type="button"
              disabled={busy}
              onClick={() => run(confirming)}
              className={`flex-1 px-md py-sm font-label-md text-label-md uppercase tracking-wider border-2 transition-colors disabled:opacity-50 ${
                confirming === "accept"
                  ? "bg-primary text-on-primary border-primary hover:bg-surface hover:text-primary"
                  : "bg-error text-on-error border-error hover:bg-surface hover:text-error"
              }`}
            >
              {busy ? "Working..." : confirming === "accept" ? "Confirm join" : "Confirm decline"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => setConfirming(null)}
              className="px-md py-sm font-label-md text-label-md uppercase tracking-wider border-2 border-outline text-on-surface-variant hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-sm">
          <button
            type="button"
            onClick={() => setConfirming("accept")}
            className="flex-1 px-md py-sm bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider border-2 border-primary hover:bg-surface hover:text-primary transition-colors flex items-center justify-center gap-xs"
          >
            <span className="material-symbols-outlined text-[18px]">check</span>
            Accept
          </button>
          <button
            type="button"
            onClick={() => setConfirming("decline")}
            className="flex-1 px-md py-sm bg-surface text-error font-label-md text-label-md uppercase tracking-wider border-2 border-error hover:bg-error hover:text-on-error transition-colors flex items-center justify-center gap-xs"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
            Decline
          </button>
        </div>
      )}
    </li>
  );
}

// Invitations modal shown from the workspace switcher. Uses the shared
// brutalist Modal shell. Lists pending workspace invitations (businesses whose
// membership status is "pending") or an empty state.
function InvitationsModal({ onClose, invitations = [], onAccept, onDecline }) {
  return (
    <Modal title="Invitations" subtitle="Workspace invitations awaiting your response." onClose={onClose}>
      {invitations.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-sm py-xl text-center">
          <span className="material-symbols-outlined text-on-surface-variant text-[40px]">mail</span>
          <p className="font-body-md text-body-md text-on-surface">No pending invitations</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">You have no workspace invitations right now.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-sm">
          {invitations.map((invite) => (
            <InvitationRow key={invite.id} invite={invite} onAccept={onAccept} onDecline={onDecline} />
          ))}
        </ul>
      )}
    </Modal>
  );
}

export default InvitationsModal;
