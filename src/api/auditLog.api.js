import { apiRequest } from "./client";

// Audit logs are scoped to a business (workspace) and are read-only.

// Lists audit log entries with pagination + optional filters.
// params = { page, limit, action, dateFrom, dateTo, search }
export function getAuditLogs(businessId, params = {}, opts = {}) {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", params.page);
  if (params.limit) qs.set("limit", params.limit);
  if (params.action) qs.set("action", params.action);
  if (params.dateFrom) qs.set("dateFrom", params.dateFrom);
  if (params.dateTo) qs.set("dateTo", params.dateTo);
  if (params.search) qs.set("search", params.search);
  const query = qs.toString();
  return apiRequest(`/api/businesses/${businessId}/audit-logs${query ? `?${query}` : ""}`, opts);
}
