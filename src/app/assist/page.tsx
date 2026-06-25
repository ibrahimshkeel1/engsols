import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getApprovedMentors } from "@/lib/data/mentors";
import { createClient } from "@/lib/supabase/server";
import { getCareerAssist } from "@/lib/ai-assist";
import { buildSkillGraph } from "@/lib/skills-graph";
import { MentorCard } from "@/components/mentors/MentorCard";
import { ProfileBentoGrid } from "@/components/ui/ProfileBentoGrid";
import { Card, CardContent } from "@/components/ui/card";
import { AssistSkillGraph } from "@/components/assist/AssistSkillGraph";

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
    : ["Land first engineering role", "Pass FE/PE exam", "Improve technical interviews"];

  const assist = await getCareerAssist({ goals: userGoals, mentors });
  const recommendations = assist.mentorSlugs
    .map((slug) => mentors.find((m) => m.slug === slug))
    .filter(Boolean);

  const skillGraph = buildSkillGraph(mentors);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl tracking-tight">Career assist</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        {assist.usedAi
          ? "AI-powered mentor matching based on your goals and profile."
          : "Personalized mentor suggestions based on your goals. Set OPENAI_API_KEY for AI-enhanced matching."}
      </p>

      <Card className="card-elevated mt-8">
        <CardContent className="p-6">
          <h2 className="font-semibold">Your focus areas</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {userGoals.slice(0, 5).map((g) => (
              <li key={g} className="rounded-lg bg-muted px-3 py-1 text-sm">{g}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">{assist.summary}</p>
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
        <ProfileBentoGrid
          className="mt-6"
          items={recommendations.filter((m): m is NonNullable<typeof m> => Boolean(m))}
          getKey={(mentor) => mentor.slug}
          isFeatured={(mentor) => mentor.featured}
          animated={false}
          renderCard={(mentor) => <MentorCard mentor={mentor} />}
        />
      )}

      <h2 className="mt-12 text-xl font-bold">Interactive skill graph</h2>
      <p className="mt-2 text-sm text-muted-foreground">Click a skill bubble to find mentors with that expertise</p>
      <div className="card-elevated mt-4 rounded-2xl border border-border bg-card p-6">
        <AssistSkillGraph nodes={skillGraph} />
      </div>

      <h2 className="mt-12 text-xl font-bold">Quick tips</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
        {assist.tips.map((t) => <li key={t}>{t}</li>)}
      </ul>
    </div>
  );
}
