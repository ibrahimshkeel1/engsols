import Link from "next/link";
import { signIn } from "@/actions";
import { isSupabaseConfigured, getSupabaseConfigError } from "@/lib/supabase/config";
import { safeDecodeURIComponent } from "@/lib/utils/safe-decode";
import { getSafeNextPath } from "@/lib/safe-next";
import { FormField } from "@/components/ui/FormField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

type Props = { searchParams: Promise<{ message?: string; error?: string; next?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabaseReady = isSupabaseConfigured();
  const configError = getSupabaseConfigError();
  const next = getSafeNextPath(params.next);

  return (
    <div className="gradient-hero flex min-h-[70vh] items-center py-12">
      <div className="mx-auto w-full max-w-md px-4 sm:px-6">
        <p className="text-center section-label">Welcome back</p>
        <h1 className="mt-2 text-center font-display text-3xl tracking-tight">Sign in to EngSols</h1>
        <p className="mt-2 text-center text-muted-foreground">Mentorship, portfolios, and your community in one place.</p>
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
            <form action={signIn} className="space-y-4">
              {next && <input type="hidden" name="next" value={next} />}
              <FormField label="Email or username" id="login-email">
                <Input name="email" required type="text" placeholder="admin" autoComplete="username" />
              </FormField>
              <FormField label="Password" id="login-password">
                <Input name="password" required type="password" placeholder="••••••••" autoComplete="current-password" />
              </FormField>
              <SubmitButton variant="accent" className="w-full" pendingLabel="Signing in...">
                Log in
              </SubmitButton>
            </form>
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
