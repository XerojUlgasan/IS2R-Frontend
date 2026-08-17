import React, { useState } from "react";

// `members` is the full members list, used to compute remaining headroom.
function ConfigureShareholderModal({ member, members = [], onClose, onSave }) {
  const [percentage, setPercentage] = useState(
    member.cut_by_percentage != null ? String(member.cut_by_percentage) : ""
  );
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Remaining headroom: 100 minus every other member's cut.
  const used = members
    .filter((m) => m.id !== member.id && m.cut_by_percentage != null)
    .reduce((sum, m) => sum + Number(m.cut_by_percentage), 0);
  const remaining = 100 - used;

  const handleSave = async () => {
    const val = Number(percentage);
    if (Number.isNaN(val) || val < 0 || val > 100) {
      setError({ message: "Percentage must be between 0 and 100." });
      return;
    }
    if (val > remaining) {
      setError({ message: `Only ${remaining.toFixed(2)}% is available.` });
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await onSave(member, val);
    } catch (err) {
      if (err && err.status === 401) return;
      setError(err);
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-md" onClick={onClose}>
      <div
        className="w-full max-w-sm bg-surface-container-lowest border-2 border-primary p-xl flex flex-col gap-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-xs">
            <h2 className="font-headline-lg text-headline-md text-on-surface uppercase tracking-tight">
              {member.role === "Owner" ? "Owner Cut" : "Shareholder Cut"}
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Set the profit share percentage for <span className="font-bold text-on-surface">{member.name || "this member"}</span>.
            </p>
          </div>
          <button onClick={onClose} className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors" type="button">
            close
          </button>
        </div>

        <div className="flex flex-col gap-xs">
          <div className="flex items-center justify-between">
            <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
              Percentage Cut (%)
            </label>
            <span className="font-label-md text-label-md text-on-surface-variant">
              {remaining.toFixed(2)}% available
            </span>
          </div>
          <div className="relative flex items-center">
            <input
              type="number"
              min="0"
              max={remaining}
              step="0.01"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              className="w-full border border-surface-variant bg-background py-2 px-md pr-8 font-body-md text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
              placeholder="0.00"
            />
            <span className="absolute right-3 font-body-md text-on-surface-variant">%</span>
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
                Save
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfigureShareholderModal;
