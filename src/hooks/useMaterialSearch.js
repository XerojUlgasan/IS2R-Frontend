import { useState, useEffect, useRef } from "react";
import { searchMaterials, getCachedMaterialSearch } from "../api/material.api";

// Module-level cache of search results, keyed by `${businessId}::${query}`.
// Shared across every MaterialSearchSelect so repeated queries hit no network.
const cache = new Map();

// Clears the search cache. Call this whenever materials change (create / edit /
// delete) so stale names/ids never resurface in search results.
export function clearMaterialSearchCache() {
  cache.clear();
}

// Debounced (cooldown) material search with caching.
// The request only fires once the user pauses typing for `cooldownMs`, so fast
// typing ("bond" within ~1.5s) results in a single request, not one per key.
export function useMaterialSearch(businessId, cooldownMs = 2000) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const q = query.trim();

    if (!q || !businessId) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    const key = `${businessId}::${q.toLowerCase()}`;
    if (cache.has(key)) {
      setResults(cache.get(key));
      setLoading(false);
      setError(null);
      return;
    }

    setError(null);

    // Instant paint from the persisted localStorage cache (survives reloads /
    // new sessions). We still revalidate after the cooldown below.
    const cached = getCachedMaterialSearch(businessId, q);
    const hasCached = cached && Array.isArray(cached.materials);
    if (hasCached) {
      cache.set(key, cached.materials);
      setResults(cached.materials);
      setLoading(false);
    } else {
      // Nothing cached — show the pending state until the network resolves.
      setLoading(true);
    }

    // Only hit the network after the cooldown window with no further keystrokes.
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        const data = await searchMaterials(businessId, q);
        const list = data.materials || [];
        cache.set(key, list);
        setResults(list);
      } catch (err) {
        // Keep any cached results visible on a revalidation error.
        if (!hasCached) {
          setError(err);
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    }, cooldownMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, businessId, cooldownMs]);

  return { query, setQuery, results, loading, error };
}
