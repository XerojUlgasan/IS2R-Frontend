import { useState, useEffect, useCallback, useRef } from "react";
import { getStockHistory } from "../api/stock.api";

export const STOCK_HISTORY_PAGE_SIZE = 20;

// Loads a single stock batch's consumption history with infinite scroll:
// appends each page to `items` and exposes `loadMore` + `hasMore`. The first
// page loads on mount (when `businessId` + `stockId` are set).
export function useStockHistory(businessId, stockId) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Guards against overlapping requests (scroll can fire rapidly).
  const loadingRef = useRef(false);

  const fetchPage = useCallback(
    async (nextPage) => {
      if (!businessId || !stockId || loadingRef.current) return;
      loadingRef.current = true;
      setLoading(true);
      setError(null);
      try {
        const data = await getStockHistory(businessId, stockId, { page: nextPage, limit: STOCK_HISTORY_PAGE_SIZE });
        const rows = data.history || [];
        setItems((prev) => (nextPage === 1 ? rows : [...prev, ...rows]));
        setTotal(data.total ?? rows.length);
        setTotalPages(data.totalPages ?? 1);
        setPage(nextPage);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    },
    [businessId, stockId]
  );

  // Load the first page whenever the target stock changes.
  useEffect(() => {
    setItems([]);
    setPage(1);
    setTotalPages(1);
    setTotal(0);
    if (businessId && stockId) fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId, stockId]);

  const hasMore = page < totalPages;

  const loadMore = useCallback(() => {
    if (!loadingRef.current && hasMore) fetchPage(page + 1);
  }, [fetchPage, hasMore, page]);

  return { items, total, loading, error, hasMore, loadMore, refetch: () => fetchPage(1) };
}
