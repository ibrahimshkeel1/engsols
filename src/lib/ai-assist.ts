import type { Mentor } from "@/types";
import { matchMentorsByGoals } from "@/lib/match-mentors";

type AssistInput = {
  goals: string[];
  mentors: Mentor[];
};

type AssistResult = {
  summary: string;
  tips: string[];
  mentorSlugs: string[];
  usedAi: boolean;
};

function ruleBasedAssist({ goals, mentors }: AssistInput): AssistResult {
  const picks = matchMentorsByGoals(goals, mentors, 6);

  return {
    summary: `Based on your goals (${goals.slice(0, 3).join(", ")}), we matched mentors with relevant experience and strong reviews.`,
    tips: [
      "Update your portfolio with recent projects — mentors respond faster to specific experience.",
      "Set career goals in Settings so matching improves over time.",
      "Join forum discussions in your discipline to build visibility before booking calls.",
    ],
    mentorSlugs: picks.map((m) => m.slug),
    usedAi: false,
  };
}

export async function getCareerAssist(input: AssistInput): Promise<AssistResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || input.mentors.length === 0) {
    return ruleBasedAssist(input);
  }

  try {
    const mentorSummaries = input.mentors.slice(0, 40).map((m) => ({
      slug: m.slug,
      name: m.name,
      headline: m.headline,
      discipline: m.discipline,
      skills: m.skills.slice(0, 5),
      goals: m.goals,
      rating: m.rating,
      reviewCount: m.reviewCount,
    }));

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are a career advisor for engineering students. Return JSON: { summary: string, tips: string[3], mentorSlugs: string[] } picking up to 6 mentor slugs from the provided list.",
          },
          {
            role: "user",
            content: JSON.stringify({ userGoals: input.goals, mentors: mentorSummaries }),
          },
        ],
      }),
    });

    if (!res.ok) return ruleBasedAssist(input);

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return ruleBasedAssist(input);

    const parsed = JSON.parse(content) as { summary?: string; tips?: string[]; mentorSlugs?: string[] };
    const validSlugs = new Set(input.mentors.map((m) => m.slug));
    const mentorSlugs = (parsed.mentorSlugs ?? []).filter((s) => validSlugs.has(s)).slice(0, 6);

    if (!mentorSlugs.length) return ruleBasedAssist(input);

    return {
      summary: parsed.summary ?? "Here are mentors matched to your career goals.",
      tips: parsed.tips?.slice(0, 3) ?? ruleBasedAssist(input).tips,
      mentorSlugs,
      usedAi: true,
    };
  } catch {
    return ruleBasedAssist(input);
  }
}
