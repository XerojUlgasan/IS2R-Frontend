// Lightweight localStorage cache for API responses.
//
// Strategy: stale-while-revalidate. Reads return whatever is cached instantly,
// while the network request still runs in the background. When the fresh
// response differs from the cached copy, the cache is updated (and any listener
// is notified). Only GET responses are cached.

const PREFIX = "is2r:cache:";

// Builds a stable cache key from a request path (including its query string).
export function cacheKeyFor(path) {
  return PREFIX + path;
}

// Reads a cached entry. Returns `undefined` when there is no usable cache
// (missing, or corrupt JSON — which we clear defensively).
export function readCache(path) {
  try {
    const raw = localStorage.getItem(cacheKeyFor(path));
    if (raw == null) return undefined;
    return JSON.parse(raw);
  } catch {
    // Corrupt entry — drop it so we don't keep tripping over it.
    try {
      localStorage.removeItem(cacheKeyFor(path));
    } catch {
      /* ignore */
    }
    return undefined;
  }
}

// Writes an entry. Swallows quota/serialization errors so caching never breaks
// the actual request flow.
export function writeCache(path, data) {
  try {
    localStorage.setItem(cacheKeyFor(path), JSON.stringify(data));
  } catch {
    /* ignore (quota exceeded, private mode, etc.) */
  }
}

// Removes a single cached entry.
export function removeCache(path) {
  try {
    localStorage.removeItem(cacheKeyFor(path));
  } catch {
    /* ignore */
  }
}

// Clears every cache entry we own (leaves other localStorage keys untouched).
export function clearCache() {
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key && key.startsWith(PREFIX)) keys.push(key);
    }
    keys.forEach((key) => localStorage.removeItem(key));
  } catch {
    /* ignore */
  }
}

// Structural equality via JSON serialization. Good enough for API payloads,
// which are plain JSON already. Used to decide whether the cache changed.
export function isSameData(a, b) {
  if (a === b) return true;
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}
