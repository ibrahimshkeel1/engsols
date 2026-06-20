/**
 * Supabase connection profiles for serverless vs migration workloads.
 *
 * - Operational (serverless): port 6543 transaction pooler — SUPABASE_DB_POOLER_URL
 * - Migrations (direct): port 5432 session mode — SUPABASE_DB_DIRECT_URL (CLI / SQL editor only)
 *
 * The Supabase JS client uses HTTPS (NEXT_PUBLIC_SUPABASE_URL) and does not open Postgres sockets.
 * Use pooler URLs only for direct SQL clients (scripts, ORMs).
 */

const POOLER_PORT = "6543";
const DIRECT_PORT = "5432";

function parseDatabaseUrl(raw: string | undefined): URL | null {
  if (!raw?.trim()) return null;
  try {
    return new URL(raw.trim());
  } catch {
    return null;
  }
}

function assertPort(url: URL, expectedPort: string, label: string): void {
  if (url.port !== expectedPort) {
    throw new Error(
      `${label} must use port ${expectedPort}. Got port ${url.port || "(default)"} in ${url.hostname}.`,
    );
  }
}

/** Validates serverless operational DB URL uses the transaction pooler (6543). */
export function getOperationalDatabaseUrl(): string | null {
  const raw = process.env.SUPABASE_DB_POOLER_URL ?? process.env.DATABASE_URL;
  const url = parseDatabaseUrl(raw);
  if (!url) return null;

  if (process.env.NODE_ENV === "production") {
    assertPort(url, POOLER_PORT, "Operational database URL");
  } else if (url.port === DIRECT_PORT) {
    console.warn(
      "[engsols] DATABASE_URL uses direct port 5432. Use SUPABASE_DB_POOLER_URL (6543) for serverless workloads.",
    );
  }

  return url.toString();
}

/** Migration-only direct connection — never import from App Router code paths. */
export function getMigrationDatabaseUrl(): string | null {
  const raw = process.env.SUPABASE_DB_DIRECT_URL;
  const url = parseDatabaseUrl(raw);
  if (!url) return null;

  assertPort(url, DIRECT_PORT, "Migration database URL");
  return url.toString();
}

/**
 * Guardrail: block accidental direct Postgres usage in production serverless bundles.
 * Call from server entrypoints when DATABASE_URL is present.
 */
export function assertOperationalConnectionProfile(): void {
  const raw = process.env.DATABASE_URL;
  if (!raw || process.env.NODE_ENV !== "production") return;

  const url = parseDatabaseUrl(raw);
  if (url && url.port === DIRECT_PORT) {
    throw new Error(
      "DATABASE_URL must not use direct port 5432 in production. Set SUPABASE_DB_POOLER_URL (port 6543) for operational queries.",
    );
  }
}

export function getSupabaseApiUrl(): string | null {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? null;
}
