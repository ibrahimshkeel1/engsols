import Link from "next/link";
import { signUp } from "@/actions";
import { getSupabaseConfigError, isSupabaseConfigured } from "@/lib/supabase/config";
import { safeDecodeURIComponent } from "@/lib/utils/safe-decode";
import { FormField } from "@/components/ui/FormField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Input, Select } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { SignupHeader } from "@/components/auth/AuthPageHeader";
import { getSafeNextPath } from "@/lib/safe-next";

type Props = { searchParams: Promise<{ error?: string; next?: string }> };

export default async function SignupPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabaseReady = isSupabaseConfigured();
  const configError = getSupabaseConfigError();
  const next = getSafeNextPath(params.next);

  return (
    <div className="gradient-hero flex min-h-[70vh] items-center py-12">
      <div className="mx-auto w-full max-w-md px-4 sm:px-6">
        <SignupHeader />
        {!supabaseReady && (
          <p className="mt-4 rounded-xl bg-amber-500/10 px-4 py-3 text-center text-sm text-amber-800">
            {configError ?? "Supabase is not configured on this deployment."}
          </p>
        )}
        {params.error && (
          <p className="mt-4 rounded-xl bg-zone-news/10 px-4 py-3 text-center text-sm text-zone-news-on">
            {safeDecodeURIComponent(params.error)}
          </p>
        )}
        <Card className="card-elevated mt-8">
          <CardContent className="p-6">
            <form action={signUp} className="space-y-4">
              {next && <input type="hidden" name="next" value={next} />}
              <FormField label="Full name" id="signup-name">
                <Input name="fullName" required autoComplete="name" />
              </FormField>
              <FormField label="Email" id="signup-email">
                <Input name="email" required type="email" autoComplete="email" />
              </FormField>
              <FormField label="Password" id="signup-password" hint="At least 8 characters">
                <Input name="password" required type="password" minLength={8} autoComplete="new-password" />
              </FormField>
              <FormField label="I am a..." id="signup-role">
                <Select name="role" required className="w-full" defaultValue="student">
                  <option value="student">Student / Graduate</option>
                  <option value="mentor">Mentor / Professional</option>
                </Select>
              </FormField>
              <SubmitButton variant="accent" className="w-full" pendingLabel="Creating account...">
                Create account
              </SubmitButton>
            </form>
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or</span></div>
            </div>
            <GoogleSignInButton nextPath={next ?? undefined} />
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
