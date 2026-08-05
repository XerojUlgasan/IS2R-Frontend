import React from "react";

// Minimal on-brand placeholder for sidebar destinations that had no source design
// (Pending Payments, Inventory Reports, Invitations). Kept intentionally sparse to
// match the Minimalist-Brutalist system without inventing new UI.
function ComingSoon({ title }) {
  return (
    <div className="flex flex-col w-full h-full min-h-[calc(100vh-64px)] items-center justify-center gap-lg text-center">
      <div className="w-16 h-16 border border-primary bg-surface flex items-center justify-center">
        <span className="material-symbols-outlined text-[32px] text-primary">construction</span>
      </div>
      <div className="flex flex-col gap-xs">
        <h1 className="font-headline-lg text-headline-lg text-primary uppercase tracking-tight">{title}</h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
          This module is not part of the current design set and is reserved for a future release.
        </p>
      </div>
      <div className="inline-block border border-primary px-sm py-xs font-label-md text-label-md uppercase tracking-widest">
        Coming Soon
      </div>
    </div>
  );
}

export default ComingSoon;
