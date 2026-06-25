const CACHE_KEY = "engsols-page-titles";
const MAX_ENTRIES = 80;

type CachedTitle = {
  title: string;
  subtitle?: string;
};

function readCache(): Record<string, CachedTitle> {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, CachedTitle>) : {};
  } catch {
    return {};
  }
}

function writeCache(cache: Record<string, CachedTitle>) {
  try {
    const keys = Object.keys(cache);
    if (keys.length > MAX_ENTRIES) {
      for (const key of keys.slice(0, keys.length - MAX_ENTRIES)) {
        delete cache[key];
      }
    }
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // ignore quota / private mode
  }
}

export function hrefKey(href: string) {
  const path = href.split("#")[0] || "/";
  if (path.startsWith("/")) return path;
  try {
    const url = new URL(href, window.location.origin);
    return `${url.pathname}${url.search}`;
  } catch {
    return "/";
  }
}

export function rememberPageTitle(key: string, title: string, subtitle?: string) {
  if (!title.trim()) return;
  const cache = readCache();
  cache[key] = { title: title.trim(), subtitle: subtitle?.trim() || undefined };
  writeCache(cache);
}

export function recallPageTitle(key: string): CachedTitle | null {
  return readCache()[key] ?? null;
}
