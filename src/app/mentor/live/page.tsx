import Link from "next/link";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getLiveSessionsForHost } from "@/lib/data/live";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function MentorLivePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const sessions = await getLiveSessionsForHost(user.id);

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Live sessions</h1>
          <p className="mt-1 text-muted-foreground">Sessions you&apos;ve scheduled for the community.</p>
        </div>
        <Link href="/mentor/live/new" className="inline-flex h-10 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:brightness-110">
          Schedule session
        </Link>
      </div>
      <div className="mt-8 space-y-4">
        {sessions.length === 0 && (
          <Card className="card-elevated">
            <CardContent className="p-8 text-center text-muted-foreground">
              No sessions yet. Schedule your first live Q&A or workshop.
            </CardContent>
          </Card>
        )}
        {sessions.map((s) => (
          <Card key={s.id} className="card-elevated">
            <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex gap-2">
                  <Badge>{s.discipline}</Badge>
                  <Badge className="capitalize">{s.status}</Badge>
                </div>
                <h2 className="mt-2 font-semibold">{s.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {format(new Date(s.scheduled_at), "MMM d, yyyy h:mm a")}
                </p>
              </div>
              <Link href={`/live/${s.slug}`} className="text-sm font-medium text-primary hover:underline">
                View →
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
