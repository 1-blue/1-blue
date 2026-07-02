import { describe, expect, it } from "vitest";
import { createSitemapEntriesFromRoutes } from "@1-blue/seo";
import { ROUTES } from "./routes";

describe("ROUTES", () => {
  it("CBT builder를 만들고 관리 경로는 sitemap에서 제외한다", () => {
    expect(ROUTES.CBT.DETAIL.RESULT.path("cbt", "attempt")).toBe("/cbt/cbt/result/attempt");
    expect(createSitemapEntriesFromRoutes("https://example.com", ROUTES)).toHaveLength(4);
  });
});
