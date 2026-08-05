import React from "react";

// Renders a single business: logo (or placeholder), name (or fallback), role badge.
function BusinessCard({ business, onSelect }) {
  const name = business.name || "Untitled workspace";
  const role = business.role || "MEMBER";

  // OWNER gets the solid high-contrast badge; other roles use the outline badge.
  const badgeClass =
    role === "OWNER"
      ? "bg-primary text-on-primary"
      : "bg-surface-container-highest border border-primary text-primary";

  return (
    <div className="group relative flex flex-col justify-between p-lg bg-surface-container border border-outline-variant hover:border-primary transition-colors duration-200 cursor-pointer min-h-[200px]">
      <div className="absolute top-lg right-lg">
        <span
          className={`inline-flex items-center justify-center px-sm py-xs font-label-md text-label-md uppercase tracking-widest ${badgeClass}`}
        >
          {role}
        </span>
      </div>
      <div className="flex items-start gap-md mb-xl">
        <div className="w-xl h-xl bg-surface-container-highest border border-outline flex items-center justify-center shrink-0 overflow-hidden group-hover:bg-primary transition-colors duration-200">
          {business.logo_img_loc ? (
            <img
              className="w-full h-full object-cover mix-blend-multiply group-hover:invert transition-all duration-200"
              alt={`${name} logo`}
              src={business.logo_img_loc}
            />
          ) : (
            <span className="material-symbols-outlined text-[24px] text-primary group-hover:text-on-primary transition-colors duration-200">
              storefront
            </span>
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <h2 className="font-headline-md text-headline-md text-primary truncate">{name}</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant truncate">Workspace</p>
        </div>
      </div>
      <button
        onClick={() => onSelect(business)}
        className="w-full py-md px-lg bg-surface border border-primary text-primary font-label-md text-label-md uppercase tracking-wider group-hover:bg-primary group-hover:text-on-primary transition-colors duration-200 flex items-center justify-between"
      >
        <span>Select Workspace</span>
        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
      </button>
    </div>
  );
}

export default BusinessCard;
