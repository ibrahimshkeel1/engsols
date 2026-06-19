import Link from "next/link";
import { isSupabaseConfigured, getSupabaseConfigError } from "@/lib/supabase/config";
import { safeDecodeURIComponent } from "@/lib/utils/safe-decode";
import { getSafeNextPath } from "@/lib/safe-next";
import { LoginForm } from "@/components/auth/LoginForm";
import { Card, CardContent } from "@/components/ui/card";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { LoginHeader } from "@/components/auth/AuthPageHeader";

type Props = { searchParams: Promise<{ message?: string; error?: string; next?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabaseReady = isSupabaseConfigured();
  const configError = getSupabaseConfigError();
  const next = getSafeNextPath(params.next);

  return (
    <div className="gradient-hero flex min-h-[70vh] items-center py-12">
      <div className="mx-auto w-full max-w-md px-4 sm:px-6">
        <LoginHeader />
        {!supabaseReady && (
          <p className="mt-4 rounded-xl bg-amber-500/10 px-4 py-3 text-center text-sm text-amber-800 dark:text-amber-200">
            {configError ?? "Supabase is not configured on this deployment. Add API keys in Vercel → Settings → Environment Variables."}
          </p>
        )}
        {params.message && (
          <p className="mt-4 rounded-xl bg-primary/10 px-4 py-3 text-center text-sm text-primary">
            {safeDecodeURIComponent(params.message)}
          </p>
        )}
        {params.error && (
          <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-center text-sm text-red-600">
            {safeDecodeURIComponent(params.error)}
          </p>
        )}
        <Card className="card-elevated mt-8">
          <CardContent className="p-6">
            <LoginForm next={next} />
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or</span></div>
            </div>
            <GoogleSignInButton nextPath={next ?? undefined} />
            <p className="mt-5 text-center text-sm text-muted-foreground">
              <Link href="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
            </p>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href={next ? `/signup?next=${encodeURIComponent(next)}` : "/signup"} className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
