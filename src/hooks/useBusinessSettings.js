import { useState, useEffect, useCallback } from "react";
import { getBusinessSettings } from "../api/business.api";

// Loads a business's settings and owns the loading/error/data state.
export function useBusinessSettings(businessId) {
  const [settings, setSettings] = useState(null);
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
      const data = await getBusinessSettings(businessId);
      setSettings(data.settings || data || null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    load();
  }, [load]);

  return { settings, loading, error, refetch: load, setSettings };
}
