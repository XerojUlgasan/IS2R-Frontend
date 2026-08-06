import { apiRequest } from "./client";

// Sales are scoped to a business (workspace).

// Lists sales for a business with pagination + optional filters.
// params = { page, limit, status, materialId, dateFrom, dateTo }
export function getSales(businessId, params = {}) {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", params.page);
  if (params.limit) qs.set("limit", params.limit);
  if (params.status) qs.set("status", params.status);
  if (params.materialId) qs.set("materialId", params.materialId);
  if (params.dateFrom) qs.set("dateFrom", params.dateFrom);
  if (params.dateTo) qs.set("dateTo", params.dateTo);
  const query = qs.toString();
  return apiRequest(`/api/businesses/${businessId}/sales${query ? `?${query}` : ""}`);
}

// Records a new sale. payload = { materialId, qty_used, total_amount, status, remarks }.
export function createSale(businessId, payload) {
  return apiRequest(`/api/businesses/${businessId}/sales`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Updates a sale's editable fields (e.g. mark paid). payload = { status?, remarks? }.
export function updateSale(saleId, payload) {
  return apiRequest(`/api/sales/${saleId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

// Deletes a sale.
export function deleteSale(saleId) {
  return apiRequest(`/api/sales/${saleId}`, {
    method: "DELETE",
  });
}
