"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";
import { getSupabaseConfigError } from "@/lib/supabase/config";
import { ensureUserProfile } from "@/lib/supabase/profile";
import { getSafeNextPath } from "@/lib/safe-next";
import { resolvePostAuthRedirectPath } from "@/lib/post-auth-redirect";
import { consumeRateLimit, getRequestRateLimitKey } from "@/lib/rate-limit";
import { isNextRedirect } from "@/lib/action-utils";

async function redirectAfterSignIn(
  supabase: Awaited<ReturnType<typeof createClient>>,
  user: User,
  nextPath?: string | null,
) {
  try {
    const path = await resolvePostAuthRedirectPath(supabase, user, nextPath);
    revalidatePath("/", "layout");
    redirect(path);
  } catch {
    redirect(
      "/login?error=" +
        encodeURIComponent("Could not load your profile. Run supabase/migrations/003_profile_trigger.sql, then try again."),
    );
  }
}

const AUTH_RATE_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_ATTEMPT_LIMIT = 10;
const SIGNUP_ATTEMPT_LIMIT = 5;

function redirectRateLimited(path: "/login" | "/signup"): never {
  redirect(
    `${path}?error=${encodeURIComponent("Too many attempts. Please wait a few minutes and try again.")}`,
  );
}

export async function signUp(formData: FormData) {
  const configError = getSupabaseConfigError();
  if (configError) {
    redirect("/signup?error=" + encodeURIComponent(configError));
  }

  try {
    const supabase = await createClient();
    const email = ((formData.get("email") as string | null) ?? "").trim();
    const password = (formData.get("password") as string | null) ?? "";
    const fullName = ((formData.get("fullName") as string | null) ?? "").trim();
    const role = (formData.get("role") as string | null) ?? "student";
    const next = getSafeNextPath(formData.get("next") as string | null);

    if (!email || !password || !fullName) {
      redirect("/signup?error=" + encodeURIComponent("Fill in all required fields"));
    }

    const signupKey = await getRequestRateLimitKey(`signup:${email.toLowerCase()}`);
    if (!consumeRateLimit(signupKey, SIGNUP_ATTEMPT_LIMIT, AUTH_RATE_WINDOW_MS).ok) {
      redirectRateLimited("/signup");
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
        emailRedirectTo: `${siteUrl}/auth/callback`,
      },
    });

    if (error) redirect(`/signup?error=${encodeURIComponent(error.message)}`);

    if (data.user && data.session) {
      await ensureUserProfile(supabase, data.user);
      revalidatePath("/", "layout");

      if (next) redirect(next);
      if (role === "mentor") redirect("/onboarding/mentor");
      redirect("/onboarding/student");
    }

    redirect(
      "/login?message=" +
        encodeURIComponent(
          "Account created. Check your email to confirm, then log in. (Or disable email confirmation in Supabase → Authentication → Providers → Email.)",
        ),
    );
  } catch (error) {
    if (isNextRedirect(error)) throw error;
    const message = error instanceof Error ? error.message : "Sign-up failed";
    redirect(`/signup?error=${encodeURIComponent(message)}`);
  }
}

export async function signIn(formData: FormData) {
  const configError = getSupabaseConfigError();
  if (configError) {
    redirect("/login?error=" + encodeURIComponent(configError));
  }

  try {
    const supabase = await createClient();
    const emailInput = ((formData.get("email") as string | null) ?? "").trim();
    const password = (formData.get("password") as string | null) ?? "";
    const nextPath = (formData.get("next") as string | null) ?? null;

    if (!emailInput || !password) {
      redirect("/login?error=" + encodeURIComponent("Enter username and password"));
    }

    const email = emailInput.includes("@") ? emailInput : `${emailInput}@engsols.com`;
    const loginKey = await getRequestRateLimitKey(`login:${email.toLowerCase()}`);
    if (!consumeRateLimit(loginKey, LOGIN_ATTEMPT_LIMIT, AUTH_RATE_WINDOW_MS).ok) {
      redirectRateLimited("/login");
    }

    const { data: signInData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      const message =
        authError.message.includes("Invalid path specified in request URL")
          ? "Supabase URL is misconfigured. In Vercel, set NEXT_PUBLIC_SUPABASE_URL to https://YOUR-PROJECT.supabase.co (no /rest/v1)."
          : authError.message;
      redirect(`/login?error=${encodeURIComponent(message)}`);
    }

    const user = signInData.user;
    if (!user) {
      redirect("/login?error=" + encodeURIComponent("Sign-in failed. Try again."));
    }

    if (process.env.ENFORCE_EMAIL_VERIFICATION === "true" && !user.email_confirmed_at) {
      await supabase.auth.signOut();
      redirect(
        "/login?error=" +
          encodeURIComponent("Please confirm your email before signing in. Check your inbox for the verification link."),
      );
    }

    await redirectAfterSignIn(supabase, user, nextPath);
  } catch (error) {
    if (isNextRedirect(error)) throw error;
    const message = error instanceof Error ? error.message : "Sign-in failed";
    redirect(`/login?error=${encodeURIComponent(message)}`);
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function signInWithGoogle(nextPath?: string) {
  const configError = getSupabaseConfigError();
  if (configError) {
    redirect("/login?error=" + encodeURIComponent(configError));
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const safeNext = getSafeNextPath(nextPath);
  const redirectTo = safeNext
    ? `${siteUrl}/auth/callback?next=${encodeURIComponent(safeNext)}`
    : `${siteUrl}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });

  if (error || !data.url) {
    redirect("/login?error=" + encodeURIComponent(error?.message ?? "Google sign-in failed"));
  }

  redirect(data.url);
}

export async function updateProfileAvatar(avatarUrl: string, avatarFocusY?: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const focus =
    avatarFocusY === undefined ? undefined : Math.min(1, Math.max(0, avatarFocusY));

  const { error } = await supabase
    .from("profiles")
    .update({
      avatar_url: avatarUrl,
      ...(focus !== undefined ? { avatar_focus_y: focus } : {}),
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/mentors");
  revalidatePath("/portfolios");
  revalidatePath("/settings");
  return { success: true };
}

export async function updateAvatarFocus(avatarFocusY: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const focus = Math.min(1, Math.max(0, avatarFocusY));
  const { error } = await supabase
    .from("profiles")
    .update({ avatar_focus_y: focus })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/mentors");
  revalidatePath("/portfolios");
  revalidatePath("/settings");
  return { success: true };
}

export async function clearProfileAvatar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: null, avatar_focus_y: 0 })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/mentors");
  revalidatePath("/portfolios");
  revalidatePath("/settings");
  return { success: true };
}

export async function updateProfileName(fullName: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const trimmed = fullName.trim();
  if (!trimmed) return { error: "Name is required" };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: trimmed })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/settings");
  return { success: true };
}
