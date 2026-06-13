import { getAllMentorProfilesForAdmin } from "@/lib/data/mentors";
import { approveMentor, rejectMentor } from "@/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminMentorsPage() {
  const mentors = await getAllMentorProfilesForAdmin();

  return (
    <div>
      <h1 className="text-2xl font-bold">Mentor applications</h1>
      <p className="mt-1 text-muted-foreground">Approve or reject mentor profiles before they appear publicly.</p>
      <div className="mt-8 space-y-4">
        {mentors.length === 0 && (
          <Card className="card-elevated">
            <CardContent className="p-8 text-center text-muted-foreground">
              No mentor profiles yet. They will appear here when mentors apply.
            </CardContent>
          </Card>
        )}
        {mentors.map((m) => (
          <Card key={m.id} className="card-elevated">
            <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold">{m.profiles?.full_name || "Mentor"}</h2>
                  <Badge className={m.status === "approved" ? "bg-green-500/15 text-green-700 dark:text-green-400" : m.status === "pending" ? "bg-primary/15 text-primary" : ""}>
                    {m.status}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{m.headline}</p>
                <p className="mt-2 text-sm">{m.company} · {m.discipline} · {m.years_experience} yrs · ${m.monthly_rate}/mo</p>
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{m.bio}</p>
              </div>
              {m.status === "pending" && (
                <div className="flex shrink-0 gap-2">
                  <form action={approveMentor}>
                    <input type="hidden" name="id" value={m.id} />
                    <Button type="submit" variant="accent" size="sm">Approve</Button>
                  </form>
                  <form action={rejectMentor}>
                    <input type="hidden" name="id" value={m.id} />
                    <Button type="submit" variant="outline" size="sm">Reject</Button>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
