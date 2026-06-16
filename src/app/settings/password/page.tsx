import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { PasswordUpdateForm } from "@/components/auth/PasswordUpdateForm";
import { Card, CardContent } from "@/components/ui/card";

export default async function PasswordSettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/settings/password");

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <Link href="/settings" className="text-sm text-primary hover:underline">← Settings</Link>
      <h1 className="mt-4 font-display text-3xl tracking-tight">Change password</h1>
      <Card className="card-elevated mt-8">
        <CardContent className="p-6">
          <PasswordUpdateForm />
        </CardContent>
      </Card>
    </div>
  );
}
