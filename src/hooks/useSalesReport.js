import { useState, useEffect, useCallback } from "react";
import { getSalesReport } from "../api/sales.api";

// Loads the aggregated sales report for a business + period, owning the
// loading/error/data state. Refetches whenever businessId or period changes.
export function useSalesReport(businessId, period) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!businessId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getSalesReport(businessId, period);
      setReport(data.report || data || null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [businessId, period]);

  useEffect(() => {
    load();
  }, [load]);

  return { report, loading, error, refetch: load };
}
