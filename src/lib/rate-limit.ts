type RateLimitEntry = {
  count: number;
  resetAt: number;
};

// In-memory buckets reset on deploy and do not share across instances.
// For production at scale, swap consumeRateLimit for Upstash Redis (@upstash/ratelimit)
// using UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN env vars.

const buckets = new Map<string, RateLimitEntry>();

const AUTH_RATE_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_ATTEMPT_LIMIT = 10;
const SIGNUP_ATTEMPT_LIMIT = 5;

export type RateLimitResult = {
  ok: boolean;
  retryAfterMs?: number;
};

export type CheckRateLimitResult =
  | { ok: true }
  | { ok: false; error: string };

const ACTION_LIMITS: Record<string, { limit: number; windowMs: number }> = {
  forum_reply: { limit: 30, windowMs: 60_000 },
  report: { limit: 10, windowMs: 60 * 60_000 },
  booking: { limit: 5, windowMs: 60 * 60_000 },
  job_application: { limit: 10, windowMs: 60 * 60_000 },
  login: { limit: LOGIN_ATTEMPT_LIMIT, windowMs: AUTH_RATE_WINDOW_MS },
  signup: { limit: SIGNUP_ATTEMPT_LIMIT, windowMs: AUTH_RATE_WINDOW_MS },
};

/** Sliding-window rate limiter (in-memory; use Redis/Upstash for multi-instance prod). */
export function consumeRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now >= entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (entry.count >= limit) {
    return { ok: false, retryAfterMs: Math.max(0, entry.resetAt - now) };
  }

  entry.count += 1;
  return { ok: true };
}

export async function getRequestRateLimitKey(suffix: string): Promise<string> {
  const { headers } = await import("next/headers");
  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || headerStore.get("x-real-ip") || "unknown";
  return `${ip}:${suffix}`;
}

export async function checkRateLimit(
  userId: string,
  action: keyof typeof ACTION_LIMITS,
): Promise<CheckRateLimitResult> {
  const config = ACTION_LIMITS[action];
  if (!config) return { ok: true };

  const key = await getRequestRateLimitKey(`${action}:${userId}`);
  const result = consumeRateLimit(key, config.limit, config.windowMs);
  if (result.ok) return { ok: true };

  return { ok: false, error: "Too many requests. Please wait a moment and try again." };
}

/** @internal test helper */
export function __resetRateLimitsForTests(): void {
  buckets.clear();
}
