import type { DrawStrokePacket, DrawTextPacket } from "@/lib/livekit-sync";

/** Fixed virtual canvas — identical on every device. */
export const WHITEBOARD_VIRTUAL_WIDTH = 1600;
export const WHITEBOARD_VIRTUAL_HEIGHT = 1000;
export const WHITEBOARD_ASPECT = WHITEBOARD_VIRTUAL_WIDTH / WHITEBOARD_VIRTUAL_HEIGHT;

export type FitTransform = {
  scale: number;
  offsetX: number;
  offsetY: number;
  displayWidth: number;
  displayHeight: number;
};

export type ViewportState = {
  zoom: number;
  panX: number;
  panY: number;
};

export const DEFAULT_VIEWPORT: ViewportState = { zoom: 1, panX: 0, panY: 0 };

export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 4;

export function clampZoom(zoom: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
}

export function computeFitTransform(containerWidth: number, containerHeight: number): FitTransform {
  if (containerWidth <= 0 || containerHeight <= 0) {
    return { scale: 1, offsetX: 0, offsetY: 0, displayWidth: 0, displayHeight: 0 };
  }

  const scale = Math.min(
    containerWidth / WHITEBOARD_VIRTUAL_WIDTH,
    containerHeight / WHITEBOARD_VIRTUAL_HEIGHT,
  );
  const displayWidth = WHITEBOARD_VIRTUAL_WIDTH * scale;
  const displayHeight = WHITEBOARD_VIRTUAL_HEIGHT * scale;

  return {
    scale,
    offsetX: (containerWidth - displayWidth) / 2,
    offsetY: (containerHeight - displayHeight) / 2,
    displayWidth,
    displayHeight,
  };
}

export function getTotalScale(fit: FitTransform, viewport: ViewportState): number {
  return fit.scale * viewport.zoom;
}

export function screenToVirtual(
  clientX: number,
  clientY: number,
  containerRect: DOMRect,
  fit: FitTransform,
  viewport: ViewportState,
): { x: number; y: number } | null {
  const scale = getTotalScale(fit, viewport);
  if (scale <= 0) return null;

  const x = (clientX - containerRect.left - fit.offsetX - viewport.panX) / scale;
  const y = (clientY - containerRect.top - fit.offsetY - viewport.panY) / scale;

  if (x < 0 || x > WHITEBOARD_VIRTUAL_WIDTH || y < 0 || y > WHITEBOARD_VIRTUAL_HEIGHT) {
    return null;
  }

  return { x, y };
}

export function virtualToScreen(
  virtualX: number,
  virtualY: number,
  containerRect: DOMRect,
  fit: FitTransform,
  viewport: ViewportState,
): { x: number; y: number } {
  const scale = getTotalScale(fit, viewport);
  return {
    x: containerRect.left + fit.offsetX + viewport.panX + virtualX * scale,
    y: containerRect.top + fit.offsetY + viewport.panY + virtualY * scale,
  };
}

export function normalizePoint(point: { x: number; y: number }): { x: number; y: number } {
  return {
    x: point.x / WHITEBOARD_VIRTUAL_WIDTH,
    y: point.y / WHITEBOARD_VIRTUAL_HEIGHT,
  };
}

export function denormalizePoint(point: { x: number; y: number }): { x: number; y: number } {
  return {
    x: point.x * WHITEBOARD_VIRTUAL_WIDTH,
    y: point.y * WHITEBOARD_VIRTUAL_HEIGHT,
  };
}

export function normalizeThickness(pixels: number): number {
  return pixels / WHITEBOARD_VIRTUAL_WIDTH;
}

export function denormalizeThickness(normalized: number): number {
  return normalized * WHITEBOARD_VIRTUAL_WIDTH;
}

export function toNormalizedStroke(
  stroke: Omit<DrawStrokePacket, "type">,
): DrawStrokePacket {
  return {
    type: "DRAW_STROKE",
    x0: stroke.x0 / WHITEBOARD_VIRTUAL_WIDTH,
    y0: stroke.y0 / WHITEBOARD_VIRTUAL_HEIGHT,
    x1: stroke.x1 / WHITEBOARD_VIRTUAL_WIDTH,
    y1: stroke.y1 / WHITEBOARD_VIRTUAL_HEIGHT,
    color: stroke.color,
    thickness: normalizeThickness(stroke.thickness),
    tool: stroke.tool,
  };
}

export function toVirtualStroke(segment: DrawStrokePacket): DrawStrokePacket {
  if (isNormalizedStroke(segment)) {
    return {
      ...segment,
      x0: segment.x0 * WHITEBOARD_VIRTUAL_WIDTH,
      y0: segment.y0 * WHITEBOARD_VIRTUAL_HEIGHT,
      x1: segment.x1 * WHITEBOARD_VIRTUAL_WIDTH,
      y1: segment.y1 * WHITEBOARD_VIRTUAL_HEIGHT,
      thickness: denormalizeThickness(segment.thickness),
    };
  }

  const scale = WHITEBOARD_VIRTUAL_WIDTH / 800;
  return {
    ...segment,
    x0: segment.x0 * scale,
    y0: segment.y0 * scale,
    x1: segment.x1 * scale,
    y1: segment.y1 * scale,
    thickness: segment.thickness * scale,
  };
}

export function toNormalizedText(
  text: Omit<DrawTextPacket, "type">,
): DrawTextPacket {
  return {
    type: "DRAW_TEXT",
    x: text.x / WHITEBOARD_VIRTUAL_WIDTH,
    y: text.y / WHITEBOARD_VIRTUAL_HEIGHT,
    text: text.text,
    color: text.color,
    fontSize: text.fontSize / WHITEBOARD_VIRTUAL_WIDTH,
  };
}

export function toVirtualText(item: DrawTextPacket): DrawTextPacket {
  if (isNormalizedText(item)) {
    return {
      ...item,
      x: item.x * WHITEBOARD_VIRTUAL_WIDTH,
      y: item.y * WHITEBOARD_VIRTUAL_HEIGHT,
      fontSize: denormalizeThickness(item.fontSize),
    };
  }

  const scale = WHITEBOARD_VIRTUAL_WIDTH / 800;
  return {
    ...item,
    x: item.x * scale,
    y: item.y * scale,
    fontSize: item.fontSize * scale,
  };
}

export function isNormalizedStroke(segment: DrawStrokePacket): boolean {
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
    segment.thickness <= 0.05
  );
}

export function isNormalizedText(item: DrawTextPacket): boolean {
  return (
    item.x >= 0 &&
    item.x <= 1 &&
    item.y >= 0 &&
    item.y <= 1 &&
    item.fontSize > 0 &&
    item.fontSize <= 0.1
  );
}

export function zoomAtPoint(
  viewport: ViewportState,
  fit: FitTransform,
  pointerX: number,
  pointerY: number,
  containerRect: DOMRect,
  nextZoom: number,
): ViewportState {
  const clamped = clampZoom(nextZoom);
  const oldScale = getTotalScale(fit, viewport);
  const newScale = fit.scale * clamped;
  const ratio = newScale / oldScale;

  const localX = pointerX - containerRect.left - fit.offsetX - viewport.panX;
  const localY = pointerY - containerRect.top - fit.offsetY - viewport.panY;

  return {
    zoom: clamped,
    panX: viewport.panX + localX * (1 - ratio),
    panY: viewport.panY + localY * (1 - ratio),
  };
}
