"use client";

import { ButtonLink } from "@/components/ui/button";

export function MentorMobileBookBar() {
  return (
    <div className="fixed bottom-16 inset-x-0 z-[45] border-t border-border/60 bg-background/95 px-4 py-3 backdrop-blur-sm lg:hidden">
      <div className="mx-auto flex max-w-md gap-2">
        <ButtonLink href="#booking-options" size="default" className="flex-1">
          Book Session
        </ButtonLink>
        <ButtonLink href="#booking-monthly" variant="secondary" size="default" className="flex-1">
          Monthly
        </ButtonLink>
      </div>
    </div>
  );
}
