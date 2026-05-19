import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

const mockLimit = vi.fn();

vi.mock("@upstash/redis", () => {
  // eslint-disable-next-line @typescript-eslint/no-extraneous-class
  class MockRedis {}
  return { Redis: MockRedis };
});

vi.mock("@upstash/ratelimit", () => {
  class MockRatelimit {
    limit = mockLimit;
    static slidingWindow = vi.fn(() => "sliding-window-config");
  }
  return { Ratelimit: MockRatelimit };
});

describe("rateLimit (in-memory)", () => {
  let rateLimit: typeof import("@/lib/rate-limit").rateLimit;
  let _resetStore: typeof import("@/lib/rate-limit")._resetStore;

  beforeEach(async () => {
    vi.useFakeTimers();
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;

    vi.resetModules();
    const mod = await import("@/lib/rate-limit");
    rateLimit = mod.rateLimit;
    _resetStore = mod._resetStore;
    _resetStore();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const opts = { limit: 3, windowMs: 60_000 };

  it("allows requests within the limit", async () => {
    const r1 = await rateLimit("ip-1", opts);
    expect(r1.ok).toBe(true);
    expect(r1.remaining).toBe(2);

    const r2 = await rateLimit("ip-1", opts);
    expect(r2.ok).toBe(true);
    expect(r2.remaining).toBe(1);

    const r3 = await rateLimit("ip-1", opts);
    expect(r3.ok).toBe(true);
    expect(r3.remaining).toBe(0);
  });

  it("blocks requests exceeding the limit", async () => {
    for (let i = 0; i < 3; i++) {
      await rateLimit("ip-2", opts);
    }

    const blocked = await rateLimit("ip-2", opts);
    expect(blocked.ok).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.resetAt).toBeGreaterThan(Date.now());
  });

  it("resets after the window expires", async () => {
    for (let i = 0; i < 3; i++) {
      await rateLimit("ip-3", opts);
    }

    const blocked = await rateLimit("ip-3", opts);
    expect(blocked.ok).toBe(false);

    vi.advanceTimersByTime(60_001);

    const allowed = await rateLimit("ip-3", opts);
    expect(allowed.ok).toBe(true);
    expect(allowed.remaining).toBe(2);
  });

  it("tracks different keys independently", async () => {
    for (let i = 0; i < 3; i++) {
      await rateLimit("ip-a", opts);
    }

    const blockedA = await rateLimit("ip-a", opts);
    expect(blockedA.ok).toBe(false);

    const allowedB = await rateLimit("ip-b", opts);
    expect(allowedB.ok).toBe(true);
  });

  it("sliding window allows new request when oldest expires", async () => {
    await rateLimit("ip-slide", opts);
    vi.advanceTimersByTime(20_000);
    await rateLimit("ip-slide", opts);
    vi.advanceTimersByTime(20_000);
    await rateLimit("ip-slide", opts);

    const blocked = await rateLimit("ip-slide", opts);
    expect(blocked.ok).toBe(false);

    vi.advanceTimersByTime(20_001);

    const allowed = await rateLimit("ip-slide", opts);
    expect(allowed.ok).toBe(true);
  });
});

describe("rateLimit (Upstash)", () => {
  let rateLimit: typeof import("@/lib/rate-limit").rateLimit;
  let _resetStore: typeof import("@/lib/rate-limit")._resetStore;

  beforeEach(async () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://fake-redis.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "fake-token";
    mockLimit.mockReset();

    vi.resetModules();
    const mod = await import("@/lib/rate-limit");
    rateLimit = mod.rateLimit;
    _resetStore = mod._resetStore;
    _resetStore();
  });

  afterEach(() => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  });

  const opts = { limit: 5, windowMs: 60_000 };

  it("returns ok when Upstash allows the request", async () => {
    mockLimit.mockResolvedValueOnce({
      success: true,
      remaining: 4,
      reset: Date.now() + 60_000,
      limit: 5,
    });

    const result = await rateLimit("ip-upstash", opts);
    expect(result.ok).toBe(true);
    expect(result.remaining).toBe(4);
    expect(mockLimit).toHaveBeenCalledWith("ip-upstash");
  });

  it("returns blocked when Upstash denies the request", async () => {
    const resetTime = Date.now() + 30_000;
    mockLimit.mockResolvedValueOnce({
      success: false,
      remaining: 0,
      reset: resetTime,
      limit: 5,
    });

    const result = await rateLimit("ip-upstash", opts);
    expect(result.ok).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.resetAt).toBe(resetTime);
  });
});
