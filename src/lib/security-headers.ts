import type { NextResponse } from "next/server";

/**
 * Security headers applied on every response.
 * CSP is permissive enough for Next.js hydration, Supabase, LiveKit, and analytics.
 */
export function applySecurityHeaders(response: NextResponse): NextResponse {
  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://browser.sentry-cdn.com https://www.googletagmanager.com https://plausible.io",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.livekit.cloud wss://*.livekit.cloud https://*.sentry.io https://www.google-analytics.com https://plausible.io",
    "media-src 'self' blob: https:",
    "frame-src 'self' https:",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(self), microphone=(self), geolocation=()");

  return response;
}
