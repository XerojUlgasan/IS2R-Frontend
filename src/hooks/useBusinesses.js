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
    try {
      const data = await getBusinesses();
      setBusinesses(data.businesses || []);
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

  return { businesses, loading, error, refetch: load, addBusiness };
}
