// Single source of truth for the API base URL, auth headers, JSON parsing,
// and a consistent error shape. Every API call goes through apiRequest().
import { supabase } from "../lib/supabaseClient";
import { readCache, writeCache, isSameData } from "./cache";

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
//
// Caching (stale-while-revalidate): GET responses are cached in localStorage.
// The request always hits the backend; if the fresh response differs from the
// cached copy, the cache is updated. Callers that want to render instantly can
// pass `onCachedData`, which is invoked synchronously with the cached payload
// (if any) before the network resolves. Pass `cache: false` to opt out.
export async function apiRequest(path, options = {}) {
  const { onCachedData, cache, ...fetchOptions } = options;
  const method = (fetchOptions.method || "GET").toUpperCase();
  const isCacheable = method === "GET" && cache !== false;

  // Serve the cached copy immediately so the UI can paint without waiting.
  if (isCacheable && typeof onCachedData === "function") {
    const cached = readCache(path);
    if (cached !== undefined) onCachedData(cached);
  }

  // For FormData bodies (e.g. file uploads) let the browser set the
  // multipart Content-Type (with boundary); only default to JSON otherwise.
  const isFormData = typeof FormData !== "undefined" && fetchOptions.body instanceof FormData;
  const res = await fetch(`${BASE_URL}${path}`, {
    ...fetchOptions,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(await getAuthHeaders()),
      ...fetchOptions.headers,
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

  // Write-through: only touch localStorage when the payload actually changed.
  if (isCacheable) {
    const cached = readCache(path);
    if (!isSameData(cached, body)) writeCache(path, body);
  }

  return body;
}
