import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getApprovedMentors } from "@/lib/data/mentors";
import { createClient } from "@/lib/supabase/server";
import { goals } from "@/data/goals";
import { engineeringSkills } from "@/data/engineering-skills";
import { MentorCard } from "@/components/mentors/MentorCard";
import { Card, CardContent } from "@/components/ui/card";

export default async function AssistPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/assist");

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("career_goals")
    .eq("id", user.id)
    .single();

  const mentors = await getApprovedMentors();
  const userGoals: string[] = profile?.career_goals?.length
    ? profile.career_goals
    : goals.map((g) => g.label);

  const goalIds = goals.filter((g) => userGoals.some((ug: string) => ug.includes(g.label) || g.label.includes(ug))).map((g) => g.id);

  const scored = mentors
    .map((m) => {
      let score = 0;
      score += m.goals.filter((g) => goalIds.includes(g)).length * 2;
      score += m.rating * (m.reviewCount > 0 ? 0.5 : 0);
      if (m.verified) score += 1;
      return { mentor: m, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  const recommendations = scored.length > 0
    ? scored
    : mentors
        .filter((m) => m.reviewCount > 0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6)
        .map((mentor) => ({ mentor, score: 0 }));

  const tips = [
    "Update your portfolio with recent projects — mentors respond faster to specific experience.",
    "Set career goals in Settings so matching improves over time.",
    "Join forum discussions in your discipline to build visibility before booking calls.",
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl tracking-tight">Career assist</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Personalized mentor suggestions based on your goals and discipline. No external AI — matching uses your profile data.
      </p>

      <Card className="card-elevated mt-8">
        <CardContent className="p-6">
          <h2 className="font-semibold">Your focus areas</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {userGoals.slice(0, 5).map((g) => (
              <li key={g} className="rounded-lg bg-muted px-3 py-1 text-sm">{g}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <h2 className="mt-10 text-xl font-bold">Recommended mentors</h2>
      {recommendations.length === 0 ? (
        <p className="mt-4 text-muted-foreground">
          Complete onboarding or set career goals in{" "}
          <Link href="/settings" className="text-primary hover:underline">Settings</Link>{" "}
          for better matches.
        </p>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.map(({ mentor }) => (
            <MentorCard key={mentor.slug} mentor={mentor} />
          ))}
        </div>
      )}

      <h2 className="mt-12 text-xl font-bold">Skill graph highlights</h2>
      <p className="mt-2 text-sm text-muted-foreground">Related competencies in your field</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {engineeringSkills
          .slice(0, 8)
          .map((s) => (
            <Link
              key={s.id}
              href={`/mentors?search=${encodeURIComponent(s.label)}`}
              className="rounded-xl border border-border bg-card px-4 py-2 text-sm hover:border-primary/40"
            >
              {s.label}
            </Link>
          ))}
      </div>

      <h2 className="mt-12 text-xl font-bold">Quick tips</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
        {tips.map((t) => <li key={t}>{t}</li>)}
      </ul>
    </div>
  );
}
