import { apiRequest } from "./client";

// Fetches the aggregated dashboard summary for a business in a single call.
// The response now includes BOTH the weekly and monthly period revenue cards
// (under `summary.periods`), so the UI can toggle between them client-side
// without re-hitting the backend. Today's revenue is always the fixed
// midnight→now window, computed server-side.
//
// `opts` is forwarded to apiRequest (e.g. `onCachedData` for instant paint from
// the localStorage cache). Returns the full summary payload (see
// docs/DASHBOARD_API.md).
export function getDashboard(businessId, opts = {}) {
  return apiRequest(`/api/businesses/${businessId}/dashboard`, opts);
}
