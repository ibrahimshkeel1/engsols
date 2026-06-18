import Link from "next/link";
import { sessionTypes } from "@/data/sessionTypes";
import { Card, CardContent } from "@/components/ui/card";

export function OneOffSessions() {
  return (
    <section className="bg-muted/50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-bold text-foreground">
          Not sure if mentorship is right for you? Try a one-off session
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          Book a focused call with an expert — intro chats, study plans, or interview prep.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {sessionTypes.map((session) => (
            <Card key={session.id} className="flex flex-col">
              <CardContent className="flex flex-1 flex-col">
                <h3 className="text-lg font-semibold text-foreground">{session.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{session.description}</p>
                <p className="mt-4 text-sm text-muted-foreground">
                  From <span className="text-lg font-bold text-foreground">${session.price}</span>/session
                </p>
                <Link
                  href={`/mentors?session=${session.id}`}
                  className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl border border-border bg-card text-sm font-semibold hover:border-primary/40"
                >
                  Find a mentor
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
