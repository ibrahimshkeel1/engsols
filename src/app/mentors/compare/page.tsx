import Link from "next/link";
import { notFound } from "next/navigation";
import { getMentorBySlug } from "@/lib/data/mentors";
import { MentorAvailabilityBadges } from "@/components/mentors/MentorAvailabilityBadges";
import { Avatar } from "@/components/ui/Avatar";
import { DisciplineBadge } from "@/components/ui/DisciplineBadge";
import { MentorRating } from "@/components/mentors/MentorRating";
import { SectionReveal } from "@/components/motion/SectionReveal";

type Props = { searchParams: Promise<{ slugs?: string }> };

export const metadata = {
  title: "Compare mentors | EngSols",
  description: "Side-by-side comparison of saved mentors — rates, credentials, and goals.",
};

export default async function CompareMentorsPage({ searchParams }: Props) {
  const { slugs } = await searchParams;
  const slugList = (slugs ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);

  if (slugList.length < 2) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl">Compare mentors</h1>
        <p className="mt-4 text-muted-foreground">
          Save 2–3 mentors from their profiles, then compare them side by side.
        </p>
        <Link href="/mentors" className="mt-6 inline-flex text-primary hover:underline">
          Browse mentors →
        </Link>
        <p className="mt-4 text-sm text-muted-foreground">
          Or open from{" "}
          <Link href="/settings#saved-mentors" className="text-primary hover:underline">saved mentors</Link>
        </p>
      </div>
    );
  }

  const mentors = (await Promise.all(slugList.map((slug) => getMentorBySlug(slug)))).filter(Boolean);
  if (mentors.length < 2) notFound();

  const rows: { label: string; values: string[] }[] = [
    { label: "Company", values: mentors.map((m) => m!.company) },
    { label: "Discipline", values: mentors.map((m) => m!.discipline) },
    { label: "Monthly rate", values: mentors.map((m) => `$${m!.monthlyRate}/mo`) },
    { label: "Experience", values: mentors.map((m) => `${m!.yearsExperience} years`) },
    { label: "Rating", values: mentors.map((m) => `${m!.rating} (${m!.reviewCount} reviews)`) },
    { label: "Credentials", values: mentors.map((m) => m!.credentials.join(", ") || "—") },
    { label: "Helps with", values: mentors.map((m) => m!.goals.slice(0, 3).join(", ") || "—") },
    {
      label: "Availability",
      values: mentors.map((m) => {
        const parts = [];
        if (m!.respondsWithinHours) parts.push(`Responds in ${m!.respondsWithinHours}h`);
        if (m!.introSlotsThisWeek) parts.push("Intro slots this week");
        return parts.join(" · ") || "Usually within 48h";
      }),
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <SectionReveal>
        <p className="section-label">Decision support</p>
        <h1 className="font-display mt-1 text-3xl">Compare mentors</h1>
        <p className="mt-2 text-muted-foreground">Side-by-side view of up to three mentors you&apos;re considering.</p>
      </SectionReveal>

      <SectionReveal className="mt-10 overflow-x-auto" delay={0.1}>
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="p-3 text-start text-muted-foreground" />
              {mentors.map((m) => (
                <th key={m!.slug} className="p-3 text-start align-top">
                  <Link href={`/mentors/${m!.slug}`} className="group block rounded-xl border border-border bg-card p-4 hover:border-primary/30">
                    <Avatar name={m!.name} discipline={m!.discipline} size="md" src={m!.avatarUrl} />
                    <p className="mt-3 font-semibold group-hover:text-primary">{m!.name}</p>
                    <p className="text-xs text-muted-foreground">{m!.headline}</p>
                    <MentorRating rating={m!.rating} reviewCount={m!.reviewCount} size="sm" />
                    <MentorAvailabilityBadges mentor={m!} />
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-border">
                <td className="p-3 font-medium text-muted-foreground">{row.label}</td>
                {row.values.map((val, i) => (
                  <td key={i} className="p-3 align-top">
                    {row.label === "Discipline" ? <DisciplineBadge discipline={val} /> : val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </SectionReveal>

      <div className="mt-8 flex flex-wrap gap-3">
        {mentors.map((m) => (
          <Link
            key={m!.slug}
            href={`/mentors/${m!.slug}#book-intro`}
            className="inline-flex h-10 items-center rounded-xl bg-accent px-5 text-sm font-semibold text-accent-foreground hover:brightness-110"
          >
            Book intro with {m!.name.split(" ")[0]}
          </Link>
        ))}
      </div>
    </div>
  );
}
