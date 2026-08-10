import { apiRequest } from "./client";

// Fetches the calendar overview for a business.
// `view` = "month" | "year"
// `date` = ISO date string (e.g. "2026-08-01") anchoring the view.
// Returns daily or monthly entries with sales % change info.
export function getCalendarOverview(businessId, view = "month", date, opts = {}) {
  const qs = new URLSearchParams();
  qs.set("view", view);
  if (date) qs.set("date", date);
  return apiRequest(`/api/businesses/${businessId}/calendar?${qs.toString()}`, opts);
}

// Fetches the detailed breakdown for a specific day or month.
// `type` = "day" | "month"
// `date` = ISO date string (e.g. "2026-08-11" for day, "2026-08" for month).
// Returns per-material breakdown including stock, consumption, sales, deleted counts.
export function getCalendarDetail(businessId, type, date, opts = {}) {
  const qs = new URLSearchParams();
  qs.set("type", type);
  qs.set("date", date);
  return apiRequest(`/api/businesses/${businessId}/calendar/detail?${qs.toString()}`, opts);
}
