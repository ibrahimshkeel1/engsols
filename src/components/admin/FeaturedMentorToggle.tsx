"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleMentorFeatured } from "@/actions/mentor";
import { Button } from "@/components/ui/button";

export function FeaturedMentorToggle({ mentorId, featured }: { mentorId: string; featured: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await toggleMentorFeatured(mentorId, !featured);
          router.refresh();
        })
      }
    >
      {featured ? "Unfeature" : "Feature"}
    </Button>
  );
}
