import { describe, expect, it } from "vitest";
import { getSafeNextPath } from "@/lib/safe-next";

describe("getSafeNextPath", () => {
  it("allows same-origin paths", () => {
    expect(getSafeNextPath("/forum/my-post")).toBe("/forum/my-post");
    expect(getSafeNextPath("/live/session/room")).toBe("/live/session/room");
  });

  it("blocks external and protocol-relative redirects", () => {
    expect(getSafeNextPath("//evil.com")).toBeNull();
    expect(getSafeNextPath("https://evil.com")).toBeNull();
    expect(getSafeNextPath("/\\evil.com")).toBeNull();
    expect(getSafeNextPath("/%2f%2fevil.com")).toBeNull();
  });

  it("blocks auth loop paths", () => {
    expect(getSafeNextPath("/login")).toBeNull();
    expect(getSafeNextPath("/signup?ref=1")).toBeNull();
  });

  it("rejects empty and non-path values", () => {
    expect(getSafeNextPath("")).toBeNull();
    expect(getSafeNextPath(null)).toBeNull();
    expect(getSafeNextPath("forum/no-leading-slash")).toBeNull();
  });
});
