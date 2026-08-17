import { useState, useEffect, useCallback } from "react";
import { getCalendarOverview, getCalendarDetail } from "../api/calendar.api";

// Loads the calendar overview (daily %changes for month view, or monthly
// %changes for year view) with instant cache paint.
export function useCalendarOverview(businessId, view, date) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!businessId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const apply = (d) => setData(d);
    try {
      const result = await getCalendarOverview(businessId, view, date, {
        onCachedData: (cached) => {
          apply(cached);
          setLoading(false);
        },
      });
      apply(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [businessId, view, date]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}

// Loads the detailed breakdown for a selected day or month.
export function useCalendarDetail(businessId, type, date) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!businessId || !date) {
      setDetail(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await getCalendarDetail(businessId, type, date, { cache: false });
      setDetail(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [businessId, type, date]);

  useEffect(() => {
    load();
  }, [load]);

  return { detail, loading, error, refetch: load };
}
