import React from "react";

// Brutalist modal shell per DESIGN.md: solid 40% black backdrop, 2px black border.
// Clicking the backdrop closes; clicking inside does not.
function Modal({ title, subtitle, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-md" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-surface-container-lowest border-2 border-primary p-xl flex flex-col gap-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-xs">
            <h2 className="font-headline-lg text-headline-md text-on-surface uppercase tracking-tight">{title}</h2>
            {subtitle && <p className="font-body-sm text-body-sm text-on-surface-variant">{subtitle}</p>}
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
        {children}
      </div>
    </div>
  );
}

export default Modal;
