/** Portrait URL for mentors/mentees — real upload or consistent generated avatar. */
export function resolvePortraitUrl(
  name: string,
  uploadedUrl?: string | null,
  variant: "mentor" | "mentee" = "mentor",
  size = 512,
): string {
  if (uploadedUrl?.trim()) return uploadedUrl.trim();

  const style = variant === "mentee" ? "lorelei" : "notionists";
  const seed = encodeURIComponent(name);
  const bg = "f8fafc,e2e8f0,ffffff";
  return `https://api.dicebear.com/7.x/${style}/png?seed=${seed}&size=${size}&backgroundColor=${bg}`;
}

export function pickMentorsForShowcase<T extends { slug: string; featured?: boolean; avatarUrl?: string | null }>(
  mentors: T[],
  limit = 3,
): T[] {
  const seen = new Set<string>();
  const ordered = [
    ...mentors.filter((m) => m.featured),
    ...mentors.filter((m) => m.avatarUrl),
    ...mentors,
  ];

  const result: T[] = [];
  for (const mentor of ordered) {
    if (seen.has(mentor.slug)) continue;
    seen.add(mentor.slug);
    result.push(mentor);
    if (result.length >= limit) break;
  }
  return result;
}
