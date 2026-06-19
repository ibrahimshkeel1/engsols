"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseConfigError } from "@/lib/supabase/config";

export async function requestPasswordReset(formData: FormData) {
  const configError = getSupabaseConfigError();
  if (configError) redirect(`/forgot-password?error=${encodeURIComponent(configError)}`);

  const email = ((formData.get("email") as string) || "").trim();
  if (!email) redirect("/forgot-password?error=" + encodeURIComponent("Enter your email"));

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/settings/password`,
  });

  if (error) redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`);
  redirect("/forgot-password?message=" + encodeURIComponent("Check your email for a reset link."));
}

export async function updatePassword(formData: FormData) {
  const password = (formData.get("password") as string) || "";
  const confirm = (formData.get("confirm") as string) || "";

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }
  if (password !== confirm) {
    return { error: "Passwords do not match" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };

  revalidatePath("/settings");
  return { success: true };
}
