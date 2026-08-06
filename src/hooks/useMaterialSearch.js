import { useState, useEffect, useRef } from "react";
import { searchMaterials } from "../api/material.api";

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

    // Show the pending state immediately, but only hit the network after the
    // cooldown window with no further keystrokes.
    setLoading(true);
    setError(null);
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        const data = await searchMaterials(businessId, q);
        const list = data.materials || [];
        cache.set(key, list);
        setResults(list);
      } catch (err) {
        setError(err);
        setResults([]);
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
