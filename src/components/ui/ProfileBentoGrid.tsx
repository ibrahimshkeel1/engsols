"use client";

import { useMemo } from "react";
import { Stagger, StaggerItem } from "@/components/motion/AnimateIn";
import {
  MagicBentoSection,
  MagicBentoCard,
  MAGIC_BENTO_CARD_DEFAULTS,
} from "@/components/motion/magic-bento";
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

function BentoCell({
  children,
  span,
}: {
  children: React.ReactNode;
  span: string;
}) {
  return (
    <div className={cn("min-h-0 h-full", span)}>
      <MagicBentoCard {...MAGIC_BENTO_CARD_DEFAULTS} className="h-full">
        {children}
      </MagicBentoCard>
    </div>
  );
}

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

  const gridContent = orderedItems.map((item, index) => {
    const variant = getBentoVariant(index);
    const span = getBentoSpanClass(index);
    const card = renderCard(item, variant, index);

    return animated ? (
      <StaggerItem key={getKey(item)} className={cn("min-h-0 h-full overflow-hidden", span)}>
        <MagicBentoCard {...MAGIC_BENTO_CARD_DEFAULTS} className="h-full">
          {card}
        </MagicBentoCard>
      </StaggerItem>
    ) : (
      <BentoCell key={getKey(item)} span={span}>
        {card}
      </BentoCell>
    );
  });

  return (
    <MagicBentoSection className={className}>
      {animated ? (
        <Stagger className={BENTO_GRID_CLASS} stagger={stagger}>
          {gridContent}
        </Stagger>
      ) : (
        <div className={BENTO_GRID_CLASS}>{gridContent}</div>
      )}
    </MagicBentoSection>
  );
}
