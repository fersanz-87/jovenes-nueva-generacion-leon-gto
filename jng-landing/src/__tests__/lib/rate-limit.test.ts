import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { rateLimit, _resetStore } from "@/lib/rate-limit";

describe("rateLimit (in-memory)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    _resetStore();
  });

  afterEach(() => {
    vi.useRealTimers();
    _resetStore();
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

    // Advance time past the window
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
    await rateLimit("ip-slide", opts); // t=0
    vi.advanceTimersByTime(20_000);
    await rateLimit("ip-slide", opts); // t=20s
    vi.advanceTimersByTime(20_000);
    await rateLimit("ip-slide", opts); // t=40s

    // All 3 slots used, should be blocked
    const blocked = await rateLimit("ip-slide", opts);
    expect(blocked.ok).toBe(false);

    // Advance past the first request's window (t=0 + 60s = 60s, we're at 40s, need 20s more)
    vi.advanceTimersByTime(20_001);

    const allowed = await rateLimit("ip-slide", opts);
    expect(allowed.ok).toBe(true);
  });
});
