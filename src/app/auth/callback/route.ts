import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { resolvePostAuthRedirectPath } from "@/lib/post-auth-redirect";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      try {
        const path = await resolvePostAuthRedirectPath(supabase, data.user, next);
        return NextResponse.redirect(`${origin}${path}`);
      } catch {
        return NextResponse.redirect(
          `${origin}/login?error=${encodeURIComponent("Could not load your profile after sign-in.")}`,
        );
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
