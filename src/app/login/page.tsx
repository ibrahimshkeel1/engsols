import Link from "next/link";
import { signIn } from "@/actions";
import { isSupabaseConfigured, getSupabaseConfigError } from "@/lib/supabase/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

type Props = { searchParams: Promise<{ message?: string; error?: string; next?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabaseReady = isSupabaseConfigured();
  const configError = getSupabaseConfigError();

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
          <p className="mt-4 rounded-xl bg-primary/10 px-4 py-3 text-center text-sm text-primary">{params.message}</p>
        )}
        {params.error && (
          <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-center text-sm text-red-600">{decodeURIComponent(params.error)}</p>
        )}
        <Card className="card-elevated mt-8">
          <CardContent className="p-6">
            <form action={signIn} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email or username</label>
                <Input name="email" required type="text" placeholder="admin" className="mt-1.5" autoComplete="username" />
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <Input name="password" required type="password" placeholder="••••••••" className="mt-1.5" autoComplete="current-password" />
              </div>
              <Button type="submit" variant="accent" className="w-full">Log in</Button>
            </form>
            <p className="mt-5 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-medium text-primary hover:underline">Sign up</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
