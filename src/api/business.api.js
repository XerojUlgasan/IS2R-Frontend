import { apiRequest } from "./client";

// Fetches the current user's businesses.
export function getBusinesses() {
  return apiRequest("/api/businesses");
}

// Creates a new business. payload = { name, description?, contact_number?, address? }.
export function createBusiness(payload) {
  return apiRequest("/api/businesses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
