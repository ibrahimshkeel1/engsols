export type CropRect = {
  /** Visible region as a fraction of the source image (0–1). */
  x: number;
  y: number;
  width: number;
  height: number;
};

export type PortraitPlacement = {
  id: string;
  label: string;
  /** Container width ÷ height. */
  aspect: number;
  frameClassName?: string;
};

/** Where mentor/student portraits appear across EngSols (all use object-cover object-top). */
export const PORTRAIT_PLACEMENTS: PortraitPlacement[] = [
  { id: "browse", label: "Browse grid", aspect: 4 / 3, frameClassName: "rounded-t-2xl" },
  { id: "hero", label: "Homepage hero", aspect: 3 / 4, frameClassName: "rounded-2xl" },
  { id: "matcher", label: "Matcher cards", aspect: 3 / 2, frameClassName: "rounded-t-2xl" },
  { id: "avatar", label: "Avatar & comments", aspect: 1, frameClassName: "rounded-xl" },
  { id: "profile", label: "Profile page", aspect: 1, frameClassName: "rounded-2xl" },
];

/** object-cover crop region inside the source image. focusY: 0 = top, 1 = bottom. */
export function getObjectCoverCrop(
  imageWidth: number,
  imageHeight: number,
  containerAspect: number,
  focusY = 0,
): CropRect {
  if (imageWidth <= 0 || imageHeight <= 0 || containerAspect <= 0) {
    return { x: 0, y: 0, width: 1, height: 1 };
  }

  const imageAspect = imageWidth / imageHeight;
  const clampedFocus = Math.min(1, Math.max(0, focusY));

  if (imageAspect > containerAspect) {
    const visibleWidth = containerAspect / imageAspect;
    return {
      x: (1 - visibleWidth) / 2,
      y: 0,
      width: visibleWidth,
      height: 1,
    };
  }

  const visibleHeight = imageAspect / containerAspect;
  const maxOffset = 1 - visibleHeight;
  const y = maxOffset <= 0 ? 0 : clampedFocus * maxOffset;
  return {
    x: 0,
    y,
    width: 1,
    height: visibleHeight,
  };
}

export function focusYFromCropRect(rect: CropRect): number {
  const maxOffset = 1 - rect.height;
  if (maxOffset <= 0.001) return 0;
  return Math.min(1, Math.max(0, rect.y / maxOffset));
}

export function cropRectsForPlacements(
  imageWidth: number,
  imageHeight: number,
  placements: PortraitPlacement[] = PORTRAIT_PLACEMENTS,
  focusY = 0,
): Map<string, CropRect> {
  const rects = new Map<string, CropRect>();
  for (const placement of placements) {
    rects.set(
      placement.id,
      getObjectCoverCrop(imageWidth, imageHeight, placement.aspect, focusY),
    );
  }
  return rects;
}
