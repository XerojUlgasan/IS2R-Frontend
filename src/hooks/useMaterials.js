import { useState, useEffect, useCallback } from "react";
import { getMaterials } from "../api/material.api";

// Loads the materials for a business and owns the loading/error/data state.
export function useMaterials(businessId) {
  const [materials, setMaterials] = useState([]);
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
      const data = await getMaterials(businessId);
      setMaterials(data.materials || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    load();
  }, [load]);

  return { materials, loading, error, refetch: load };
}
