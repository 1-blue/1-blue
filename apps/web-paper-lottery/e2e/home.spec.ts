import { ROUTES } from "../src/app/_constants/routes";
import { test, expect } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto(ROUTES.HOME.path);
  await expect(page.getByRole("heading", { name: "온라인 종이뽑기" })).toBeVisible();
  await expect(page.getByRole("button", { name: "뽑기판 만들기" })).toBeVisible();
});

test("multi-pick flow with auto-reveal", async ({ page, request }) => {
  const createRes = await request.post("/api/boards", {
    data: {
      title: "E2E 테스트",
      slotCount: 12,
      prizeConfig: [
        { label: "1등", count: 1 },
        { label: "2등", count: 2 },
        { label: "꽝", count: 9 },
      ],
      participants: [
        { displayName: "참가자 A", pickQuota: 2 },
        { displayName: "참가자 B", pickQuota: 2 },
      ],
    },
  });

  expect(createRes.ok()).toBeTruthy();
  const { shortCode, adminToken, adminUrl } = (await createRes.json()) as {
    shortCode: string;
    adminToken: string;
    adminUrl: string;
  };

  await page.goto(adminUrl);
  await expect(page.getByText("E2E 테스트")).toBeVisible();

  const adminRes = await request.get(`/api/boards/${shortCode}/admin?token=${adminToken}`);
  const adminData = (await adminRes.json()) as {
    participants: { token: string; displayName: string }[];
    prizeRemainders: { label: string; remaining: number }[];
  };

  const tokenA = adminData.participants.find((p) => p.displayName === "참가자 A")!.token;
  const tokenB = adminData.participants.find((p) => p.displayName === "참가자 B")!.token;

  const pickA = await request.post(`/api/boards/${shortCode}/pick`, {
    data: { token: tokenA, slotIndex: 0 },
  });
  expect(pickA.ok()).toBeTruthy();

  const afterA = await request.get(`/api/boards/${shortCode}/admin?token=${adminToken}`);
  const afterAData = (await afterA.json()) as {
    prizeRemainders: { label: string; remaining: number }[];
    progress: { totalUsed: number };
  };
  expect(afterAData.progress.totalUsed).toBe(1);

  const totalRemainingBefore = afterAData.prizeRemainders.reduce((sum, r) => sum + r.remaining, 0);
  expect(totalRemainingBefore).toBe(11);

  const slotIndex = 1;
  const [pickB1, pickB2] = await Promise.all([
    request.post(`/api/boards/${shortCode}/pick`, { data: { token: tokenB, slotIndex } }),
    request.post(`/api/boards/${shortCode}/pick`, { data: { token: tokenB, slotIndex } }),
  ]);

  const successCount = [pickB1, pickB2].filter((r) => r.ok()).length;
  expect(successCount).toBe(1);

  await request.post(`/api/boards/${shortCode}/pick`, { data: { token: tokenA, slotIndex: 2 } });
  await request.post(`/api/boards/${shortCode}/pick`, { data: { token: tokenB, slotIndex: 3 } });

  const finalAdmin = await request.get(`/api/boards/${shortCode}/admin?token=${adminToken}`);
  const finalData = (await finalAdmin.json()) as { revealed: boolean };
  expect(finalData.revealed).toBe(true);

  await page.goto(ROUTES.BOARD.RESULT.path(shortCode));
  await expect(page.getByText("전체 결과가 공개되었습니다")).toBeVisible();
});
