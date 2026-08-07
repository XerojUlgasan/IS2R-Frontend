import { apiRequest } from "./client";

// Members are scoped to a business (workspace).

// Lists all members of a business.
export function getMembers(businessId) {
  return apiRequest(`/api/businesses/${businessId}/members`);
}

// Invites a new member. payload = { email, role, permissions }.
export function inviteMember(businessId, payload) {
  return apiRequest(`/api/businesses/${businessId}/members/invite`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Updates a member's allowed actions. payload = { permissions: string[] }.
export function updateMemberPermissions(businessId, memberId, permissions) {
  return apiRequest(`/api/businesses/${businessId}/members/${memberId}/permissions`, {
    method: "PATCH",
    body: JSON.stringify({ permissions }),
  });
}

// Removes a member from the business.
export function removeMember(businessId, memberId) {
  return apiRequest(`/api/businesses/${businessId}/members/${memberId}`, {
    method: "DELETE",
  });
}
