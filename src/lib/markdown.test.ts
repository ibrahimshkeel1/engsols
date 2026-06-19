import { describe, expect, it } from "vitest";
import { renderMarkdown } from "@/lib/markdown";

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
});
