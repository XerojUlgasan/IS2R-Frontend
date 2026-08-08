import { apiRequest } from "./client";

// Stocks (stock batches / history) are scoped to a business.

// Lists a business's stock entries with pagination + optional filters.
// params = { page, limit, status, materialId, dateFrom, dateTo }
export function getStocks(businessId, params = {}) {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", params.page);
  if (params.limit) qs.set("limit", params.limit);
  if (params.status) qs.set("status", params.status);
  if (params.materialId) qs.set("materialId", params.materialId);
  if (params.dateFrom) qs.set("dateFrom", params.dateFrom);
  if (params.dateTo) qs.set("dateTo", params.dateTo);
  const query = qs.toString();
  return apiRequest(`/api/businesses/${businessId}/stocks${query ? `?${query}` : ""}`);
}

// Lists the consumption history for a single stock batch, paginated for
// infinite scroll. Each entry is a deduction event against the batch. Nested
// under :businessId for explicit tenant scoping (like the stocks list).
// params = { page, limit }. Returns { history, page, limit, total, totalPages }.
export function getStockHistory(businessId, stockId, params = {}) {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", params.page);
  if (params.limit) qs.set("limit", params.limit);
  const query = qs.toString();
  return apiRequest(`/api/businesses/${businessId}/stocks/${stockId}/history${query ? `?${query}` : ""}`);
}
