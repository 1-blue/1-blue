import { test, expect } from "@playwright/test";

test("home page loads with date calculator tabs", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "날짜 계산기" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "일수 계산" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "날짜 더하기/빼기" })).toBeVisible();
  await expect(page.getByRole("button", { name: "일수 계산하기" })).toBeVisible();
});

test("date offset tab shows calculate button", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "날짜 더하기/빼기" }).click();
  await expect(page.getByRole("button", { name: "날짜 계산하기" })).toBeVisible();
});
