import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Mentor } from "@/types";
import { avatarUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type MentorCardProps = {
  mentor: Mentor;
  showPrice?: boolean;
};

export function MentorCard({ mentor, showPrice = true }: MentorCardProps) {
  return (
    <Card className="card-elevated h-full transition hover:border-primary/30 hover:shadow-lg">
      <CardContent className="flex h-full flex-col p-6">
        <div className="flex items-start gap-3">
          <Image
            src={avatarUrl(mentor.name)}
            alt={mentor.name}
            width={56}
            height={56}
            className="rounded-full ring-2 ring-border"
            unoptimized
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 text-primary">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="text-sm font-medium">{mentor.rating.toFixed(1)}</span>
            </div>
            <h3 className="truncate font-semibold">{mentor.name}</h3>
            <p className="text-sm text-muted-foreground">{mentor.headline}</p>
            <p className="text-xs text-muted-foreground">{mentor.company}</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge className="bg-primary/10 text-primary">{mentor.discipline}</Badge>
          {mentor.skills.slice(0, 2).map((skill) => (
            <Badge key={skill}>{skill}</Badge>
          ))}
        </div>
        {showPrice && (
          <p className="mt-auto pt-4 text-sm text-muted-foreground">
            Starting from <span className="font-semibold text-foreground">${mentor.monthlyRate}/month</span>
          </p>
        )}
        <Link
          href={`/mentors/${mentor.slug}`}
          className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
        >
          View profile →
        </Link>
      </CardContent>
    </Card>
  );
}
