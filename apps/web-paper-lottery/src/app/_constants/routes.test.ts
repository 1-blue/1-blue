import { describe, expect, it } from "vitest";
import { createSitemapEntriesFromRoutes } from "@1-blue/seo";
import { ROUTES } from "./routes";

describe("ROUTES", () => {
  it("비공개 보드 경로는 sitemap에서 제외한다", () => {
    expect(ROUTES.BOARD.RESULT.path("abc123")).toBe("/b/abc123/result");
    expect(createSitemapEntriesFromRoutes("https://example.com", ROUTES)).toHaveLength(3);
  });
});
