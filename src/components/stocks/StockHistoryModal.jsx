import React, { useCallback } from "react";
import { useStockHistory } from "../../hooks/useStockHistory";

function formatNumber(value) {
  if (value === null || value === undefined || value === "") return "—";
  const num = Number(value);
  if (Number.isNaN(num)) return "—";
  return num.toLocaleString();
}

function formatDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, { year: "numeric", month: "short", day: "2-digit", hour: "numeric", minute: "2-digit" });
}

// The API returns `status` as an array of tags; render each as a badge.
function StatusBadges({ status }) {
  const tags = Array.isArray(status) ? status : status ? [status] : [];
  if (tags.length === 0) return <span className="text-on-surface-variant">—</span>;
  return (
    <div className="flex flex-wrap gap-xs">
      {tags.map((tag, i) => (
        <span
          key={`${tag}-${i}`}
          className="inline-flex items-center px-sm py-xs border border-outline-variant bg-surface-container text-on-surface font-label-md text-[10px] uppercase tracking-widest"
        >
          {String(tag)}
        </span>
      ))}
    </div>
  );
}

// Modal showing a single stock batch's consumption history in a paginated
// table with an infinite vertical scroll effect. Scrolling near the bottom
// loads the next page.
function StockHistoryModal({ businessId, stock, onClose }) {
  const stockId = stock?.id;
  const { items, total, loading, error, hasMore, loadMore, refetch } = useStockHistory(businessId, stockId);

  const materialName = stock?.material_name || stock?.material?.name || "Untitled material";

  const handleScroll = useCallback(
    (e) => {
      const el = e.currentTarget;
      if (el.scrollHeight - el.scrollTop - el.clientHeight < 120) {
        loadMore();
      }
    },
    [loadMore]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-md" onClick={onClose}>
      <div
        className="w-full max-w-5xl bg-surface-container-lowest border-2 border-primary flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-xl pb-md border-b border-outline-variant">
          <div className="flex flex-col gap-xs">
            <h2 className="font-headline-lg text-headline-md text-on-surface uppercase tracking-tight">Stock History</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Consumption events for <span className="font-bold text-on-surface">{materialName}</span>
              {total ? ` · ${total.toLocaleString()} record${total === 1 ? "" : "s"}` : ""}
            </p>
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

        {/* Scrollable table area (infinite scroll) */}
        <div className="flex-1 overflow-y-auto min-h-[240px]" onScroll={handleScroll}>
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead className="sticky top-0 z-10">
              <tr className="bg-surface-container-low border-b border-outline">
                <th className="py-md px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Material</th>
                <th className="py-md px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Created By</th>
                <th className="py-md px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest text-right">Deducted</th>
                <th className="py-md px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest text-right">Remaining</th>
                <th className="py-md px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Status</th>
                <th className="py-md px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline">
              {items.map((row, i) => (
                <tr key={row.id || i} className="hover:bg-surface-container transition-colors">
                  <td className="py-md px-md font-body-md text-body-md text-on-surface font-bold">
                    {row.material_name || row.material?.name || materialName}
                  </td>
                  <td className="py-md px-md font-body-sm text-body-sm text-on-surface-variant">
                    {row.created_by_name || row.createdByName || "—"}
                  </td>
                  <td className="py-md px-md font-body-md text-body-md text-error font-mono text-right">
                    {row.deducted !== undefined && row.deducted !== null ? `-${formatNumber(row.deducted)}` : "—"}
                  </td>
                  <td className="py-md px-md font-body-md text-body-md text-on-surface font-mono text-right">
                    {formatNumber(row.remaining)}
                  </td>
                  <td className="py-md px-md">
                    <StatusBadges status={row.status} />
                  </td>
                  <td className="py-md px-md font-body-sm text-body-sm text-on-surface-variant font-mono">
                    {formatDateTime(row.created_at || row.createdAt)}
                  </td>
                </tr>
              ))}

              {/* Empty state */}
              {!loading && !error && items.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-xl text-center text-on-surface-variant font-body-md">
                    No consumption recorded for this batch yet.
                  </td>
                </tr>
              )}

              {/* Loading row (initial + subsequent pages) */}
              {loading && (
                <tr>
                  <td colSpan={6} className="p-lg text-center text-on-surface-variant">
                    <span className="material-symbols-outlined animate-spin align-middle mr-sm">refresh</span>
                    Loading...
                  </td>
                </tr>
              )}

              {/* Error row with retry */}
              {!loading && error && (
                <tr>
                  <td colSpan={6} className="p-lg text-center">
                    <div className="flex flex-col items-center gap-sm">
                      <p className="font-body-sm text-body-sm text-error">{error.message || "Something went wrong, try again."}</p>
                      <button
                        onClick={refetch}
                        className="px-md py-sm border border-primary text-primary font-label-md text-label-md uppercase tracking-widest hover:bg-surface-container transition-colors flex items-center gap-xs"
                      >
                        <span className="material-symbols-outlined text-[16px]">refresh</span>
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {/* End-of-list marker */}
              {!loading && !error && items.length > 0 && !hasMore && (
                <tr>
                  <td colSpan={6} className="p-md text-center text-on-surface-variant font-label-md text-[11px] uppercase tracking-widest">
                    End of history
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StockHistoryModal;
