import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

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

// ---------------------------------------------------------------------------
// In-memory sliding window (dev / test fallback)
// ---------------------------------------------------------------------------

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

let cleanupInterval: ReturnType<typeof setInterval> | null = null;

function ensureCleanup(windowMs: number): void {
  if (cleanupInterval) return;
  cleanupInterval = setInterval(() => cleanupStore(windowMs), 60_000);
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

  entry.timestamps = entry.timestamps.filter((t) => now - t < opts.windowMs);

  if (entry.timestamps.length >= opts.limit) {
    const oldest = entry.timestamps[0];
    const resetAt = oldest + opts.windowMs;
    return { ok: false, remaining: 0, resetAt };
  }

  entry.timestamps.push(now);
  store.set(key, entry);

  return {
    ok: true,
    remaining: opts.limit - entry.timestamps.length,
    resetAt: now + opts.windowMs,
  };
}

// ---------------------------------------------------------------------------
// Upstash Redis sliding window (production)
// ---------------------------------------------------------------------------

let upstashLimiter: Ratelimit | null = null;

function getUpstashLimiter(opts: RateLimitOptions): Ratelimit {
  if (!upstashLimiter) {
    upstashLimiter = new Ratelimit({
      redis: new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      }),
      limiter: Ratelimit.slidingWindow(
        opts.limit,
        `${opts.windowMs} ms` as Parameters<typeof Ratelimit.slidingWindow>[1]
      ),
      prefix: "ratelimit:contact",
    });
  }
  return upstashLimiter;
}

async function rateLimitUpstash(
  key: string,
  opts: RateLimitOptions
): Promise<RateLimitResult> {
  const limiter = getUpstashLimiter(opts);
  const result = await limiter.limit(key);

  return {
    ok: result.success,
    remaining: result.remaining,
    resetAt: result.reset,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

function isUpstashConfigured(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

export async function rateLimit(
  key: string,
  opts: RateLimitOptions
): Promise<RateLimitResult> {
  if (isUpstashConfigured()) {
    return rateLimitUpstash(key, opts);
  }
  return rateLimitInMemory(key, opts);
}

/** Exposed for testing only */
export function _resetStore(): void {
  store.clear();
  upstashLimiter = null;
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
}
