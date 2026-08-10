import { useState, useEffect, useCallback } from "react";
import { getDashboard } from "../api/dashboard.api";

// Loads the dashboard summary for a business in a single request. The payload
// carries both weekly and monthly period revenue, so switching the period on
// the dashboard is a pure client-side toggle (no refetch).
//
// Caching: the cached copy (localStorage) is applied instantly via
// `onCachedData` so the dashboard paints immediately, then the fresh response
// replaces it if the data changed.
export function useDashboard(businessId) {
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
      const data = await getDashboard(businessId, {
        // Paint from cache the moment it's available.
        onCachedData: (cached) => {
          setSummary(cached?.summary || cached || null);
          setLoading(false);
        },
      });
      setSummary(data.summary || data || null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    load();
  }, [load]);

  return { summary, loading, error, refetch: load };
}
