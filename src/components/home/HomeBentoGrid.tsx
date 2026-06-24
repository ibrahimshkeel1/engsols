"use client";

import { Children } from "react";
import { Stagger, StaggerItem } from "@/components/motion/AnimateIn";
import {
  MagicBentoSection,
  MagicBentoCard,
  MAGIC_BENTO_CARD_DEFAULTS,
} from "@/components/motion/magic-bento";
import { cn } from "@/lib/utils";

type HomeBentoGridProps = {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  itemClassName?: string;
};

/** MagicBento-wrapped grid for homepage card sections. */
export function HomeBentoGrid({
  children,
  className,
  stagger = 0.06,
  itemClassName,
}: HomeBentoGridProps) {
  const items = Children.toArray(children);

  return (
    <MagicBentoSection>
      <Stagger className={className} stagger={stagger}>
        {items.map((child, index) => (
          <StaggerItem
            key={index}
            className={cn("min-h-0 h-full overflow-hidden", itemClassName)}
          >
            <MagicBentoCard {...MAGIC_BENTO_CARD_DEFAULTS} className="h-full">
              {child}
            </MagicBentoCard>
          </StaggerItem>
        ))}
      </Stagger>
    </MagicBentoSection>
  );
}

type HomeBentoStaticGridProps = {
  children: React.ReactNode;
  className?: string;
  itemClassName?: string;
};

/** MagicBento grid without stagger animation (for scrollable rows). */
export function HomeBentoStaticGrid({
  children,
  className,
  itemClassName,
}: HomeBentoStaticGridProps) {
  const items = Children.toArray(children);

  return (
    <MagicBentoSection>
      <div className={className}>
        {items.map((child, index) => (
          <div key={index} className={cn("min-h-0 h-full", itemClassName)}>
            <MagicBentoCard {...MAGIC_BENTO_CARD_DEFAULTS} className="h-full">
              {child}
            </MagicBentoCard>
          </div>
        ))}
      </div>
    </MagicBentoSection>
  );
}
