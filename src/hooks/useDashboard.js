import { useState, useEffect, useCallback } from "react";
import { getDashboard } from "../api/dashboard.api";

// Loads the dashboard summary for a business. `period` ("weekly" | "monthly")
// scopes only the period-revenue card. Refetches when businessId or period changes.
export function useDashboard(businessId, period) {
  const [summary, setSummary] = useState(null);
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
      const data = await getDashboard(businessId, period);
      setSummary(data.summary || data || null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [businessId, period]);

  useEffect(() => {
    load();
  }, [load]);

  return { summary, loading, error, refetch: load };
}
