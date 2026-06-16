import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { ProfilePhotoUpload } from "@/components/profile/ProfilePhotoUpload";
import { Card, CardContent } from "@/components/ui/card";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/settings");

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">Account settings</h1>
      <p className="mt-2 text-muted-foreground">
        Your profile photo appears on your mentor listing, portfolio, and forum posts.
      </p>
      <Card className="card-elevated mt-8">
        <CardContent className="p-6">
          <ProfilePhotoUpload
            name={user.full_name || "User"}
            initialUrl={user.avatar_url}
          />
        </CardContent>
      </Card>
    </div>
  );
}
