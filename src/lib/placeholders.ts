export function listingImage(text: string) {
  return `https://placehold.co/640x400/1e293b/fbbf24?text=${encodeURIComponent(text)}`;
}

export function videoThumbnail(text: string) {
  return `https://placehold.co/640x360/0f172a/fbbf24?text=${encodeURIComponent(text)}`;
}

export function companyLogo(name: string) {
  return `https://placehold.co/120x120/1e293b/ffffff?text=${encodeURIComponent(name.slice(0, 2))}`;
}
