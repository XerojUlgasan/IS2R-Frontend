import { apiRequest } from "./client";
import { supabase } from "../lib/supabaseClient";

// Fetches the current user's businesses. `opts` is forwarded to apiRequest
// (e.g. `onCachedData` for instant paint from the localStorage cache).
export function getBusinesses(opts = {}) {
  return apiRequest("/api/businesses", opts);
}

// Accepts a pending invitation to a business. No request body — the caller is
// resolved from the JWT. On success the backend writes the granted permissions
// into app_metadata, so we refresh the Supabase session to pull them into the
// current token before the UI gates on them.
// Returns { membership: { businessId, role, status, actions } }.
export async function acceptInvite(businessId) {
  const result = await apiRequest(`/api/businesses/${businessId}/accept`, {
    method: "POST",
  });
  await supabase.auth.refreshSession();
  return result;
}

// Declines a pending invitation to a business. No request body — the caller is
// resolved from the JWT.
// NOTE: Verify this endpoint against the backend; it is not yet documented.
export function declineInvite(businessId) {
  return apiRequest(`/api/businesses/${businessId}/decline`, {
    method: "POST",
  });
}

// Creates a new business. payload = { name, description?, contact_number?, address? }.
export function createBusiness(payload) {
  return apiRequest("/api/businesses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Fetches a business's settings (name, description, contact_number, address,
// logo_img_loc). Returns { settings: {...} }. `opts` is forwarded to apiRequest.
export function getBusinessSettings(businessId, opts = {}) {
  return apiRequest(`/api/businesses/${businessId}/settings`, opts);
}

// Updates a business's settings. payload = { name?, description?, contact_number?,
// address?, logo_img_loc? }. Returns { settings: {...} }.
export function updateBusinessSettings(businessId, payload) {
  return apiRequest(`/api/businesses/${businessId}/settings`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

// Uploads a new logo image and returns its stored location.
// Sends multipart/form-data with a single `logo` file field.
// Returns { logo_img_loc: "<url>" }.
export function uploadBusinessLogo(businessId, file) {
  const data = new FormData();
  data.append("logo", file);
  return apiRequest(`/api/businesses/${businessId}/settings/logo`, {
    method: "POST",
    body: data,
  });
}
