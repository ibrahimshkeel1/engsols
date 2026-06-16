import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getMentorProfileByUserId } from "@/lib/data/mentors";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProfilePhotoUpload } from "@/components/profile/ProfilePhotoUpload";

export default async function MentorProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await getMentorProfileByUserId(user.id);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">My profile</h1>
      <p className="mt-1 text-muted-foreground">Your public mentor listing details.</p>

      <Card className="card-elevated mt-8">
        <CardContent className="p-6">
          <ProfilePhotoUpload
            name={user.full_name || "Mentor"}
            discipline={profile?.discipline}
            initialUrl={user.avatar_url}
          />
        </CardContent>
      </Card>

      {!profile ? (
        <Card className="card-elevated mt-8">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">You haven&apos;t submitted a mentor profile yet.</p>
            <Link href="/apply" className="mt-4 inline-flex h-10 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground">
              Apply now
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="card-elevated mt-8">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-4">
              <Avatar name={user.full_name || "Mentor"} discipline={profile.discipline} size="lg" src={user.avatar_url} />
              <div className="flex items-center gap-2">
              <Badge className="capitalize">{profile.status}</Badge>
              {profile.status === "approved" && (
                <Link href={`/mentors/${profile.slug}`} className="text-sm text-primary hover:underline">
                  View public page →
                </Link>
              )}
            </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Headline</p>
              <p className="font-medium">{profile.headline}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Company & discipline</p>
              <p>{profile.company} · {profile.discipline}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bio</p>
              <p className="text-sm leading-relaxed">{profile.bio}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s: string) => <Badge key={s}>{s}</Badge>)}
            </div>
            <Link href="/apply" className="inline-block text-sm font-medium text-primary hover:underline">
              Update application →
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
