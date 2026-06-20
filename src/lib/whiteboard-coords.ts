import type { DrawStrokePacket } from "@/lib/livekit-sync";

/** Shared virtual canvas aspect — all clients letterbox to this so mobile sees the full board. */
export const WHITEBOARD_ASPECT = 16 / 10;

export type CanvasLayout = {
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
};

export function computeCanvasLayout(containerWidth: number, containerHeight: number): CanvasLayout {
  if (containerWidth <= 0 || containerHeight <= 0) {
    return { width: 0, height: 0, offsetX: 0, offsetY: 0 };
  }

  const containerAspect = containerWidth / containerHeight;
  if (containerAspect > WHITEBOARD_ASPECT) {
    const height = containerHeight;
    const width = height * WHITEBOARD_ASPECT;
    return { width, height, offsetX: (containerWidth - width) / 2, offsetY: 0 };
  }

  const width = containerWidth;
  const height = width / WHITEBOARD_ASPECT;
  return { width, height, offsetX: 0, offsetY: (containerHeight - height) / 2 };
}

export function normalizePoint(
  point: { x: number; y: number },
  layout: CanvasLayout,
): { x: number; y: number } {
  if (layout.width <= 0 || layout.height <= 0) return { x: 0, y: 0 };
  return { x: point.x / layout.width, y: point.y / layout.height };
}

export function toNormalizedSegment(
  segment: Omit<DrawStrokePacket, "type">,
  layout: CanvasLayout,
): DrawStrokePacket {
  return {
    type: "DRAW_STROKE",
    x0: segment.x0 / layout.width,
    y0: segment.y0 / layout.height,
    x1: segment.x1 / layout.width,
    y1: segment.y1 / layout.height,
    color: segment.color,
    thickness: segment.thickness / layout.width,
    tool: segment.tool,
  };
}

export function toPixelSegment(segment: DrawStrokePacket, layout: CanvasLayout): DrawStrokePacket {
  return {
    ...segment,
    x0: segment.x0 * layout.width,
    y0: segment.y0 * layout.height,
    x1: segment.x1 * layout.width,
    y1: segment.y1 * layout.height,
    thickness: segment.thickness * layout.width,
  };
}

/** Legacy sessions may still carry pixel coordinates — treat values > 1 as pixels on a 800px-wide board. */
export function isNormalizedSegment(segment: DrawStrokePacket): boolean {
  return (
    segment.x0 >= 0 &&
    segment.x0 <= 1 &&
    segment.y0 >= 0 &&
    segment.y0 <= 1 &&
    segment.x1 >= 0 &&
    segment.x1 <= 1 &&
    segment.y1 >= 0 &&
    segment.y1 <= 1 &&
    segment.thickness > 0 &&
    segment.thickness <= 1
  );
}

export function toPixelSegmentCompat(segment: DrawStrokePacket, layout: CanvasLayout): DrawStrokePacket {
  if (isNormalizedSegment(segment)) {
    return toPixelSegment(segment, layout);
  }

  const scale = layout.width / 800;
  return {
    ...segment,
    x0: segment.x0 * scale,
    y0: segment.y0 * scale,
    x1: segment.x1 * scale,
    y1: segment.y1 * scale,
    thickness: segment.thickness * scale,
  };
}
