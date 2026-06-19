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

  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /sign in to engsols/i })).toBeVisible();
  });

  test("assist page redirects when logged out", async ({ page }) => {
    await page.goto("/assist");
    await expect(page).toHaveURL(/login/);
  });

  test("notifications page redirects when logged out", async ({ page }) => {
    await page.goto("/notifications");
    await expect(page).toHaveURL(/login/);
  });

  test("seller dashboard redirects when logged out", async ({ page }) => {
    await page.goto("/marketplace/seller");
    await expect(page).toHaveURL(/login/);
  });

  test("companies page loads", async ({ page }) => {
    await page.goto("/companies");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("marketplace page loads", async ({ page }) => {
    await page.goto("/marketplace");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("certifications page loads", async ({ page }) => {
    await page.goto("/certifications");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("signup page loads", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.getByRole("heading", { name: /join engsols/i })).toBeVisible();
  });
});

test.describe("authenticated", () => {
  test("login and view settings", async ({ page }) => {
    const email = process.env.E2E_TEST_EMAIL;
    const password = process.env.E2E_TEST_PASSWORD;
    test.skip(!email || !password, "Set E2E_TEST_EMAIL and E2E_TEST_PASSWORD for auth tests");

    await page.goto("/login");
    await page.getByLabel(/email/i).fill(email!);
    await page.getByLabel(/password/i).fill(password!);
    await page.getByRole("button", { name: /log in/i }).click();
    await page.goto("/settings");
    await expect(page.getByRole("heading", { name: /account settings/i })).toBeVisible();
  });
});
