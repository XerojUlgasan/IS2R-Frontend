import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useActiveBusiness } from "../context/ActiveBusinessContext";
import { useExpenses, EXPENSES_PAGE_SIZE } from "../hooks/useExpenses";
import { usePermissions } from "../hooks/usePermissions";
import { EXPENSE_CATEGORY_OPTIONS } from "../constants/expenseOptions";
import RecordExpenseModal from "../components/expenses/RecordExpenseModal";
import EditExpenseModal from "../components/expenses/EditExpenseModal";
import ExpensesFiltersModal from "../components/expenses/ExpensesFiltersModal";
import DeleteExpenseDialog from "../components/expenses/DeleteExpenseDialog";

const EMPTY_FILTERS = { category: "", dateFrom: "", dateTo: "" };

function formatAmount(value) {
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
    month: "2-digit",
    day: "2-digit",
  });
}

function categoryLabel(value) {
  const opt = EXPENSE_CATEGORY_OPTIONS.find(
    (o) => o.value === String(value).toUpperCase(),
  );
  return opt ? opt.label : value || "—";
}

function Expenses() {
  const navigate = useNavigate();
  const { activeBusiness } = useActiveBusiness();
  const businessId = activeBusiness?.id;

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [modal, setModal] = useState(null); // "record" | "filters" | { type: "edit"|"delete", expense }

  const { expenses, total, totalPages, loading, error, refetch } = useExpenses(
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
    setModal(null);
  };

  const removeFilter = (key) => {
    if (key === "date") {
      setFilters((f) => ({ ...f, dateFrom: "", dateTo: "" }));
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
  const hasActiveFilters = filters.category || hasDateFilter;
  const dateChipLabel = `${filters.dateFrom || "…"} → ${filters.dateTo || "…"}`;

  // No workspace chosen yet.
  if (!businessId) {
    return (
      <div className="flex flex-col items-center justify-center gap-md min-h-[60vh] px-4 text-center">
        <span className="material-symbols-outlined text-[32px] text-primary">
          payments
        </span>
        <h2 className="font-headline-md text-headline-md text-primary">
          No workspace selected
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
          Choose a business to view its expense ledger.
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
      <div className="flex flex-col gap-md mb-md md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="mb-xs font-headline-lg text-headline-lg text-primary uppercase tracking-tighter">
            Expenses Ledger
          </h1>
          <p className="max-w-xl font-body-md text-body-md text-on-surface-variant">
            Historical record of business expenses. Review payment statuses and
            manage outstanding balances.
          </p>
        </div>
        <div className="flex flex-col gap-sm sm:flex-row sm:items-center">
          <button
            onClick={() => setModal("filters")}
            className="flex h-11 items-center justify-center gap-xs border border-primary bg-surface-container px-md text-primary font-label-md text-label-md uppercase tracking-widest transition-colors hover:bg-primary hover:text-on-primary"
          >
            <span className="material-symbols-outlined text-[18px]">
              filter_list
            </span>
            Filters
          </button>
          <button
            onClick={() => setModal("record")}
            disabled={!can("add_expense")}
            title={
              can("add_expense")
                ? "Record Expense"
                : "You don't have permission to add expenses"
            }
            className="flex h-11 items-center justify-center gap-xs bg-primary px-md text-on-primary font-label-md text-label-md uppercase tracking-widest transition-colors hover:bg-surface-container hover:text-primary hover:border hover:border-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-primary disabled:hover:text-on-primary disabled:hover:border-0"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Record Expense
          </button>
        </div>
      </div>

      {/* Active filters + result count */}
      <div className="mb-lg grid grid-cols-1 gap-md md:grid-cols-4">
        <div className="col-span-1 flex flex-wrap items-center gap-sm border border-primary/20 bg-surface-container-low p-sm min-h-[48px] md:col-span-3">
          <span className="font-label-md text-label-md text-on-surface-variant uppercase ml-xs">
            Active Filters:
          </span>
          {!hasActiveFilters && (
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              None
            </span>
          )}
          {filters.category && (
            <div className="flex items-center gap-xs px-sm py-xs bg-surface border border-outline-variant">
              <span className="font-label-md text-label-md text-primary">
                Category: {categoryLabel(filters.category)}
              </span>
              <span
                onClick={() => removeFilter("category")}
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
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="ml-auto font-label-md text-label-md text-error uppercase hover:underline p-xs"
            >
              Clear All
            </button>
          )}
        </div>
        <div className="col-span-1 flex items-center justify-start px-sm text-on-surface-variant font-label-md text-label-md uppercase sm:justify-end">
          {loading ? "Loading..." : `${total} result${total === 1 ? "" : "s"}`}
        </div>
      </div>

      {/* Table Container */}
      <div className="flex flex-1 flex-col min-h-0 border border-primary bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse whitespace-nowrap text-left">
            <thead>
              <tr className="bg-surface-container border-b border-primary">
                <th className="p-md font-label-md text-label-md text-primary uppercase tracking-widest w-[200px]">
                  Title
                </th>
                <th className="p-md font-label-md text-label-md text-primary uppercase tracking-widest">
                  Category
                </th>
                <th className="p-md font-label-md text-label-md text-primary uppercase tracking-widest text-right">
                  Amount (₱)
                </th>
                <th className="p-md font-label-md text-label-md text-primary uppercase tracking-widest max-w-[200px]">
                  Remarks
                </th>
                <th className="p-md font-label-md text-label-md text-primary uppercase tracking-widest">
                  Created By
                </th>
                <th className="p-md font-label-md text-label-md text-primary uppercase tracking-widest w-[140px]">
                  Date
                </th>
                <th className="p-md w-[80px]"></th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-body-sm text-on-surface">
              {loading && (
                <tr>
                  <td
                    colSpan={7}
                    className="p-xl text-center text-on-surface-variant"
                  >
                    <span className="material-symbols-outlined animate-spin align-middle mr-sm">
                      refresh
                    </span>
                    Loading expenses...
                  </td>
                </tr>
              )}

              {!loading && error && error.status !== 401 && (
                <tr>
                  <td colSpan={7} className="p-xl text-center">
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

              {!loading && !error && expenses.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="p-xl text-center text-on-surface-variant"
                  >
                    {hasActiveFilters
                      ? "No expenses match the current filters."
                      : "No expenses recorded yet."}
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                expenses.map((expense) => {
                  const createdBy =
                    expense.created_by_name || expense.createdByName || "—";
                  const expenseDate = expense.created_at || expense.createdAt;
                  const isOlderThanOneDay = expenseDate
                    ? Date.now() - new Date(expenseDate).getTime() > 24 * 60 * 60 * 1000
                    : false;
                  return (
                    <tr
                      key={expense.id}
                      className="border-b border-outline-variant hover:bg-surface-container-low transition-colors group"
                    >
                      <td className="p-md font-headline-md text-label-md font-bold truncate">
                        {expense.title || "Untitled expense"}
                      </td>
                      <td className="p-md text-on-surface-variant">
                        {categoryLabel(expense.category)}
                      </td>
                      <td className="p-md text-right font-mono text-primary font-bold">
                        {formatAmount(expense.amount)}
                      </td>
                      <td
                        className="p-md truncate max-w-[200px] text-on-surface-variant"
                        title={expense.remarks || ""}
                      >
                        {expense.remarks || "-"}
                      </td>
                      <td className="p-md text-on-surface-variant">
                        {createdBy}
                      </td>
                      <td className="p-md font-mono text-on-surface-variant">
                        {formatDate(expense.created_at || expense.createdAt)}
                      </td>
                      <td className="p-md text-right">
                        <div className="flex items-center justify-end gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setModal({ type: "edit", expense })}
                            disabled={!can("update_expense")}
                            className="w-7 h-7 flex items-center justify-center border border-outline-variant hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-outline-variant disabled:hover:text-inherit"
                            title={
                              can("update_expense")
                                ? "Edit"
                                : "You don't have permission to edit expenses"
                            }
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              edit
                            </span>
                          </button>
                          <button
                            onClick={() => setModal({ type: "delete", expense })}
                            disabled={!can("delete_expense") || isOlderThanOneDay}
                            className="w-7 h-7 flex items-center justify-center border border-outline-variant hover:border-error hover:text-error transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-outline-variant disabled:hover:text-inherit"
                            title={
                              !can("delete_expense")
                                ? "You don't have permission to delete expenses"
                                : isOlderThanOneDay
                                ? "Cannot delete expenses older than 1 day"
                                : "Delete"
                            }
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              delete
                            </span>
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
            <span className="ml-sm normal-case tracking-normal text-[11px]">
              ({EXPENSES_PAGE_SIZE} / page)
            </span>
          </div>
          <div className="flex gap-xs">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="w-8 h-8 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">
                chevron_left
              </span>
            </button>
            <span className="w-8 h-8 flex items-center justify-center bg-primary text-on-primary font-label-md text-label-md">
              {page}
            </span>
            <button
              onClick={() =>
                setPage((p) =>
                  totalPages ? Math.min(totalPages, p + 1) : p + 1,
                )
              }
              disabled={page >= totalPages || loading}
              className="w-8 h-8 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal === "record" && (
        <RecordExpenseModal
          businessId={businessId}
          onClose={() => setModal(null)}
          onSaved={handleMutated}
          onUnauthorized={goToLogin}
        />
      )}
      {modal === "filters" && (
        <ExpensesFiltersModal
          initial={filters}
          onClose={() => setModal(null)}
          onApply={applyFilters}
        />
      )}
      {modal?.type === "edit" && (
        <EditExpenseModal
          expense={modal.expense}
          onClose={() => setModal(null)}
          onSaved={handleMutated}
          onUnauthorized={goToLogin}
        />
      )}
      {modal?.type === "delete" && (
        <DeleteExpenseDialog
          expense={modal.expense}
          onClose={() => setModal(null)}
          onDeleted={handleMutated}
          onUnauthorized={goToLogin}
        />
      )}
    </div>
  );
}

export default Expenses;
