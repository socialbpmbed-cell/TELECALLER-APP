const store = new Map();

// Returns true if the request is allowed, false if rate-limited.
// key: unique string per action+IP, max: requests allowed, windowMs: sliding window
export function checkRateLimit(key, max, windowMs) {
  const now = Date.now();
  const timestamps = (store.get(key) || []).filter(t => now - t < windowMs);
  if (timestamps.length >= max) return false;
  timestamps.push(now);
  store.set(key, timestamps);
  return true;
}
