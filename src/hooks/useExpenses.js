import { useState, useEffect, useCallback } from "react";
import { getExpenses } from "../api/expense.api";

export const EXPENSES_PAGE_SIZE = 30;

// Loads a business's expenses for the given page + filters, owning loading/error
// and pagination metadata. `filters` = { category, dateFrom, dateTo }.
export function useExpenses(businessId, page, filters) {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stable primitive deps so the effect doesn't loop on new object identities.
  const { category = "", dateFrom = "", dateTo = "" } = filters || {};

  const load = useCallback(async () => {
    if (!businessId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getExpenses(businessId, {
        page,
        limit: EXPENSES_PAGE_SIZE,
        category,
        dateFrom,
        dateTo,
      });
      setExpenses(data.expenses || []);
      setTotal(data.total ?? (data.expenses ? data.expenses.length : 0));
      setTotalPages(data.totalPages ?? 1);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [businessId, page, category, dateFrom, dateTo]);

  useEffect(() => {
    load();
  }, [load]);

  return { expenses, total, totalPages, loading, error, refetch: load };
}
