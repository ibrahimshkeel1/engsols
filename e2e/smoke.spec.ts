import { test, expect } from "@playwright/test";

test.describe("smoke", () => {
  test("homepage loads", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/EngSols/i);
    await expect(page.getByRole("link", { name: /find mentors/i }).first()).toBeVisible();
  });

  test("mentors directory loads", async ({ page }) => {
    await page.goto("/mentors");
    await expect(page.getByRole("heading", { name: /find your engineering mentor/i })).toBeVisible();
  });

  test("forum page loads", async ({ page }) => {
    await page.goto("/forum");
    await expect(page.getByRole("heading", { name: /engineering forum/i })).toBeVisible();
  });

  test("search page loads", async ({ page }) => {
    await page.goto("/search");
    await expect(page.getByRole("heading", { name: /search/i })).toBeVisible();
  });
});
