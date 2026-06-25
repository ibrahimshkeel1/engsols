/** CSS object-position for portrait crops (0 = top, 1 = bottom). */
export function portraitObjectPosition(focusY = 0): string {
  const y = Math.min(1, Math.max(0, focusY));
  if (y <= 0.001) return "center top";
  if (y >= 0.999) return "center bottom";
  return `center ${Math.round(y * 100)}%`;
}

export function portraitObjectPositionStyle(focusY?: number | null): { objectPosition: string } {
  return { objectPosition: portraitObjectPosition(focusY ?? 0) };
}
