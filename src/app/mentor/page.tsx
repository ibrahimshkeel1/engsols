import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getMentorProfileByUserId } from "@/lib/data/mentors";
import { getLiveSessionsForHost } from "@/lib/data/live";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default async function MentorDashboardPage() {
  const user = await getCurrentUser();
  const profile = user ? await getMentorProfileByUserId(user.id) : null;
  const sessions = user ? await getLiveSessionsForHost(user.id) : [];

  return (
    <div>
      <h1 className="text-2xl font-bold">Mentor dashboard</h1>
      <p className="mt-1 text-muted-foreground">Manage your profile and live sessions.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card className="card-elevated">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Profile status</p>
            <div className="mt-2 flex items-center gap-2">
              <p className="text-2xl font-bold capitalize">{profile?.status ?? "none"}</p>
              {profile?.status === "pending" && <Badge className="bg-primary/15 text-primary">Under review</Badge>}
            </div>
          </CardContent>
        </Card>
        <Card className="card-elevated">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Live sessions</p>
            <p className="mt-2 text-2xl font-bold">{sessions.length}</p>
          </CardContent>
        </Card>
        <Card className="card-elevated">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Monthly rate</p>
            <p className="mt-2 text-2xl font-bold">${profile?.monthly_rate ?? "—"}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card className="card-elevated">
          <CardContent className="p-6">
            <h2 className="font-semibold">Quick actions</h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/mentor/profile" className="text-primary hover:underline">Edit public profile</Link></li>
              <li><Link href="/mentor/live/new" className="text-primary hover:underline">Schedule a live session</Link></li>
              <li><Link href="/forum/new" className="text-primary hover:underline">Answer a forum question</Link></li>
            </ul>
          </CardContent>
        </Card>
        {!profile && (
          <Card className="card-elevated border-primary/30">
            <CardContent className="p-6">
              <h2 className="font-semibold">Complete your application</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Submit your mentor profile to appear in the directory after admin approval.
              </p>
              <Link href="/apply" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
                Start application →
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
