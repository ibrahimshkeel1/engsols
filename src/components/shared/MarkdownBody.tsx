import { renderMarkdown } from "@/lib/markdown";

export function MarkdownBody({ content, className }: { content: string; className?: string }) {
  return (
    <div
      className={className ?? "prose prose-sm max-w-none text-foreground/90"}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
}
