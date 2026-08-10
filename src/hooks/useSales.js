import { useState, useEffect, useCallback } from "react";
import { getSales } from "../api/sales.api";

export const SALES_PAGE_SIZE = 30;

// Loads a business's sales for the given page + filters, owning loading/error
// and pagination metadata. `filters` = { status, materialId, dateFrom, dateTo }.
export function useSales(businessId, page, filters) {
  const [sales, setSales] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stable primitive deps so the effect doesn't loop on new object identities.
  const { status = "", materialId = "", dateFrom = "", dateTo = "" } = filters || {};

  const load = useCallback(async () => {
    if (!businessId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const apply = (data) => {
      setSales(data?.sales || []);
      setTotal(data?.total ?? (data?.sales ? data.sales.length : 0));
      setTotalPages(data?.totalPages ?? 1);
    };
    try {
      const data = await getSales(
        businessId,
        { page, limit: SALES_PAGE_SIZE, status, materialId, dateFrom, dateTo },
        {
          onCachedData: (cached) => {
            apply(cached);
            setLoading(false);
          },
        }
      );
      apply(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [businessId, page, status, materialId, dateFrom, dateTo]);

  useEffect(() => {
    load();
  }, [load]);

  return { sales, total, totalPages, loading, error, refetch: load };
}
