import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getApprovedMentors } from "@/lib/data/mentors";
import { getStudentOnboardingContext } from "@/lib/data/onboarding";
import { matchMentorsForStudent } from "@/lib/match-mentors";
import { requireUser } from "@/lib/require-auth";
import { Avatar } from "@/components/ui/Avatar";
import { MentorRating } from "@/components/mentors/MentorRating";
import { StepIndicator } from "@/components/shared/StepIndicator";
import { Card, CardContent } from "@/components/ui/card";

const STEPS = [{ label: "Your goal" }, { label: "Mentor matches" }, { label: "Portfolio" }];

export default async function StudentOnboardingMatchesPage() {
  const user = await requireUser("/onboarding/student/matches");
  const context = await getStudentOnboardingContext(user.id);

  if (!context.hasBasics) {
    redirect("/onboarding/student");
  }

  const mentors = await getApprovedMentors();
  const matches = matchMentorsForStudent(context.discipline, context.goal, mentors, 3);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <StepIndicator steps={STEPS} current={2} progressPercent={66} />
      <h1 className="mt-6 font-display text-3xl tracking-tight">3 mentors for you</h1>
      <p className="mt-2 text-muted-foreground">
        Based on <span className="font-medium text-foreground">{context.goal}</span> in{" "}
        <span className="font-medium text-foreground">{context.discipline}</span>.
      </p>

      {matches.length > 0 ? (
        <div className="mt-8 space-y-4">
          {matches.map((mentor) => (
            <Card key={mentor.slug} className="card-elevated overflow-hidden">
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                <Avatar name={mentor.name} discipline={mentor.discipline} size="lg" src={mentor.avatarUrl} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{mentor.name}</p>
                  <p className="text-sm text-muted-foreground">{mentor.headline}</p>
                  <p className="text-xs text-muted-foreground">{mentor.company}</p>
                  <div className="mt-2">
                    <MentorRating rating={mentor.rating} reviewCount={mentor.reviewCount} />
                  </div>
                </div>
                <Link
                  href={`/mentors/${mentor.slug}`}
                  className="inline-flex h-10 shrink-0 items-center justify-center gap-1 rounded-lg border border-border px-4 text-sm font-medium hover:bg-muted"
                >
                  View profile
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-sm text-muted-foreground">
          No exact matches yet —{" "}
          <Link href="/mentors" className="text-primary hover:underline">browse all mentors</Link>.
        </p>
      )}

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/portfolios/build"
          className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-accent text-sm font-semibold text-accent-foreground hover:brightness-110"
        >
          Build my portfolio →
        </Link>
        <Link
          href="/"
          className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-border text-sm font-medium hover:bg-muted"
        >
          Skip for now
        </Link>
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        You can book intro calls anytime from a mentor profile.
      </p>
    </div>
  );
}
