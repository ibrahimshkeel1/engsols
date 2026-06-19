import { describe, expect, it } from "vitest";
import { computeMentorEarnings, dollarsToCents } from "@/lib/data/analytics";

describe("mentor earnings analytics", () => {
  it("computes MRR and lifetime totals from paid monthly bookings", () => {
    const result = computeMentorEarnings(100, [
      {
        id: "1",
        requester_name: "Alex",
        requester_email: "alex@example.com",
        status: "contacted",
        request_type: "monthly",
        created_at: "2026-01-01T00:00:00Z",
      },
      {
        id: "2",
        requester_name: "Sam",
        requester_email: "sam@example.com",
        status: "contacted",
        request_type: "monthly",
        created_at: "2026-01-02T00:00:00Z",
      },
      {
        id: "3",
        requester_name: "Jamie",
        requester_email: "jamie@example.com",
        status: "closed",
        request_type: "monthly",
        created_at: "2025-12-01T00:00:00Z",
      },
      {
        id: "4",
        requester_name: "Riley",
        requester_email: "riley@example.com",
        status: "pending",
        request_type: "monthly",
        created_at: "2026-01-03T00:00:00Z",
      },
    ]);

    expect(dollarsToCents(100)).toBe(10000);
    expect(result.monthlyRecurringRevenueCents).toBe(20000);
    expect(result.totalLifetimeEarningsCents).toBe(30000);
    expect(result.activePaidMentees).toBe(2);
    expect(result.activeRoster).toHaveLength(2);
  });

  it("returns zero earnings when mentor rate is free", () => {
    const result = computeMentorEarnings(0, [
      {
        id: "1",
        requester_name: "Alex",
        requester_email: "alex@example.com",
        status: "contacted",
        request_type: "monthly",
        created_at: "2026-01-01T00:00:00Z",
      },
    ]);

    expect(result.monthlyRecurringRevenueCents).toBe(0);
    expect(result.totalLifetimeEarningsCents).toBe(0);
    expect(result.activePaidMentees).toBe(0);
  });
});
