"use client";

import { useMemo } from "react";
import { Stagger, StaggerItem } from "@/components/motion/AnimateIn";
import {
  BENTO_GRID_CLASS,
  getBentoSpanClass,
  getBentoVariant,
  type BentoVariant,
} from "@/lib/bento-layout";
import { cn } from "@/lib/utils";

type ProfileBentoGridProps<T> = {
  items: T[];
  getKey: (item: T) => string;
  isFeatured?: (item: T) => boolean;
  renderCard: (item: T, variant: BentoVariant, index: number) => React.ReactNode;
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
      <div className={cn(BENTO_GRID_CLASS, className)}>
        {orderedItems.map((item, index) => {
          const variant = getBentoVariant(index);
          const span = getBentoSpanClass(index);
          return (
            <div key={getKey(item)} className={cn("min-h-0 h-full overflow-hidden", span)}>
              {renderCard(item, variant, index)}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <Stagger className={cn(BENTO_GRID_CLASS, className)} stagger={stagger}>
      {orderedItems.map((item, index) => {
        const variant = getBentoVariant(index);
        const span = getBentoSpanClass(index);

        return (
          <StaggerItem key={getKey(item)} className={cn("min-h-0 h-full overflow-hidden", span)}>
            {renderCard(item, variant, index)}
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
