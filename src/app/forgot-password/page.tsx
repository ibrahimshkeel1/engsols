import Link from "next/link";
import { requestPasswordReset } from "@/actions/auth-extra";
import { FormField } from "@/components/ui/FormField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { safeDecodeURIComponent } from "@/lib/utils/safe-decode";

type Props = { searchParams: Promise<{ error?: string; message?: string }> };

export default async function ForgotPasswordPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl tracking-tight">Reset password</h1>
      <p className="mt-2 text-muted-foreground">We&apos;ll email you a link to set a new password.</p>
      {params.error && (
        <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-600">{safeDecodeURIComponent(params.error)}</p>
      )}
      {params.message && (
        <p className="mt-4 rounded-xl bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
          {safeDecodeURIComponent(params.message)}
        </p>
      )}
      <Card className="card-elevated mt-8">
        <CardContent className="p-6">
          <form action={requestPasswordReset} className="space-y-4">
            <FormField label="Email" id="reset-email">
              <Input name="email" type="email" required autoComplete="email" />
            </FormField>
            <SubmitButton variant="accent" className="w-full" pendingLabel="Sending...">
              Send reset link
            </SubmitButton>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            <Link href="/login" className="text-primary hover:underline">Back to login</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
