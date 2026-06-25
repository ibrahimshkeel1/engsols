/** Repeating SVG tile — sparse blue + amber on white; white + amber on navy (nav/footer). */
export const SPECKLE_TILE_PX = 72;

const DARK_SPECKLE_BASE = "#0f172a";
const LIGHT_SPECKLE_BASE = "#f8fafc";
const MATTE_OPACITY_SCALE = 0.82;

const dots: ReadonlyArray<readonly [number, number, number, string, number]> = [
  [7, 11, 1.2, "#1e90ff", 0.3],
  [26, 5, 1, "#ff8c00", 0.28],
  [41, 24, 1, "#1e90ff", 0.26],
  [54, 14, 1.1, "#ff8c00", 0.27],
  [17, 40, 1, "#ff8c00", 0.25],
  [35, 52, 1.2, "#1e90ff", 0.29],
  [62, 44, 1, "#1e90ff", 0.26],
  [48, 66, 1, "#ff8c00", 0.28],
  [11, 63, 1.1, "#1e90ff", 0.27],
  [69, 8, 1, "#ff8c00", 0.26],
  [23, 28, 1, "#1e90ff", 0.25],
  [58, 58, 1.1, "#ff8c00", 0.29],
  [43, 38, 1, "#1e90ff", 0.28],
  [8, 48, 1, "#ff8c00", 0.24],
  [66, 68, 1.2, "#1e90ff", 0.3],
  [31, 18, 1, "#ff8c00", 0.27],
  [52, 48, 1, "#1e90ff", 0.26],
  [18, 8, 1, "#ff8c00", 0.25],
  [43, 11, 1, "#1e90ff", 0.27],
  [61, 31, 1.1, "#ff8c00", 0.28],
  [38, 41, 1, "#1e90ff", 0.26],
  [14, 22, 1, "#ff8c00", 0.26],
  [55, 71, 1, "#1e90ff", 0.28],
  [28, 61, 1.1, "#ff8c00", 0.27],
];

function speckleColorForSurface(
  color: string,
  surface: "light" | "dark",
): string {
  if (surface === "light") return color;
  return color === "#1e90ff" ? "#ffffff" : "#ff8c00";
}

function buildSpeckleSvg(surface: "light" | "dark"): string {
  const circles = dots
    .map(([x, y, r, color, opacity]) => {
      const fill = speckleColorForSurface(color, surface);
      const matteOpacity = Math.min(opacity * MATTE_OPACITY_SCALE, 0.32);
      return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" fill-opacity="${matteOpacity}"/>`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SPECKLE_TILE_PX}" height="${SPECKLE_TILE_PX}">${circles}</svg>`;
}

export const speckleTileDataUri = `data:image/svg+xml,${encodeURIComponent(buildSpeckleSvg("light"))}`;
export const darkSpeckleTileDataUri = `data:image/svg+xml,${encodeURIComponent(buildSpeckleSvg("dark"))}`;

function speckleStyle(baseColor: string, tileUri: string) {
  return {
    backgroundColor: baseColor,
    backgroundImage: `url("${tileUri}")`,
    backgroundSize: `${SPECKLE_TILE_PX}px ${SPECKLE_TILE_PX}px`,
    backgroundRepeat: "repeat",
    backgroundAttachment: "scroll",
  } as const;
}

/** Light page shell — blue + orange speckles on white. */
export const speckleBackgroundStyle = speckleStyle(LIGHT_SPECKLE_BASE, speckleTileDataUri);

/** Nav / footer — white + orange speckles on maritime navy. */
export const darkSpeckleBackgroundStyle = speckleStyle(DARK_SPECKLE_BASE, darkSpeckleTileDataUri);
