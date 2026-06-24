import { describe, expect, it } from "vitest";
import { renderMarkdown, isSafeMarkdownHref } from "@/lib/markdown";

describe("renderMarkdown", () => {
  it("renders bold text", () => {
    const html = renderMarkdown("Hello **world**");
    expect(html).toContain("<strong>world</strong>");
  });

  it("renders headings", () => {
    const html = renderMarkdown("## Section title");
    expect(html).toContain("Section title");
    expect(html).toContain("<h2");
  });

  it("strips javascript: links", () => {
    const html = renderMarkdown("[click me](javascript:alert(1))");
    expect(html).not.toContain("javascript:");
    expect(html).not.toContain("<a ");
    expect(html).toContain("click me");
  });

  it("adds rel noopener on safe links", () => {
    const html = renderMarkdown("[docs](https://example.com)");
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('rel="noopener noreferrer nofollow"');
  });

  it("escapes raw HTML so it cannot execute", () => {
    const html = renderMarkdown('<img src=x onerror="alert(1)">');
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;img");
  });
});

describe("isSafeMarkdownHref", () => {
  it("allows https and relative paths", () => {
    expect(isSafeMarkdownHref("https://engsols.com")).toBe(true);
    expect(isSafeMarkdownHref("/forum/test")).toBe(true);
  });

  it("blocks dangerous schemes and paths", () => {
    expect(isSafeMarkdownHref("javascript:alert(1)")).toBe(false);
    expect(isSafeMarkdownHref("//evil.com")).toBe(false);
    expect(isSafeMarkdownHref("/\\evil.com")).toBe(false);
    expect(isSafeMarkdownHref("data:text/html,test")).toBe(false);
  });
});
