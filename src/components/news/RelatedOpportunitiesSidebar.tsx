import Link from "next/link";
import { Award, GraduationCap, Users } from "lucide-react";
import { getRelatedOpportunities } from "@/lib/data/news";
import { Avatar } from "@/components/ui/Avatar";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  discipline: string;
  className?: string;
};

export async function RelatedOpportunitiesSidebar({ discipline, className }: Props) {
  const { mentors, certification, exam } = await getRelatedOpportunities(discipline);

  if (!mentors.length && !certification && !exam) return null;

  return (
    <aside className={className}>
      <div className="space-y-5">
        <Card className="card-elevated overflow-hidden">
          <CardContent className="p-0">
            <div className="border-b border-border bg-zone-news/5 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-zone-news">Related opportunities</p>
              <h3 className="mt-1 font-semibold">Grow in {discipline}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Mentors, exams, and certification paths matched to this article.
              </p>
            </div>

            {mentors.length > 0 && (
              <div className="border-b border-border px-5 py-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Users className="h-4 w-4 text-zone-news" aria-hidden />
                  Top mentors
                </div>
                <ul className="mt-3 space-y-2">
                  {mentors.map((mentor) => (
                    <li key={mentor.slug}>
                      <Link
                        href={`/mentors/${mentor.slug}`}
                        className="flex items-center gap-3 rounded-xl p-2 transition-all duration-200 hover:bg-muted/70 active:scale-[0.99]"
                      >
                        <Avatar name={mentor.name} discipline={mentor.discipline} size="sm" src={mentor.avatarUrl} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{mentor.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{mentor.headline}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/mentors?discipline=${encodeURIComponent(discipline)}`}
                  className="mt-3 inline-block text-sm font-medium text-zone-news hover:underline"
                >
                  Browse all {discipline} mentors →
                </Link>
              </div>
            )}

            {certification && (
              <div className="px-5 py-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Award className="h-4 w-4 text-zone-news" aria-hidden />
                  Certification track
                </div>
                <Link
                  href={`/certifications/${certification.slug}`}
                  className="card-interactive mt-3 block rounded-xl border border-border bg-card p-4"
                >
                  <p className="font-medium">{certification.name}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{certification.description}</p>
                  <p className="mt-3 text-xs font-medium text-zone-news">View certification path →</p>
                </Link>
              </div>
            )}

            {!certification && exam && (
              <div className="px-5 py-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <GraduationCap className="h-4 w-4 text-zone-news" aria-hidden />
                  Practice exam
                </div>
                <Link
                  href={`/certifications/exams/${exam.slug}`}
                  className="card-interactive mt-3 block rounded-xl border border-border bg-card p-4"
                >
                  <p className="font-medium">{exam.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{exam.description}</p>
                  <p className="mt-3 text-xs font-medium text-zone-news">
                    {exam.isPremium ? "Premium practice exam →" : "Start practice exam →"}
                  </p>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
