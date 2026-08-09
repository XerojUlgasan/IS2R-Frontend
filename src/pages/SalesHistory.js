import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useActiveBusiness } from "../context/ActiveBusinessContext";
import { useSales, SALES_PAGE_SIZE } from "../hooks/useSales";
import { usePermissions } from "../hooks/usePermissions";
import { SALE_STATUS_OPTIONS } from "../constants/saleOptions";
import RecordSaleModal from "../components/sales/RecordSaleModal";
import SalesFiltersModal from "../components/sales/SalesFiltersModal";
import DeleteSaleDialog from "../components/sales/DeleteSaleDialog";
import MarkPaidDialog from "../components/sales/MarkPaidDialog";

const EMPTY_FILTERS = { status: "", materialId: "", dateFrom: "", dateTo: "", material: null };

function formatAmount(value) {
  if (value === null || value === undefined || value === "") return "—";
  const num = Number(value);
  if (Number.isNaN(num)) return "—";
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "2-digit", day: "2-digit" });
}

function statusLabel(value) {
  const opt = SALE_STATUS_OPTIONS.find((o) => o.value === String(value).toUpperCase());
  return opt ? opt.label : value || "—";
}

function SaleStatusBadge({ status }) {
  const s = String(status || "").toUpperCase();
  if (s === "PAID") {
    return (
      <span className="inline-block px-sm py-xs bg-primary text-on-primary font-label-md text-[10px] uppercase tracking-widest">
        Paid
      </span>
    );
  }
  return (
    <span className="inline-block px-sm py-xs border border-primary text-primary font-label-md text-[10px] uppercase tracking-widest">
      {statusLabel(status)}
    </span>
  );
}

function SalesHistory() {
  const navigate = useNavigate();
  const { activeBusiness } = useActiveBusiness();
  const businessId = activeBusiness?.id;

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(1);
  // Seed the status filter from a deep link (e.g. Dashboard "Pending Payments"
  // → /sales-history?status=PENDING).
  const [filters, setFilters] = useState(() => {
    const status = String(searchParams.get("status") || "").toUpperCase();
    return { ...EMPTY_FILTERS, status: status === "PENDING" || status === "PAID" ? status : "" };
  });
  const [modal, setModal] = useState(null); // "record" | "filters" | { type: "delete", sale }

  const { sales, total, totalPages, loading, error, refetch } = useSales(businessId, page, filters);
  const { can } = usePermissions();

  const goToLogin = useCallback(() => navigate("/login"), [navigate]);

  useEffect(() => {
    if (error && error.status === 401) goToLogin();
  }, [error, goToLogin]);

  const applyFilters = (next) => {
    setFilters(next);
    setPage(1);
    setModal(null);
  };

  const removeFilter = (key) => {
    if (key === "date") {
      setFilters((f) => ({ ...f, dateFrom: "", dateTo: "" }));
    } else if (key === "material") {
      setFilters((f) => ({ ...f, materialId: "", material: null }));
    } else {
      setFilters((f) => ({ ...f, [key]: "" }));
    }
    setPage(1);
  };

  const clearAllFilters = () => {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  };

  const handleMutated = () => {
    setModal(null);
    refetch();
  };

  const hasDateFilter = filters.dateFrom || filters.dateTo;
  const hasActiveFilters = filters.status || filters.materialId || hasDateFilter;
  const dateChipLabel = `${filters.dateFrom || "…"} → ${filters.dateTo || "…"}`;

  // No workspace chosen yet.
  if (!businessId) {
    return (
      <div className="flex flex-col items-center justify-center gap-md min-h-[60vh] text-center">
        <span className="material-symbols-outlined text-[32px] text-primary">history</span>
        <h2 className="font-headline-md text-headline-md text-primary">No workspace selected</h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
          Choose a business to view its sales ledger.
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
    <div className="flex flex-col w-full h-full gap-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md mb-md">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tighter uppercase mb-xs">Sales Ledger</h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Historical record of material usage and associated charges. Review payment statuses and manage outstanding balances.
          </p>
        </div>
        <div className="flex items-center gap-sm">
          <button
            onClick={() => setModal("filters")}
            className="h-10 px-md bg-surface-container border border-primary flex items-center justify-center gap-xs text-primary font-label-md text-label-md uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            Filters
          </button>
          <button
            onClick={() => setModal("record")}
            disabled={!can("create_sales")}
            title={can("create_sales") ? "Record Sale" : "You don't have permission to record sales"}
            className="h-10 px-md bg-primary flex items-center justify-center gap-xs text-on-primary font-label-md text-label-md uppercase tracking-widest hover:bg-surface-container hover:text-primary hover:border hover:border-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:hover:text-on-primary disabled:hover:border-0"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Record Sale
          </button>
        </div>
      </div>

      {/* Active filters + result count */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-md mb-lg">
        <div className="col-span-1 md:col-span-3 flex flex-wrap items-center gap-sm p-sm bg-surface-container-low border border-primary/20 min-h-[48px]">
          <span className="font-label-md text-label-md text-on-surface-variant uppercase ml-xs">Active Filters:</span>
          {!hasActiveFilters && <span className="font-body-sm text-body-sm text-on-surface-variant">None</span>}
          {filters.status && (
            <div className="flex items-center gap-xs px-sm py-xs bg-surface border border-outline-variant">
              <span className="font-label-md text-label-md text-primary">Status: {statusLabel(filters.status)}</span>
              <span onClick={() => removeFilter("status")} className="material-symbols-outlined text-[14px] text-on-surface-variant cursor-pointer hover:text-error">close</span>
            </div>
          )}
          {hasDateFilter && (
            <div className="flex items-center gap-xs px-sm py-xs bg-surface border border-outline-variant">
              <span className="font-label-md text-label-md text-primary">Date: {dateChipLabel}</span>
              <span onClick={() => removeFilter("date")} className="material-symbols-outlined text-[14px] text-on-surface-variant cursor-pointer hover:text-error">close</span>
            </div>
          )}
          {filters.materialId && (
            <div className="flex items-center gap-xs px-sm py-xs bg-surface border border-outline-variant">
              <span className="font-label-md text-label-md text-primary">Material: {filters.material?.name || "Selected"}</span>
              <span onClick={() => removeFilter("material")} className="material-symbols-outlined text-[14px] text-on-surface-variant cursor-pointer hover:text-error">close</span>
            </div>
          )}
          {hasActiveFilters && (
            <button onClick={clearAllFilters} className="ml-auto font-label-md text-label-md text-error uppercase hover:underline p-xs">
              Clear All
            </button>
          )}
        </div>
        <div className="col-span-1 flex justify-end items-center px-sm text-on-surface-variant font-label-md text-label-md uppercase">
          {loading ? "Loading..." : `${total} result${total === 1 ? "" : "s"}`}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-surface border border-primary flex-1 flex flex-col min-h-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface-container border-b border-primary">
                <th className="p-md font-label-md text-label-md text-primary uppercase tracking-widest w-[180px]">Material</th>
                <th className="p-md font-label-md text-label-md text-primary uppercase tracking-widest text-right">Qty Used</th>
                <th className="p-md font-label-md text-label-md text-primary uppercase tracking-widest text-right">Total (₱)</th>
                <th className="p-md font-label-md text-label-md text-primary uppercase tracking-widest text-center w-[120px]">Status</th>
                <th className="p-md font-label-md text-label-md text-primary uppercase tracking-widest max-w-[200px]">Remarks</th>
                <th className="p-md font-label-md text-label-md text-primary uppercase tracking-widest">Created By</th>
                <th className="p-md font-label-md text-label-md text-primary uppercase tracking-widest w-[140px]">Date</th>
                <th className="p-md w-[80px]"></th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-body-sm text-on-surface">
              {loading && (
                <tr>
                  <td colSpan={8} className="p-xl text-center text-on-surface-variant">
                    <span className="material-symbols-outlined animate-spin align-middle mr-sm">refresh</span>
                    Loading sales...
                  </td>
                </tr>
              )}

              {!loading && error && error.status !== 401 && (
                <tr>
                  <td colSpan={8} className="p-xl text-center">
                    <div className="flex flex-col items-center gap-md">
                      <span className="material-symbols-outlined text-[32px] text-error">error</span>
                      <p className="font-body-md text-on-surface">{error.message || "Something went wrong, try again."}</p>
                      <button
                        onClick={refetch}
                        className="px-lg py-md bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest border border-primary hover:bg-surface hover:text-primary transition-colors flex items-center gap-sm"
                      >
                        <span className="material-symbols-outlined text-[18px]">refresh</span>
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {!loading && !error && sales.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-xl text-center text-on-surface-variant">
                    {hasActiveFilters ? "No sales match the current filters." : "No sales recorded yet."}
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                sales.map((sale) => {
                  const materialName = sale.material_name || sale.material?.name || "Untitled material";
                  const isPaid = String(sale.status || "").toUpperCase() === "PAID";
                  const createdBy = sale.created_by_name || sale.createdByName || "—";
                  return (
                    <tr key={sale.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors group">
                      <td className="p-md font-headline-md text-label-md font-bold truncate">{materialName}</td>
                      <td className="p-md text-right font-mono text-on-surface-variant">{sale.qty_used ?? "—"}</td>
                      <td className="p-md text-right font-mono text-primary font-bold">{formatAmount(sale.total_amount)}</td>
                      <td className="p-md text-center">
                        <SaleStatusBadge status={sale.status} />
                      </td>
                      <td className="p-md truncate max-w-[200px] text-on-surface-variant" title={sale.remarks || ""}>
                        {sale.remarks || "-"}
                      </td>
                      <td className="p-md text-on-surface-variant">{createdBy}</td>
                      <td className="p-md font-mono text-on-surface-variant">{formatDate(sale.created_at || sale.createdAt)}</td>
                      <td className="p-md text-right">
                        <div className="flex items-center justify-end gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          {!isPaid && (
                            <button
                              onClick={() => setModal({ type: "paid", sale })}
                              disabled={!can("update_sales")}
                              className="w-7 h-7 flex items-center justify-center border border-outline-variant hover:border-primary hover:bg-primary hover:text-on-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-outline-variant disabled:hover:bg-transparent disabled:hover:text-inherit"
                              title={can("update_sales") ? "Mark Paid" : "You don't have permission to update sales"}
                            >
                              <span className="material-symbols-outlined text-[16px]">check</span>
                            </button>
                          )}
                          <button
                            onClick={() => setModal({ type: "delete", sale })}
                            disabled={!can("delete_sales")}
                            className="w-7 h-7 flex items-center justify-center border border-outline-variant hover:border-error hover:text-error transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-outline-variant disabled:hover:text-inherit"
                            title={can("delete_sales") ? "Delete" : "You don't have permission to delete sales"}
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="mt-auto border-t border-primary p-md flex items-center justify-between bg-surface-container-lowest">
          <div className="font-label-md text-label-md text-on-surface-variant uppercase">
            Page {page} of {Math.max(totalPages, 1)}
            <span className="ml-sm normal-case tracking-normal text-[11px]">({SALES_PAGE_SIZE} / page)</span>
          </div>
          <div className="flex gap-xs">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="w-8 h-8 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <span className="w-8 h-8 flex items-center justify-center bg-primary text-on-primary font-label-md text-label-md">{page}</span>
            <button
              onClick={() => setPage((p) => (totalPages ? Math.min(totalPages, p + 1) : p + 1))}
              disabled={page >= totalPages || loading}
              className="w-8 h-8 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal === "record" && (
        <RecordSaleModal businessId={businessId} onClose={() => setModal(null)} onSaved={handleMutated} onUnauthorized={goToLogin} />
      )}
      {modal === "filters" && (
        <SalesFiltersModal businessId={businessId} initial={filters} onClose={() => setModal(null)} onApply={applyFilters} />
      )}
      {modal?.type === "delete" && (
        <DeleteSaleDialog sale={modal.sale} onClose={() => setModal(null)} onDeleted={handleMutated} onUnauthorized={goToLogin} />
      )}
      {modal?.type === "paid" && (
        <MarkPaidDialog sale={modal.sale} onClose={() => setModal(null)} onUpdated={handleMutated} onUnauthorized={goToLogin} />
      )}
    </div>
  );
}

export default SalesHistory;
