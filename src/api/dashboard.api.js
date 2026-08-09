import { apiRequest } from "./client";

// Fetches the aggregated dashboard summary for a business. `period` scopes only
// the period-revenue card (revenue + expenses + net): "weekly" | "monthly".
// Today's revenue is always the fixed midnight→now window, computed server-side.
// Returns the full summary payload (see docs/DASHBOARD_API.md).
export function getDashboard(businessId, period = "monthly") {
  const qs = new URLSearchParams();
  if (period) qs.set("period", period);
  const query = qs.toString();
  return apiRequest(`/api/businesses/${businessId}/dashboard${query ? `?${query}` : ""}`);
}
