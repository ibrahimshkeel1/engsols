import { logger } from "@/lib/logger";

/** Detect Next.js redirect() throws so catch blocks can rethrow them. */
export function isNextRedirect(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest: unknown }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

export function parseImageUrls(raw: FormDataEntryValue | null): string[] {
  if (!raw || typeof raw !== "string" || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((url): url is string => typeof url === "string")
      .filter((url) => url.startsWith("https://"))
      .slice(0, 6);
  } catch (e) {
    logger.warn("action-utils", "Invalid image JSON in FormData", {
      raw: raw.slice(0, 200),
    });
    return [];
  }
}
