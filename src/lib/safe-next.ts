/** Returns a same-origin path safe for post-login redirect, or null. */
export function getSafeNextPath(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const next = raw.trim();
  if (!next.startsWith("/") || next.startsWith("//")) return null;
  if (next.startsWith("/login") || next.startsWith("/signup")) return null;
  return next;
}
