const BLOCKED_PREFIXES = ["/login", "/signup"];

/** Returns a same-origin path safe for post-login redirect, or null. */
export function getSafeNextPath(raw: string | null | undefined): string | null {
  if (!raw) return null;

  const next = raw.trim();
  if (!next.startsWith("/")) return null;
  if (next.startsWith("//")) return null;
  if (next.includes("\\") || next.includes("@")) return null;

  let decoded = next;
  try {
    decoded = decodeURIComponent(next);
  } catch {
    return null;
  }

  if (decoded.startsWith("//") || decoded.includes("://")) return null;

  for (const prefix of BLOCKED_PREFIXES) {
    if (decoded === prefix || decoded.startsWith(`${prefix}/`) || decoded.startsWith(`${prefix}?`)) {
      return null;
    }
  }

  try {
    const url = new URL(next, "http://localhost");
    if (url.hostname !== "localhost") return null;
    if (!url.pathname.startsWith("/") || url.pathname.startsWith("//")) return null;

    const safePath = url.pathname + url.search + url.hash;
    if (safePath.includes("\\") || safePath.includes("@")) return null;
    return safePath;
  } catch {
    return null;
  }
}
