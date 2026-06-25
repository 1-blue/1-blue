import { test, expect } from "@playwright/test";

test("mobile create metadata to questions flow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/create");
  await page.locator("div.md\\:hidden #cbt-title").fill("모바일 테스트 시험");
  await page.getByRole("button", { name: "문제 작성하기 →" }).click();
  await expect(page.getByText("문제 편집")).toBeVisible();
});
