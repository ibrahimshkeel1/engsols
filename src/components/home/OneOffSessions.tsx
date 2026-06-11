import { sessionTypes } from "@/data/sessionTypes";
import { ComingSoonButton } from "@/components/shared/ComingSoonButton";
import { Card, CardContent } from "@/components/ui/card";

export function OneOffSessions() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-bold text-slate-900">
          Not sure if mentorship is right for you? Try a one-off session
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">
          A quick call with an expert is one click away. Pick a brain, talk through an issue,
          or get to know an industry veteran.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {sessionTypes.map((session) => (
            <Card key={session.id} className="flex flex-col">
              <CardContent className="flex flex-1 flex-col">
                <h3 className="text-lg font-semibold text-slate-900">{session.title}</h3>
                <p className="mt-2 flex-1 text-sm text-slate-600">{session.description}</p>
                <p className="mt-4 text-sm text-slate-500">
                  Starting from <span className="text-lg font-bold text-slate-900">${session.price}</span>/call
                </p>
                <ComingSoonButton variant="outline" className="mt-4 w-full">
                  Book session
                </ComingSoonButton>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
