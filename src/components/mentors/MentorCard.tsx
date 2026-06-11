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
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardContent className="flex h-full flex-col">
        <div className="flex items-start gap-3">
          <Image
            src={avatarUrl(mentor.name)}
            alt={mentor.name}
            width={56}
            height={56}
            className="rounded-full bg-slate-100"
            unoptimized
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="text-sm font-medium">{mentor.rating.toFixed(1)}</span>
            </div>
            <h3 className="truncate font-semibold text-slate-900">{mentor.name}</h3>
            <p className="text-sm text-slate-600">{mentor.headline}</p>
            <p className="text-xs text-slate-500">{mentor.company}</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge className="bg-amber-50 text-amber-800">{mentor.discipline}</Badge>
          {mentor.skills.slice(0, 2).map((skill) => (
            <Badge key={skill}>{skill}</Badge>
          ))}
        </div>
        {showPrice && (
          <p className="mt-auto pt-4 text-sm text-slate-600">
            Starting from <span className="font-semibold text-slate-900">${mentor.monthlyRate}/month</span>
          </p>
        )}
        <Link
          href={`/mentors/${mentor.slug}`}
          className="mt-3 inline-flex text-sm font-medium text-amber-600 hover:text-amber-700"
        >
          View profile →
        </Link>
      </CardContent>
    </Card>
  );
}
