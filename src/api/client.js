// Single source of truth for the API base URL, auth headers, JSON parsing,
// and a consistent error shape. Every API call goes through apiRequest().
import { supabase } from "../lib/supabaseClient";

// CRA only exposes REACT_APP_* vars; REACT_API_BASE_URL is kept in .env for
// reference but read here under the CRA-compatible name.
const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";

// Builds the auth header from the active Supabase session's JWT.
async function getAuthHeaders() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Performs an authenticated JSON request and normalizes errors to
// { status, message } so the UI can rely on a single shape.
export async function apiRequest(path, options = {}) {
  // For FormData bodies (e.g. file uploads) let the browser set the
  // multipart Content-Type (with boundary); only default to JSON otherwise.
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(await getAuthHeaders()),
      ...options.headers,
    },
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Proper Error instance carrying the status so the UI can branch on it
    // (error.status / error.message).
    const err = new Error(body.error || "Request failed");
    err.status = res.status;
    throw err;
  }

  return body;
}
