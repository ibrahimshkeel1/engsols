import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/validation";

describe("contactSchema", () => {
  it("accepts valid contact", () => {
    const result = contactSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "Hello mentor",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = contactSchema.safeParse({
      name: "Jane",
      email: "not-an-email",
      message: "Hi",
    });
    expect(result.success).toBe(false);
  });
});
