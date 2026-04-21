interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetAt: number;
}

interface RateLimitEntry {
  timestamps: number[];
}

/**
 * In-memory sliding window rate limiter.
 * Falls back to this when UPSTASH_REDIS_REST_URL is not set.
 */
const store = new Map<string, RateLimitEntry>();

function cleanupStore(windowMs: number): void {
  const now = Date.now();
  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);
    if (entry.timestamps.length === 0) {
      store.delete(key);
    }
  }
}

// Periodically clean up stale entries (every 60s)
let cleanupInterval: ReturnType<typeof setInterval> | null = null;

function ensureCleanup(windowMs: number): void {
  if (cleanupInterval) return;
  cleanupInterval = setInterval(() => cleanupStore(windowMs), 60_000);
  // Allow Node to exit even if the interval is active
  if (typeof cleanupInterval === "object" && "unref" in cleanupInterval) {
    cleanupInterval.unref();
  }
}

async function rateLimitInMemory(
  key: string,
  opts: RateLimitOptions
): Promise<RateLimitResult> {
  ensureCleanup(opts.windowMs);

  const now = Date.now();
  const entry = store.get(key) ?? { timestamps: [] };

  // Remove expired timestamps (sliding window)
  entry.timestamps = entry.timestamps.filter((t) => now - t < opts.windowMs);

  if (entry.timestamps.length >= opts.limit) {
    const oldest = entry.timestamps[0];
    const resetAt = oldest + opts.windowMs;
    return {
      ok: false,
      remaining: 0,
      resetAt,
    };
  }

  entry.timestamps.push(now);
  store.set(key, entry);

  return {
    ok: true,
    remaining: opts.limit - entry.timestamps.length,
    resetAt: now + opts.windowMs,
  };
}

export async function rateLimit(
  key: string,
  opts: RateLimitOptions
): Promise<RateLimitResult> {
  // Upstash variant — only when env is configured
  // This branch is intentionally left as a future integration point.
  // When UPSTASH_REDIS_REST_URL is set, swap in @upstash/ratelimit here.
  return rateLimitInMemory(key, opts);
}

/** Exposed for testing only */
export function _resetStore(): void {
  store.clear();
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
}
