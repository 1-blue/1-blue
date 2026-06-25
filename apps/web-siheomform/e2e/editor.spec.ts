import { test, expect } from "@playwright/test";

test("editor add question on desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/create");
  await expect(page.getByText("문제 편집")).toBeVisible();
  await page.getByRole("button", { name: "+ 문제 추가" }).click();
  await expect(page.getByText("총 2문제")).toBeVisible();
});

test("choice textarea supports multiline input", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/create");
  const choiceInput = page.getByPlaceholder("보기 내용").first();
  await choiceInput.fill("첫 줄\n둘째 줄");
  await expect(choiceInput).toHaveValue("첫 줄\n둘째 줄");
});
