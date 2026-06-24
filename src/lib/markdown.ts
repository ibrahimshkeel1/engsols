import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = ["h1", "h2", "h3", "p", "strong", "em", "code", "ul", "li", "a"];
const ALLOWED_ATTR = ["href", "class", "rel"];

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** @internal exported for tests */
export function isSafeMarkdownHref(href: string): boolean {
  const trimmed = href.trim();
  if (!trimmed) return false;

  let decoded = trimmed;
  try {
    decoded = decodeURIComponent(trimmed);
  } catch {
    return false;
  }

  const lower = decoded.toLowerCase().replace(/\s/g, "");
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("file:")
  ) {
    return false;
  }

  if (decoded.startsWith("//")) return false;

  if (trimmed.startsWith("/")) {
    if (trimmed.includes("\\") || trimmed.includes("@")) return false;
    return true;
  }

  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:" || url.protocol === "mailto:";
  } catch {
    return false;
  }
}

function linkTag(label: string, href: string): string {
  if (!isSafeMarkdownHref(href)) return label;
  const safeHref = escapeHtml(href.trim());
  return `<a href="${safeHref}" rel="noopener noreferrer nofollow" class="text-primary hover:underline">${label}</a>`;
}

export function sanitizeMarkdownHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  });
}

/** Lightweight markdown → sanitized HTML for news articles. */
export function renderMarkdown(text: string): string {
  const escaped = escapeHtml(text);

  const html = escaped
    .replace(/^### (.+)$/gm, "<h3 class=\"mt-6 text-lg font-semibold\">$1</h3>")
    .replace(/^## (.+)$/gm, "<h2 class=\"mt-8 text-xl font-bold\">$1</h2>")
    .replace(/^# (.+)$/gm, "<h1 class=\"mt-8 text-2xl font-bold\">$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code class=\"rounded bg-muted px-1 py-0.5 text-sm\">$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label: string, href: string) => linkTag(label, href))
    .replace(/^(?:-|\*) (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul class="my-3 list-disc pl-5 space-y-1">${m}</ul>`)
    .replace(/\n\n/g, "</p><p class=\"mt-4\">")
    .replace(/^(?!<[hulo])/gm, (line) => (line.trim() && !line.startsWith("<") ? line : line))
    .replace(/^(.+)$/gm, (line) => {
      if (line.startsWith("<")) return line;
      if (!line.trim()) return "";
      return `<p class="mt-4">${line}</p>`;
    });

  return sanitizeMarkdownHtml(html);
}
