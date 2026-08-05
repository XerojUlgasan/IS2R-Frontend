import React from "react";
import BusinessCard from "./BusinessCard";

// Skeleton placeholder shown while the list is loading.
function SkeletonCard() {
  return (
    <div className="flex flex-col justify-between p-lg bg-surface-container border border-outline-variant min-h-[200px] animate-pulse">
      <div className="flex items-start gap-md mb-xl">
        <div className="w-xl h-xl bg-surface-container-highest border border-outline shrink-0"></div>
        <div className="flex flex-col gap-sm w-full">
          <div className="h-4 w-2/3 bg-surface-container-highest"></div>
          <div className="h-3 w-1/3 bg-surface-container-highest"></div>
        </div>
      </div>
      <div className="w-full h-10 bg-surface-container-highest"></div>
    </div>
  );
}

// Renders the workspace list across loading / error / empty / populated states.
function BusinessList({ businesses, loading, error, onRetry, onSelect, onCreate }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg auto-rows-fr">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  // 401 is handled by the page (redirect); anything else offers a retry.
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-md p-xl border border-outline-variant bg-surface-container text-center min-h-[200px]">
        <span className="material-symbols-outlined text-[32px] text-error">error</span>
        <p className="font-body-md text-body-md text-on-surface">Something went wrong, try again.</p>
        <button
          onClick={onRetry}
          className="px-lg py-md bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider border border-primary hover:bg-surface hover:text-primary transition-colors flex items-center gap-sm"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          Retry
        </button>
      </div>
    );
  }

  if (businesses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-md p-xl border-2 border-dashed border-outline bg-surface text-center min-h-[240px]">
        <div className="w-[48px] h-[48px] bg-surface border border-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-[24px] text-primary">domain_add</span>
        </div>
        <div className="flex flex-col gap-xs">
          <h2 className="font-headline-md text-headline-md text-primary">No workspaces yet</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">
            You don't belong to any businesses. Create your first workspace to get started.
          </p>
        </div>
        <button
          onClick={onCreate}
          className="px-lg py-md bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider border border-primary hover:bg-surface hover:text-primary transition-colors flex items-center gap-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Create your first workspace
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-lg auto-rows-fr">
      {businesses.map((business) => (
        <BusinessCard key={business.id} business={business} onSelect={onSelect} />
      ))}
      {/* Create New Business Card */}
      <button
        onClick={onCreate}
        className="group flex flex-col justify-center items-center p-lg bg-surface border-2 border-dashed border-outline hover:border-primary hover:bg-surface-container-low transition-all duration-200 cursor-pointer min-h-[200px]"
      >
        <div className="w-[48px] h-[48px] bg-surface border border-primary flex items-center justify-center mb-md group-hover:bg-primary transition-colors duration-200">
          <span className="material-symbols-outlined text-[24px] text-primary group-hover:text-on-primary transition-colors duration-200">
            add
          </span>
        </div>
        <h2 className="font-headline-md text-headline-md text-primary text-center">Create New</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant text-center mt-xs">
          Setup a new production facility
        </p>
      </button>
    </div>
  );
}

export default BusinessList;
