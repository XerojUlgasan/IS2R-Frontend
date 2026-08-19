import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useActiveBusiness } from "../context/ActiveBusinessContext";
import { useStocks, STOCKS_PAGE_SIZE } from "../hooks/useStocks";
import { usePermissions } from "../hooks/usePermissions";
import { STOCK_STATUS_OPTIONS } from "../constants/stockOptions";
import { clearMaterialSearchCache } from "../hooks/useMaterialSearch";
import StocksFiltersModal from "../components/stocks/StocksFiltersModal";
import AddStockEntryModal from "../components/stocks/AddStockEntryModal";
import StockHistoryModal from "../components/stocks/StockHistoryModal";
import EditStockModal from "../components/stocks/EditStockModal";
import DeleteStockDialog from "../components/stocks/DeleteStockDialog";

const EMPTY_FILTERS = {
  status: "",
  materialId: "",
  dateFrom: "",
  dateTo: "",
  material: null,
};

function formatNumber(value) {
  if (value === null || value === undefined || value === "") return "—";
  const num = Number(value);
  if (Number.isNaN(num)) return "—";
  return num.toLocaleString();
}

function formatPrice(value) {
  if (value === null || value === undefined || value === "") return "—";
  const num = Number(value);
  if (Number.isNaN(num)) return "—";
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function statusLabel(value) {
  const opt = STOCK_STATUS_OPTIONS.find(
    (o) => o.value === String(value).toUpperCase(),
  );
  return opt ? opt.label : value || "—";
}

// Derives a status when the backend omits it: remaining > 0 => AVAILABLE.
function resolveStatus(stock) {
  if (stock.status) return String(stock.status).toUpperCase();
  const remaining =
    (Number(stock.quantity) || 0) - (Number(stock.quantity_sold) || 0);
  return remaining > 0 ? "AVAILABLE" : "CONSUMED";
}

function StockStatusBadge({ status }) {
  if (status === "AVAILABLE") {
    return (
      <span className="inline-flex items-center px-sm py-xs bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest">
        Available
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-sm py-xs border border-outline-variant bg-surface-container text-on-surface-variant font-label-md text-label-md uppercase tracking-widest">
      {statusLabel(status)}
    </span>
  );
}

function Stocks() {
  const navigate = useNavigate();
  const { activeBusiness } = useActiveBusiness();
  const businessId = activeBusiness?.id;

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddStock, setShowAddStock] = useState(false);
  const [historyStock, setHistoryStock] = useState(null);
  const [editStock, setEditStock] = useState(null);
  const [deleteStockItem, setDeleteStockItem] = useState(null);

  const { stocks, total, totalPages, loading, error, refetch } = useStocks(
    businessId,
    page,
    filters,
  );
  const { can } = usePermissions();

  const goToLogin = useCallback(() => navigate("/login"), [navigate]);

  useEffect(() => {
    if (error && error.status === 401) goToLogin();
  }, [error, goToLogin]);

  const applyFilters = (next) => {
    setFilters(next);
    setPage(1);
    setShowFilters(false);
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

  // A new stock batch changes material quantities/status, so clear the material
  // search cache and refresh the list.
  const handleStockAdded = () => {
    clearMaterialSearchCache();
    setShowAddStock(false);
    refetch();
  };

  const handleStockMutated = () => {
    clearMaterialSearchCache();
    setEditStock(null);
    setDeleteStockItem(null);
    refetch();
  };

  const hasDateFilter = filters.dateFrom || filters.dateTo;
  const hasActiveFilters =
    filters.status || filters.materialId || hasDateFilter;
  const dateChipLabel = `${filters.dateFrom || "…"} → ${filters.dateTo || "…"}`;

  // No workspace chosen yet.
  if (!businessId) {
    return (
      <div className="flex flex-col items-center justify-center gap-md min-h-[60vh] px-4 text-center">
        <span className="material-symbols-outlined text-[32px] text-primary">
          package_2
        </span>
        <h2 className="font-headline-md text-headline-md text-primary">
          No workspace selected
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
          Choose a business to view its stock history.
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
      <div className="mb-md flex flex-col gap-md md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col">
          <h2 className="font-headline-lg text-headline-lg text-primary tracking-tighter">
            Stock History
          </h2>
          <p className="mt-xs max-w-2xl font-body-md text-body-md text-on-surface-variant">
            Every stock batch recorded across your materials, with quantities,
            manufacturing cost, and consumption.
          </p>
        </div>
        <div className="flex flex-col gap-sm sm:flex-row sm:items-center">
          <button
            onClick={() => setShowFilters(true)}
            className="flex h-11 items-center justify-center gap-sm border border-outline bg-surface px-md text-on-surface font-label-md text-label-md uppercase tracking-widest whitespace-nowrap transition-colors hover:bg-surface-container-highest"
          >
            <span className="material-symbols-outlined text-[18px]">
              filter_list
            </span>
            Filter
          </button>
          <button
            onClick={() => setShowAddStock(true)}
            disabled={!can("add_stocks")}
            title={
              can("add_stocks")
                ? "Add Stock"
                : "You don't have permission to add stock"
            }
            className="flex h-11 items-center justify-center gap-sm border-none bg-primary px-md text-on-primary font-label-md text-label-md uppercase tracking-widest whitespace-nowrap transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-primary"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Stock
          </button>
        </div>
      </div>

      {/* Active filters + result count */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
        <div className="col-span-1 md:col-span-3 flex flex-wrap items-center gap-sm p-sm bg-surface-container-low border border-primary/20 min-h-[48px]">
          <span className="font-label-md text-label-md text-on-surface-variant uppercase ml-xs">
            Active Filters:
          </span>
          {!hasActiveFilters && (
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              None
            </span>
          )}
          {filters.status && (
            <div className="flex items-center gap-xs px-sm py-xs bg-surface border border-outline-variant">
              <span className="font-label-md text-label-md text-primary">
                Status: {statusLabel(filters.status)}
              </span>
              <span
                onClick={() => removeFilter("status")}
                className="material-symbols-outlined text-[14px] text-on-surface-variant cursor-pointer hover:text-error"
              >
                close
              </span>
            </div>
          )}
          {hasDateFilter && (
            <div className="flex items-center gap-xs px-sm py-xs bg-surface border border-outline-variant">
              <span className="font-label-md text-label-md text-primary">
                Date: {dateChipLabel}
              </span>
              <span
                onClick={() => removeFilter("date")}
                className="material-symbols-outlined text-[14px] text-on-surface-variant cursor-pointer hover:text-error"
              >
                close
              </span>
            </div>
          )}
          {filters.materialId && (
            <div className="flex items-center gap-xs px-sm py-xs bg-surface border border-outline-variant">
              <span className="font-label-md text-label-md text-primary">
                Material: {filters.material?.name || "Selected"}
              </span>
              <span
                onClick={() => removeFilter("material")}
                className="material-symbols-outlined text-[14px] text-on-surface-variant cursor-pointer hover:text-error"
              >
                close
              </span>
            </div>
          )}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="ml-auto font-label-md text-label-md text-error uppercase hover:underline p-xs"
            >
              Clear All
            </button>
          )}
        </div>
        <div className="col-span-1 flex justify-end items-center px-sm text-on-surface-variant font-label-md text-label-md uppercase">
          {loading ? "Loading..." : `${total} entr${total === 1 ? "y" : "ies"}`}
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto border border-outline bg-surface-container-lowest flex-1 flex flex-col min-h-0">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline">
              <th className="py-md px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest w-1/4">
                Material
              </th>
              <th className="py-md px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest text-right">
                Quantity
              </th>
              <th className="py-md px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest text-right">
                Consumed
              </th>
              <th className="py-md px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest text-right">
                Remaining
              </th>
              <th className="py-md px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest text-right">
                Mfg Price (₱)
              </th>
              <th className="py-md px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
                Status
              </th>
              <th className="py-md px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
                Date Stocked
              </th>
              <th className="py-md px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline">
            {loading && (
              <tr>
                <td
                  colSpan={8}
                  className="p-xl text-center text-on-surface-variant"
                >
                  <span className="material-symbols-outlined animate-spin align-middle mr-sm">
                    refresh
                  </span>
                  Loading stock history...
                </td>
              </tr>
            )}

            {!loading && error && error.status !== 401 && (
              <tr>
                <td colSpan={8} className="p-xl text-center">
                  <div className="flex flex-col items-center gap-md">
                    <span className="material-symbols-outlined text-[32px] text-error">
                      error
                    </span>
                    <p className="font-body-md text-on-surface">
                      {error.message || "Something went wrong, try again."}
                    </p>
                    <button
                      onClick={refetch}
                      className="px-lg py-md bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest border border-primary hover:bg-surface hover:text-primary transition-colors flex items-center gap-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        refresh
                      </span>
                      Retry
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {!loading && !error && stocks.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="p-xl text-center text-on-surface-variant"
                >
                  {hasActiveFilters
                    ? "No stock entries match the current filters."
                    : "No stock recorded yet."}
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              stocks.map((stock) => {
                const s = resolveStatus(stock);
                const consumed = s !== "AVAILABLE";
                const sold = Number(stock.quantity_sold) || 0;
                const remaining = (Number(stock.quantity) || 0) - sold;
                const materialName =
                  stock.material_name ||
                  stock.material?.name ||
                  "Untitled material";
                const isOlderThanOneDay = stock.created_at
                  ? Date.now() - new Date(stock.created_at).getTime() >
                    24 * 60 * 60 * 1000
                  : false;
                return (
                  <tr
                    key={stock.id}
                    className="hover:bg-surface-container transition-colors border-b border-outline"
                  >
                    <td className="py-md px-md">
                      <div className="flex items-center gap-md">
                        <div className="w-10 h-10 bg-surface-container flex items-center justify-center border border-outline shrink-0">
                          <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                            package_2
                          </span>
                        </div>
                        <span
                          className={`font-body-md text-body-md text-on-surface font-bold ${consumed ? "opacity-50" : ""}`}
                        >
                          {materialName}
                        </span>
                      </div>
                    </td>
                    <td
                      className={`py-md px-md font-body-md text-body-md text-on-surface font-bold text-right ${consumed ? "opacity-50" : ""}`}
                    >
                      {formatNumber(stock.quantity)}
                    </td>
                    <td
                      className={`py-md px-md font-body-sm text-body-sm text-on-surface-variant text-right ${consumed ? "opacity-50" : ""}`}
                    >
                      {formatNumber(sold)}
                    </td>
                    <td
                      className={`py-md px-md font-body-md text-body-md font-bold text-right ${remaining <= 0 ? "text-error" : "text-on-surface"} ${consumed ? "opacity-50" : ""}`}
                    >
                      {formatNumber(remaining)}
                    </td>
                    <td
                      className={`py-md px-md font-body-md text-body-md text-on-surface font-mono text-right ${consumed ? "opacity-50" : ""}`}
                    >
                      {formatPrice(stock.mfg_price)}
                    </td>
                    <td className="py-md px-md">
                      <StockStatusBadge status={s} />
                    </td>
                    <td
                      className={`py-md px-md font-body-sm text-body-sm text-on-surface-variant ${consumed ? "opacity-50" : ""}`}
                    >
                      {formatDate(stock.created_at || stock.createdAt)}
                    </td>
                    <td className="py-md px-md text-right">
                      <div className="flex items-center justify-end gap-xs">
                        <button
                          onClick={() => setEditStock(stock)}
                          disabled={!can("update_stocks") || isOlderThanOneDay}
                          className="w-7 h-7 flex items-center justify-center border border-outline-variant hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-outline-variant disabled:hover:text-inherit"
                          title={
                            !can("update_stocks")
                              ? "You don't have permission to update stocks"
                              : isOlderThanOneDay
                                ? "Cannot edit stocks older than 1 day"
                                : "Edit"
                          }
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            edit
                          </span>
                        </button>
                        <button
                          onClick={() => setDeleteStockItem(stock)}
                          disabled={!can("delete_stocks") || isOlderThanOneDay}
                          className="w-7 h-7 flex items-center justify-center border border-outline-variant hover:border-error hover:text-error transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-outline-variant disabled:hover:text-inherit"
                          title={
                            !can("delete_stocks")
                              ? "You don't have permission to delete stocks"
                              : isOlderThanOneDay
                                ? "Cannot delete stocks older than 1 day"
                                : "Delete"
                          }
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            delete
                          </span>
                        </button>
                        <button
                          onClick={() => setHistoryStock(stock)}
                          className="inline-flex items-center gap-xs px-md py-sm border border-outline text-on-surface hover:border-primary hover:text-primary transition-colors font-label-md text-label-md uppercase tracking-widest"
                          title="View consumption history"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            history
                          </span>
                          History
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {/* Pagination Footer */}
        <div className="mt-auto border-t border-outline p-md flex items-center justify-between bg-surface-container-lowest">
          <div className="font-label-md text-label-md text-on-surface-variant uppercase">
            Page {page} of {Math.max(totalPages, 1)}
            <span className="ml-sm normal-case tracking-normal text-[11px]">
              ({STOCKS_PAGE_SIZE} / page)
            </span>
          </div>
          <div className="flex gap-xs">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="w-8 h-8 flex items-center justify-center border border-outline text-on-surface hover:bg-surface-container disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">
                chevron_left
              </span>
            </button>
            <span className="w-8 h-8 flex items-center justify-center border border-outline bg-primary text-on-primary font-body-sm">
              {page}
            </span>
            <button
              onClick={() =>
                setPage((p) =>
                  totalPages ? Math.min(totalPages, p + 1) : p + 1,
                )
              }
              disabled={page >= totalPages || loading}
              className="w-8 h-8 flex items-center justify-center border border-outline text-on-surface hover:bg-surface-container disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>

      {showFilters && (
        <StocksFiltersModal
          businessId={businessId}
          initial={filters}
          onClose={() => setShowFilters(false)}
          onApply={applyFilters}
        />
      )}
      {showAddStock && (
        <AddStockEntryModal
          businessId={businessId}
          onClose={() => setShowAddStock(false)}
          onSaved={handleStockAdded}
          onUnauthorized={goToLogin}
        />
      )}
      {historyStock && (
        <StockHistoryModal
          businessId={businessId}
          stock={historyStock}
          onClose={() => setHistoryStock(null)}
        />
      )}
      {editStock && (
        <EditStockModal
          stock={editStock}
          businessId={businessId}
          onClose={() => setEditStock(null)}
          onSaved={handleStockMutated}
          onUnauthorized={goToLogin}
        />
      )}
      {deleteStockItem && (
        <DeleteStockDialog
          stock={deleteStockItem}
          businessId={businessId}
          onClose={() => setDeleteStockItem(null)}
          onDeleted={handleStockMutated}
          onUnauthorized={goToLogin}
        />
      )}
    </div>
  );
}

export default Stocks;
