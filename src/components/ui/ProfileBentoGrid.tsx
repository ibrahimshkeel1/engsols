"use client";

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
  const cells = items.map((item, index) => {
    const featured = isFeatured?.(item) ?? false;
    const variant = getBentoVariant(index, featured);
    const span = getBentoSpanClass(index, featured);
    const card = renderCard(item, variant, index);

    return (
      <div key={getKey(item)} className={cn("min-h-0 h-full", span)}>
        {card}
      </div>
    );
  });

  if (!animated) {
    return <div className={cn(BENTO_GRID_CLASS, className)}>{cells}</div>;
  }

  return (
    <Stagger className={cn(BENTO_GRID_CLASS, className)} stagger={stagger}>
      {items.map((item, index) => {
        const featured = isFeatured?.(item) ?? false;
        const variant = getBentoVariant(index, featured);
        const span = getBentoSpanClass(index, featured);

        return (
          <StaggerItem key={getKey(item)} className={cn("min-h-0 h-full", span)}>
            {renderCard(item, variant, index)}
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
