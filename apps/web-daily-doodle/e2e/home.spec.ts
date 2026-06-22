import { test, expect } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "매일 함께 그리는 공유 낙서장" })).toBeVisible();
  await expect(page.getByText("오늘의 낙서")).toBeVisible();
});
