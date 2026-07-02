import { ROUTES } from "../src/app/_constants/routes";
import { test, expect } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto(ROUTES.HOME.path);
  await expect(page.getByText("썰톡")).toBeVisible();
});
