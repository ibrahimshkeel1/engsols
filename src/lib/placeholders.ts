function svgDataUri(label: string, width: number, height: number, bg = "#1e293b", fg = "#fbbf24") {
  const text = label.slice(0, 24).replace(/[<>&]/g, "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="${bg}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${fg}" font-family="system-ui,sans-serif" font-size="20" font-weight="600">${text}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function listingImage(text: string) {
  return svgDataUri(text, 640, 400);
}

export function videoThumbnail(text: string) {
  return svgDataUri(text, 640, 360, "#0f172a");
}

export function companyLogo(name: string) {
  return svgDataUri(name.slice(0, 2).toUpperCase(), 120, 120, "#1e293b", "#ffffff");
}
