import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useActiveBusiness } from "../context/ActiveBusinessContext";
import { useAuditLogs, AUDIT_PAGE_SIZE } from "../hooks/useAuditLogs";
import { actionLabel, actionBadgeClass } from "../constants/auditActions";
import AuditFiltersModal from "../components/audit/AuditFiltersModal";
import AuditDiffModal from "../components/audit/AuditDiffModal";

const EMPTY_FILTERS = { action: "", dateFrom: "", dateTo: "", search: "" };

// Formats a timestamp as "YYYY-MM-DD h:mm:ss AM/PM".
function formatTimestamp(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const time = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true });
  return `${yyyy}-${mm}-${dd} ${time}`;
}

function actorName(log) {
  return log.actor_name || log.actorName || "System";
}

function AuditLogs() {
  const navigate = useNavigate();
  const { activeBusiness } = useActiveBusiness();
  const businessId = activeBusiness?.id;

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [searchInput, setSearchInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [diffLog, setDiffLog] = useState(null);

  const { logs, total, totalPages, loading, error, refetch } = useAuditLogs(businessId, page, filters);

  const goToLogin = useCallback(() => navigate("/login"), [navigate]);

  useEffect(() => {
    if (error && error.status === 401) goToLogin();
  }, [error, goToLogin]);

  // Debounce the search box into the active filters.
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters((f) => {
        if (f.search === searchInput.trim()) return f;
        return { ...f, search: searchInput.trim() };
      });
      setPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [searchInput]);

  const applyFilters = (next) => {
    setFilters((f) => ({ ...f, ...next }));
    setPage(1);
    setShowFilters(false);
  };

  const removeFilter = (key) => {
    if (key === "date") {
      setFilters((f) => ({ ...f, dateFrom: "", dateTo: "" }));
    } else if (key === "search") {
      setSearchInput("");
      setFilters((f) => ({ ...f, search: "" }));
    } else {
      setFilters((f) => ({ ...f, [key]: "" }));
    }
    setPage(1);
  };

  const clearAllFilters = () => {
    setSearchInput("");
    setFilters(EMPTY_FILTERS);
    setPage(1);
  };

  const hasDateFilter = filters.dateFrom || filters.dateTo;
  const hasActiveFilters = filters.action || hasDateFilter || filters.search;
  const dateChipLabel = `${filters.dateFrom || "…"} → ${filters.dateTo || "…"}`;

  // No workspace chosen yet.
  if (!businessId) {
    return (
      <div className="flex flex-col items-center justify-center gap-md min-h-[60vh] text-center">
        <span className="material-symbols-outlined text-[32px] text-primary">receipt_long</span>
        <h2 className="font-headline-md text-headline-md text-primary">No workspace selected</h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
          Choose a business to view its audit logs.
        </p>
        <Link
          to="/my-businesses"
          className="px-lg py-md bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest border border-primary hover:bg-surface hover:text-primary transition-colors"
        >
          Select Workspace
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full max-w-7xl mx-auto gap-lg">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md border-b border-primary pb-md mt-lg">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary uppercase tracking-tighter">Audit Logs</h2>
          <p className="font-body-md text-body-md text-surface-tint mt-xs">System-wide immutable record of critical events.</p>
        </div>
        {/* Controls */}
        <div className="flex items-center gap-md">
          <div className="relative flex items-center border border-primary bg-surface-container-lowest">
            <span className="material-symbols-outlined text-[18px] text-surface-tint pl-sm">search</span>
            <input
              className="bg-transparent border-none focus:outline-none focus:ring-0 font-body-sm text-body-sm text-primary py-sm px-sm w-64 placeholder:text-surface-tint"
              placeholder="Search events..."
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-sm px-md py-sm bg-primary text-on-primary hover:bg-surface-tint transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            <span className="font-label-md text-label-md uppercase">Filter</span>
          </button>
        </div>
      </div>

      {/* Active Filters Bar */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-sm py-sm">
          <span className="font-label-md text-label-md text-surface-tint uppercase tracking-widest mr-sm">Active Filters:</span>
          {filters.action && (
            <div className="flex items-center gap-xs px-sm py-xs border border-primary bg-surface-container-low">
              <span className="font-label-md text-label-md text-primary">Type: {actionLabel(filters.action)}</span>
              <span onClick={() => removeFilter("action")} className="material-symbols-outlined text-[14px] cursor-pointer hover:text-error">close</span>
            </div>
          )}
          {hasDateFilter && (
            <div className="flex items-center gap-xs px-sm py-xs border border-primary bg-surface-container-low">
              <span className="font-label-md text-label-md text-primary">Date: {dateChipLabel}</span>
              <span onClick={() => removeFilter("date")} className="material-symbols-outlined text-[14px] cursor-pointer hover:text-error">close</span>
            </div>
          )}
          {filters.search && (
            <div className="flex items-center gap-xs px-sm py-xs border border-primary bg-surface-container-low">
              <span className="font-label-md text-label-md text-primary">Search: “{filters.search}”</span>
              <span onClick={() => removeFilter("search")} className="material-symbols-outlined text-[14px] cursor-pointer hover:text-error">close</span>
            </div>
          )}
          <button onClick={clearAllFilters} className="font-label-md text-label-md text-surface-tint hover:text-primary uppercase underline ml-sm">Clear All</button>
        </div>
      )}

      {/* Data Table */}
      <div className="border border-primary bg-surface-container-lowest overflow-hidden flex-1 flex flex-col">
        <div className="grid grid-cols-12 gap-sm px-md py-sm bg-surface-container border-b border-primary items-center">
          <div className="col-span-3 font-label-md text-label-md text-primary uppercase tracking-tighter">Action / Type</div>
          <div className="col-span-5 font-label-md text-label-md text-primary uppercase tracking-tighter">Description</div>
          <div className="col-span-2 font-label-md text-label-md text-primary uppercase tracking-tighter">Actor</div>
          <div className="col-span-1 font-label-md text-label-md text-primary uppercase tracking-tighter text-right">Timestamp</div>
          <div className="col-span-1" />
        </div>

        <div className="flex-1 overflow-y-auto bg-surface-bright flex flex-col divide-y divide-primary">
          {loading && (
            <div className="flex items-center justify-center gap-sm py-xl text-surface-tint">
              <span className="material-symbols-outlined animate-spin">refresh</span>
              <span className="font-body-md">Loading events...</span>
            </div>
          )}

          {!loading && error && error.status !== 401 && (
            <div className="flex flex-col items-center justify-center gap-md py-xl text-center">
              <span className="material-symbols-outlined text-[32px] text-error">error</span>
              <p className="font-body-md text-primary">{error.message || "Something went wrong, try again."}</p>
              <button
                onClick={refetch}
                className="px-lg py-md bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest border border-primary hover:bg-surface hover:text-primary transition-colors flex items-center gap-sm"
              >
                <span className="material-symbols-outlined text-[18px]">refresh</span>
                Retry
              </button>
            </div>
          )}

          {!loading && !error && logs.length === 0 && (
            <div className="flex items-center justify-center py-xl text-surface-tint font-body-md">
              {hasActiveFilters ? "No events match the current filters." : "No events recorded yet."}
            </div>
          )}

          {!loading &&
            !error &&
            logs.map((log) => (
              <div key={log.id} className="grid grid-cols-12 gap-sm px-md py-md hover:bg-surface-container-low transition-colors items-start">
                <div className="col-span-3">
                  <div className={`inline-flex px-sm py-xs font-label-md text-[10px] uppercase tracking-widest ${actionBadgeClass(log.action)}`}>
                    {actionLabel(log.action)}
                  </div>
                </div>
                <div className="col-span-5">
                  <p className="font-body-sm text-body-sm text-primary">{log.description || "—"}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-body-sm text-body-sm text-primary">{actorName(log)}</p>
                </div>
                <div className="col-span-1 text-right">
                  <p className="font-body-sm text-body-sm text-primary font-mono">{formatTimestamp(log.created_at || log.createdAt)}</p>
                </div>
                <div className="col-span-1 flex justify-end">
                  {(log.previous_object || log.new_object) && (
                    <button
                      onClick={() => setDiffLog(log)}
                      title="Compare changes"
                      className="flex items-center gap-xs px-xs py-xs border border-primary text-primary hover:bg-surface-container transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">difference</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* Pagination Footer */}
        <div className="border-t border-primary bg-surface-container-lowest p-md flex items-center justify-between">
          <p className="font-body-sm text-surface-tint">
            {loading ? "Loading..." : `${total} event${total === 1 ? "" : "s"} · Page ${page} of ${Math.max(totalPages, 1)}`}
            <span className="ml-sm text-[11px]">({AUDIT_PAGE_SIZE} / page)</span>
          </p>
          <div className="flex items-center gap-xs">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="w-8 h-8 flex items-center justify-center border border-primary text-surface-tint hover:bg-surface-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <span className="w-8 h-8 flex items-center justify-center bg-primary text-on-primary font-label-md">{page}</span>
            <button
              onClick={() => setPage((p) => (totalPages ? Math.min(totalPages, p + 1) : p + 1))}
              disabled={page >= totalPages || loading}
              className="w-8 h-8 flex items-center justify-center border border-primary text-primary hover:bg-surface-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {showFilters && <AuditFiltersModal initial={filters} onClose={() => setShowFilters(false)} onApply={applyFilters} />}
      {diffLog && <AuditDiffModal log={diffLog} onClose={() => setDiffLog(null)} />}
    </div>
  );
}

export default AuditLogs;
