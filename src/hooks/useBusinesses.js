import { useState, useEffect, useCallback } from "react";
import { getBusinesses } from "../api/business.api";

// Loads the current user's businesses and owns the loading/error/data state.
export function useBusinesses() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const apply = (data) => setBusinesses(data?.businesses || []);
    try {
      const data = await getBusinesses({
        // Paint from the localStorage cache instantly, then revalidate.
        onCachedData: (cached) => {
          apply(cached);
          setLoading(false);
        },
      });
      apply(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Prepends a newly created business without a full refetch.
  const addBusiness = useCallback((business) => {
    setBusinesses((prev) => [business, ...prev]);
  }, []);

  // Removes a business from local state (e.g. after declining an invite).
  const removeBusiness = useCallback((businessId) => {
    setBusinesses((prev) => prev.filter((b) => b.id !== businessId));
  }, []);

  return { businesses, loading, error, refetch: load, addBusiness, removeBusiness };
}
