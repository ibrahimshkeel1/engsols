"use client";

import { useMemo } from "react";
import { Stagger, StaggerItem } from "@/components/motion/AnimateIn";
import { PROFILE_GRID_CLASS } from "@/lib/bento-layout";
import { cn } from "@/lib/utils";

type ProfileBentoGridProps<T> = {
  items: T[];
  getKey: (item: T) => string;
  isFeatured?: (item: T) => boolean;
  renderCard: (item: T, index: number) => React.ReactNode;
  stagger?: number;
  className?: string;
  animated?: boolean;
};

export function ProfileBentoGrid<T>({
  items,
  getKey,
  isFeatured,
  renderCard,
  stagger = 0.06,
  className,
  animated = true,
}: ProfileBentoGridProps<T>) {
  const orderedItems = useMemo(() => {
    if (!isFeatured) return items;
    return [...items.filter(isFeatured), ...items.filter((item) => !isFeatured(item))];
  }, [items, isFeatured]);

  if (!animated) {
    return (
      <div className={cn(PROFILE_GRID_CLASS, className)}>
        {orderedItems.map((item, index) => (
          <div key={getKey(item)} className="min-h-0">
            {renderCard(item, index)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <Stagger className={cn(PROFILE_GRID_CLASS, className)} stagger={stagger}>
      {orderedItems.map((item, index) => (
        <StaggerItem key={getKey(item)} className="min-h-0">
          {renderCard(item, index)}
        </StaggerItem>
      ))}
    </Stagger>
  );
}
