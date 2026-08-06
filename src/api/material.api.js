import { apiRequest } from "./client";

// Materials are scoped to a business (workspace).

// Fetches all materials for a business.
export function getMaterials(businessId) {
  return apiRequest(`/api/businesses/${businessId}/materials`);
}

// Searches a business's materials by name (typeahead). Returns { materials: [...] }.
export function searchMaterials(businessId, query) {
  const qs = new URLSearchParams({ q: query });
  return apiRequest(`/api/businesses/${businessId}/materials/search?${qs.toString()}`);
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
