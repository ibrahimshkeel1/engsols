import Link from "next/link";
import { format } from "date-fns";
import { getLiveSessions } from "@/lib/data/live";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminLivePage() {
  const sessions = await getLiveSessions();

  return (
    <div>
      <h1 className="text-2xl font-bold">Live sessions</h1>
      <p className="mt-1 text-muted-foreground">All scheduled and past live streams.</p>
      <div className="mt-8 space-y-4">
        {sessions.map((s) => (
          <Card key={s.slug} className="card-elevated">
            <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap gap-2">
                  <Badge>{s.discipline}</Badge>
                  <Badge className={s.status === "live" ? "bg-red-500/15 text-red-600" : ""}>{s.status}</Badge>
                </div>
                <h2 className="mt-2 font-semibold">{s.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {"hostName" in s && s.hostName ? s.hostName : "Host"} · {format(new Date(s.scheduledAt), "MMM d, yyyy h:mm a")}
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
