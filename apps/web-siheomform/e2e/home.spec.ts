import { ROUTES } from "../src/app/_constants/routes";
import { test, expect } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto(ROUTES.HOME.path);
  await expect(page.getByRole("link", { name: "+ 새 CBT 만들기" })).toBeVisible();
});
