import { test, expect } from "@playwright/test";

for (const path of ["/events", "/members", "/about/organization"]) {
  test(`${path} loads`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBeLessThan(400);
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  });
}
