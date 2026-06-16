import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { ProfilePhotoUpload } from "@/components/profile/ProfilePhotoUpload";
import { ProfileNameForm } from "@/components/profile/ProfileNameForm";
import { Card, CardContent } from "@/components/ui/card";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/settings");

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl tracking-tight">Account settings</h1>
      <p className="mt-2 text-muted-foreground">
        Your profile photo appears on mentor listings, portfolios, and forum posts.
      </p>

      <Card className="card-elevated mt-8">
        <CardContent className="space-y-8 p-6">
          <section>
            <h2 className="font-semibold">Profile photo</h2>
            <div className="mt-4">
              <ProfilePhotoUpload name={user.full_name || "User"} initialUrl={user.avatar_url} />
            </div>
          </section>
          <section className="border-t border-border pt-8">
            <h2 className="font-semibold">Display name</h2>
            <div className="mt-4">
              <ProfileNameForm initialName={user.full_name || ""} />
            </div>
          </section>
          <section className="border-t border-border pt-8">
            <h2 className="font-semibold">Account</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium">{user.email}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Role</dt>
                <dd className="font-medium capitalize">{user.role}</dd>
              </div>
            </dl>
            <p className="mt-4 text-sm text-muted-foreground">
              To change your password, use the reset link on the{" "}
              <Link href="/login" className="text-primary hover:underline">login page</Link>{" "}
              via &quot;Forgot password&quot; in Supabase auth, or update it in your Supabase dashboard email settings.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
