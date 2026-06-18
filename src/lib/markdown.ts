/** Lightweight markdown → HTML for news articles (no external deps). */
export function renderMarkdown(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped
    .replace(/^### (.+)$/gm, "<h3 class=\"mt-6 text-lg font-semibold\">$1</h3>")
    .replace(/^## (.+)$/gm, "<h2 class=\"mt-8 text-xl font-bold\">$1</h2>")
    .replace(/^# (.+)$/gm, "<h1 class=\"mt-8 text-2xl font-bold\">$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code class=\"rounded bg-muted px-1 py-0.5 text-sm\">$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<a href=\"$2\" class=\"text-primary hover:underline\">$1</a>")
    .replace(/^(?:-|\*) (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul class="my-3 list-disc pl-5 space-y-1">${m}</ul>`)
    .replace(/\n\n/g, "</p><p class=\"mt-4\">")
    .replace(/^(?!<[hulo])/gm, (line) => (line.trim() && !line.startsWith("<") ? line : line))
    .replace(/^(.+)$/gm, (line) => {
      if (line.startsWith("<")) return line;
      if (!line.trim()) return "";
      return `<p class="mt-4">${line}</p>`;
    });
}
