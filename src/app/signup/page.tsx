import Link from "next/link";
import { signUp } from "@/actions";
import { getSupabaseConfigError, isSupabaseConfigured } from "@/lib/supabase/config";
import { safeDecodeURIComponent } from "@/lib/utils/safe-decode";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function SignupPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabaseReady = isSupabaseConfigured();
  const configError = getSupabaseConfigError();

  return (
    <div className="gradient-hero flex min-h-[70vh] items-center py-12">
      <div className="mx-auto w-full max-w-md px-4 sm:px-6">
        <p className="text-center section-label">Get started</p>
        <h1 className="mt-2 text-center font-display text-3xl tracking-tight">Join EngSols</h1>
        <p className="mt-2 text-center text-muted-foreground">Students get mentorship. Professionals can apply to mentor.</p>
        {!supabaseReady && (
          <p className="mt-4 rounded-xl bg-amber-500/10 px-4 py-3 text-center text-sm text-amber-800 dark:text-amber-200">
            {configError ?? "Supabase is not configured on this deployment."}
          </p>
        )}
        {params.error && (
          <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-center text-sm text-red-600">
            {safeDecodeURIComponent(params.error)}
          </p>
        )}
        <Card className="card-elevated mt-8">
          <CardContent className="p-6">
            <form action={signUp} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Full name</label>
                <Input name="fullName" required placeholder="Your name" className="mt-1.5" />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input name="email" required type="email" placeholder="you@example.com" className="mt-1.5" />
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <Input name="password" required type="password" minLength={8} placeholder="At least 8 characters" className="mt-1.5" />
              </div>
              <div>
                <label className="text-sm font-medium">I am a...</label>
                <Select name="role" required className="mt-1.5 w-full" defaultValue="student">
                  <option value="student">Student / Graduate</option>
                  <option value="mentor">Mentor / Professional</option>
                </Select>
              </div>
              <Button type="submit" variant="accent" className="w-full">Create account</Button>
            </form>
            <p className="mt-5 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">Log in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
