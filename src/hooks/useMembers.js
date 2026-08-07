import { useState, useEffect, useCallback } from "react";
import { getMembers } from "../api/member.api";

// Loads a business's members and owns the loading/error/data state.
export function useMembers(businessId) {
  const [members, setMembers] = useState([]);
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
      const data = await getMembers(businessId);
      setMembers(data.members || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    load();
  }, [load]);

  return { members, loading, error, refetch: load };
}
