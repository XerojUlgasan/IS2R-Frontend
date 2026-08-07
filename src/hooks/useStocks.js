import { useState, useEffect, useCallback } from "react";
import { getStocks } from "../api/stock.api";

export const STOCKS_PAGE_SIZE = 30;

// Loads a business's stock history for the given page + filters, owning
// loading/error and pagination metadata.
// `filters` = { status, materialId, dateFrom, dateTo }.
export function useStocks(businessId, page, filters) {
  const [stocks, setStocks] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { status = "", materialId = "", dateFrom = "", dateTo = "" } = filters || {};

  const load = useCallback(async () => {
    if (!businessId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getStocks(businessId, {
        page,
        limit: STOCKS_PAGE_SIZE,
        status,
        materialId,
        dateFrom,
        dateTo,
      });
      setStocks(data.stocks || []);
      setTotal(data.total ?? (data.stocks ? data.stocks.length : 0));
      setTotalPages(data.totalPages ?? 1);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [businessId, page, status, materialId, dateFrom, dateTo]);

  useEffect(() => {
    load();
  }, [load]);

  return { stocks, total, totalPages, loading, error, refetch: load };
}
