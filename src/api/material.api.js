import { apiRequest } from "./client";
import { readCache } from "./cache";

// Materials are scoped to a business (workspace).

// Fetches all materials for a business. `opts` is forwarded to apiRequest.
export function getMaterials(businessId, opts = {}) {
  return apiRequest(`/api/businesses/${businessId}/materials`, opts);
}

// Builds the material-search endpoint path (shared by the request + the cache
// lookup below so both agree on the exact cache key).
function materialSearchPath(businessId, query) {
  const qs = new URLSearchParams({ q: query });
  return `/api/businesses/${businessId}/materials/search?${qs.toString()}`;
}

// Searches a business's materials by name (typeahead). Returns { materials: [...] }.
export function searchMaterials(businessId, query, opts = {}) {
  return apiRequest(materialSearchPath(businessId, query), opts);
}

// Reads the cached search result (if any) for a query, for instant paint before
// the debounced network request runs. Returns the cached body or `undefined`.
export function getCachedMaterialSearch(businessId, query) {
  return readCache(materialSearchPath(businessId, query));
}

// Creates a material in a business. payload = { name, type, unit }.
export function createMaterial(businessId, payload) {
  return apiRequest(`/api/businesses/${businessId}/materials`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Updates a material's editable fields. payload = { name, type, unit }.
export function updateMaterial(materialId, payload) {
  return apiRequest(`/api/materials/${materialId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

// Deletes a material.
export function deleteMaterial(materialId) {
  return apiRequest(`/api/materials/${materialId}`, {
    method: "DELETE",
  });
}

// Adds stock to a material. payload = { quantity, mfg_price }.
export function addMaterialStock(materialId, payload) {
  return apiRequest(`/api/materials/${materialId}/stock`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
