import { apiRequest } from "./client";

// Fetches the aggregated inventory report for a business, scoped to a period.
// period = "daily" | "weekly" | "monthly" | "yearly".
// Returns the full report payload (see docs/INVENTORY_REPORTS_API.md).
export function getInventoryReport(businessId, period = "weekly") {
  const qs = new URLSearchParams();
  if (period) qs.set("period", period);
  const query = qs.toString();
  return apiRequest(`/api/businesses/${businessId}/inventory-report${query ? `?${query}` : ""}`);
}
