import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getMentorProfileByUserId } from "@/lib/data/mentors";
import { getLiveSessionsForHost } from "@/lib/data/live";
import { getMentorBookingStats } from "@/lib/data/mentor-stats";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default async function MentorDashboardPage() {
  const user = await getCurrentUser();
  const profile = user ? await getMentorProfileByUserId(user.id) : null;
  const sessions = user ? await getLiveSessionsForHost(user.id) : [];
  const stats = profile && user
    ? await getMentorBookingStats(profile.slug, user.id)
    : null;

  return (
    <div>
      <p className="section-label text-zone-mentorship">Mentor workspace</p>
      <h1 className="mt-1 text-2xl font-bold">Mentor dashboard</h1>
      <p className="mt-1 text-muted-foreground">Manage your profile, bookings, and live sessions.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="card-elevated border-zone-mentorship/15">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Profile status</p>
            <div className="mt-2 flex items-center gap-2">
              <p className="text-2xl font-bold capitalize">{profile?.status ?? "none"}</p>
              {profile?.status === "pending" && (
                <Badge className="bg-zone-mentorship/15 text-zone-mentorship">Under review</Badge>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="card-elevated border-zone-mentorship/15">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Open bookings</p>
            <p className="mt-2 text-2xl font-bold text-zone-mentorship">{stats?.pending ?? 0}</p>
            <p className="text-xs text-muted-foreground">{stats?.total ?? 0} total requests</p>
          </CardContent>
        </Card>
        <Card className="card-elevated">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Response rate</p>
            <p className="mt-2 text-2xl font-bold">{stats?.responseRate ?? 0}%</p>
            <p className="text-xs text-muted-foreground">{stats?.reviewCount ?? 0} reviews · {stats?.avgRating?.toFixed(1) ?? "—"} avg</p>
          </CardContent>
        </Card>
        <Card className="card-elevated">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Live sessions</p>
            <p className="mt-2 text-2xl font-bold">{sessions.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card className="card-elevated">
          <CardContent className="p-6">
            <h2 className="font-semibold">Quick actions</h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/mentor/bookings" className="text-zone-mentorship hover:underline">View booking inbox ({stats?.pending ?? 0} pending)</Link></li>
              <li><Link href="/mentor/profile" className="text-zone-mentorship hover:underline">Edit public profile & Calendly links</Link></li>
              <li><Link href="/mentor/roadmaps" className="text-zone-mentorship hover:underline">Manage student roadmaps</Link></li>
              <li><Link href="/mentor/earnings" className="text-zone-mentorship hover:underline">View earnings & revenue</Link></li>
              <li><Link href="/mentor/live/new" className="text-zone-mentorship hover:underline">Schedule a live session</Link></li>
              <li><Link href="/forum/new" className="text-zone-mentorship hover:underline">Answer a forum question</Link></li>
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
