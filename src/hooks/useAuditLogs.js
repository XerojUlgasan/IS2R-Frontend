import { useState, useEffect, useCallback } from "react";
import { getAuditLogs } from "../api/auditLog.api";

export const AUDIT_PAGE_SIZE = 30;

// Loads a business's audit logs for the given page + filters, owning
// loading/error and pagination metadata.
// `filters` = { action, dateFrom, dateTo, search }.
export function useAuditLogs(businessId, page, filters) {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { action = "", dateFrom = "", dateTo = "", search = "" } = filters || {};

  const load = useCallback(async () => {
    if (!businessId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const apply = (data) => {
      setLogs(data?.logs || []);
      setTotal(data?.total ?? (data?.logs ? data.logs.length : 0));
      setTotalPages(data?.totalPages ?? 1);
    };
    try {
      const data = await getAuditLogs(
        businessId,
        { page, limit: AUDIT_PAGE_SIZE, action, dateFrom, dateTo, search },
        {
          onCachedData: (cached) => {
            apply(cached);
            setLoading(false);
          },
        }
      );
      apply(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [businessId, page, action, dateFrom, dateTo, search]);

  useEffect(() => {
    load();
  }, [load]);

  return { logs, total, totalPages, loading, error, refetch: load };
}
