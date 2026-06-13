/** Project root only — e.g. https://abcdefgh.supabase.co (no /rest/v1 or /auth/v1). */
export function normalizeSupabaseUrl(raw: string): string {
  let url = raw.trim();
  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is empty.");
  }

  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  const parsed = new URL(url);
  let path = parsed.pathname.replace(/\/+$/, "");
  path = path.replace(/\/rest\/v1$/, "").replace(/\/auth\/v1$/, "");

  if (path && path !== "/") {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL must be your project root (https://your-project.supabase.co), not an API path.",
    );
  }

  return parsed.origin;
}

export function getSupabaseUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) return null;
  try {
    return normalizeSupabaseUrl(raw);
  } catch {
    return null;
  }
}

export function getSupabaseAnonKey(): string | null {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  return key || null;
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

export function getSupabaseConfigError(): string | null {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!rawUrl || !key) {
    return "Supabase is not connected. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel → Settings → Environment Variables.";
  }

  try {
    normalizeSupabaseUrl(rawUrl);
  } catch (error) {
    return error instanceof Error ? error.message : "Invalid NEXT_PUBLIC_SUPABASE_URL.";
  }

  return null;
}
