import { describe, expect, it, beforeEach } from "vitest";
import { consumeRateLimit, __resetRateLimitsForTests } from "@/lib/rate-limit";

describe("consumeRateLimit", () => {
  beforeEach(() => {
    __resetRateLimitsForTests();
  });

  it("allows requests under the limit", () => {
    expect(consumeRateLimit("test-key", 3, 60_000).ok).toBe(true);
    expect(consumeRateLimit("test-key", 3, 60_000).ok).toBe(true);
    expect(consumeRateLimit("test-key", 3, 60_000).ok).toBe(true);
  });

  it("blocks requests over the limit", () => {
    consumeRateLimit("blocked-key", 2, 60_000);
    consumeRateLimit("blocked-key", 2, 60_000);
    const result = consumeRateLimit("blocked-key", 2, 60_000);
    expect(result.ok).toBe(false);
    expect(result.retryAfterMs).toBeGreaterThan(0);
  });
});
