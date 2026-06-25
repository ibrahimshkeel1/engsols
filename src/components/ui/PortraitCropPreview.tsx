"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  cropRectsForPlacements,
  focusYFromCropRect,
  getObjectCoverCrop,
  PORTRAIT_PLACEMENTS,
  type CropRect,
  type PortraitPlacement,
} from "@/lib/portrait-crop";
import { portraitObjectPositionStyle } from "@/lib/portrait-position";
import { cn } from "@/lib/utils";

type PortraitCropPreviewProps = {
  src: string;
  alt?: string;
  className?: string;
  focusY?: number;
  onFocusYChange?: (focusY: number) => void;
};

function useImageSize(src: string) {
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const img = new window.Image();
    img.onload = () => {
      if (!cancelled) setSize({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      if (!cancelled) setSize(null);
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  return size;
}

function CropShade({ rect }: { rect: CropRect }) {
  const shade = "pointer-events-none absolute bg-oil-gas-navy/50";

  return (
    <>
      <div className={shade} style={{ left: 0, top: 0, right: 0, height: `${rect.y * 100}%` }} aria-hidden />
      <div
        className={shade}
        style={{ left: 0, top: `${(rect.y + rect.height) * 100}%`, right: 0, bottom: 0 }}
        aria-hidden
      />
      <div
        className={shade}
        style={{ left: 0, top: `${rect.y * 100}%`, width: `${rect.x * 100}%`, height: `${rect.height * 100}%` }}
        aria-hidden
      />
      <div
        className={shade}
        style={{
          left: `${(rect.x + rect.width) * 100}%`,
          top: `${rect.y * 100}%`,
          right: 0,
          height: `${rect.height * 100}%`,
        }}
        aria-hidden
      />
    </>
  );
}

function PlacementPreview({
  src,
  placement,
  alt,
  focusY,
}: {
  src: string;
  placement: PortraitPlacement;
  alt: string;
  focusY: number;
}) {
  return (
    <figure className="space-y-2">
      <div
        className={cn(
          "relative w-full overflow-hidden border border-border bg-muted",
          placement.frameClassName,
        )}
        style={{ aspectRatio: placement.aspect }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          style={portraitObjectPositionStyle(focusY)}
        />
      </div>
      <figcaption className="text-center text-[11px] font-medium text-oil-gas-navy-muted">
        {placement.label}
      </figcaption>
    </figure>
  );
}

export function PortraitCropPreview({
  src,
  alt = "Photo preview",
  className,
  focusY = 0,
  onFocusYChange,
}: PortraitCropPreviewProps) {
  const imageSize = useImageSize(src);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const cropRects = useMemo(() => {
    if (!imageSize) return null;
    return cropRectsForPlacements(imageSize.width, imageSize.height, PORTRAIT_PLACEMENTS, focusY);
  }, [imageSize, focusY]);

  const primaryRect = cropRects?.get("browse");
  const browseAspect = PORTRAIT_PLACEMENTS.find((p) => p.id === "browse")?.aspect ?? 4 / 3;
  const canDrag =
    Boolean(imageSize) &&
    imageSize!.width / imageSize!.height < browseAspect - 0.001;

  const updateFocusFromPointer = useCallback(
    (clientY: number) => {
      if (!imageSize || !containerRef.current || !onFocusYChange) return;
      const box = containerRef.current.getBoundingClientRect();
      const relativeY = (clientY - box.top) / box.height;
      const crop = getObjectCoverCrop(imageSize.width, imageSize.height, browseAspect, focusY);
      const maxOffset = 1 - crop.height;
      if (maxOffset <= 0) return;
      const nextFocus = Math.min(1, Math.max(0, (relativeY - crop.height / 2) / maxOffset));
      onFocusYChange(nextFocus);
    },
    [browseAspect, focusY, imageSize, onFocusYChange],
  );

  function onPointerDown(e: React.PointerEvent) {
    if (!canDrag || !onFocusYChange) return;
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFocusFromPointer(e.clientY);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    updateFocusFromPointer(e.clientY);
  }

  function onPointerUp() {
    dragging.current = false;
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="rounded-2xl border border-border bg-oil-gas-ice p-3 sm:p-4">
        <p className="text-sm font-semibold text-oil-gas-navy">Crop preview</p>
        <p className="mt-1 text-xs text-oil-gas-navy-muted">
          Orange frame shows what stays visible in the browse grid.
          {canDrag ? " Drag the frame up or down to reposition." : " Shaded areas are cropped away."}
        </p>

        <div className="relative mt-4 overflow-hidden rounded-xl bg-oil-gas-navy/5 p-2">
          <div ref={containerRef} className="relative mx-auto w-fit max-w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="block max-h-[min(22rem,55vh)] max-w-full h-auto w-auto rounded-lg"
            />

            {primaryRect && (
              <>
                <CropShade rect={primaryRect} />
                <div
                  className={cn(
                    "absolute border-2 border-oil-gas-orange shadow-[0_0_0_1px_rgba(15,23,42,0.12)]",
                    canDrag && onFocusYChange ? "cursor-ns-resize touch-none" : "pointer-events-none",
                  )}
                  style={{
                    left: `${primaryRect.x * 100}%`,
                    top: `${primaryRect.y * 100}%`,
                    width: `${primaryRect.width * 100}%`,
                    height: `${primaryRect.height * 100}%`,
                  }}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                  aria-label="Drag to reposition portrait crop"
                  role="slider"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(focusYFromCropRect(primaryRect) * 100)}
                >
                  <span className="absolute -top-6 start-0 rounded-md bg-oil-gas-orange px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                    Browse grid
                  </span>
                </div>
                {PORTRAIT_PLACEMENTS.filter((p) => p.id !== "browse").map((placement) => {
                  const rect = cropRects?.get(placement.id);
                  if (!rect) return null;
                  return (
                    <div
                      key={placement.id}
                      className="pointer-events-none absolute border-2 border-dashed border-white/80"
                      style={{
                        left: `${rect.x * 100}%`,
                        top: `${rect.y * 100}%`,
                        width: `${rect.width * 100}%`,
                        height: `${rect.height * 100}%`,
                      }}
                      aria-hidden
                    />
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-oil-gas-navy">How you&apos;ll appear</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {PORTRAIT_PLACEMENTS.map((placement) => (
            <PlacementPreview
              key={placement.id}
              src={src}
              placement={placement}
              alt={alt}
              focusY={focusY}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
