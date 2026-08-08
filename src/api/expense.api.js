import { apiRequest } from "./client";

// Expenses are scoped to a business (workspace), mirroring the sales API.

// Lists expenses for a business with pagination + optional filters.
// params = { page, limit, category, dateFrom, dateTo }
export function getExpenses(businessId, params = {}) {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", params.page);
  if (params.limit) qs.set("limit", params.limit);
  if (params.category) qs.set("category", params.category);
  if (params.dateFrom) qs.set("dateFrom", params.dateFrom);
  if (params.dateTo) qs.set("dateTo", params.dateTo);
  const query = qs.toString();
  return apiRequest(`/api/businesses/${businessId}/expenses${query ? `?${query}` : ""}`);
}

// Records a new expense. payload = { title, category, amount, remarks }.
export function createExpense(businessId, payload) {
  return apiRequest(`/api/businesses/${businessId}/expenses`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Updates an expense's editable fields. payload = { title?, category?, amount?, remarks? }.
export function updateExpense(expenseId, payload) {
  return apiRequest(`/api/expenses/${expenseId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

// Deletes an expense.
export function deleteExpense(expenseId) {
  return apiRequest(`/api/expenses/${expenseId}`, {
    method: "DELETE",
  });
}
