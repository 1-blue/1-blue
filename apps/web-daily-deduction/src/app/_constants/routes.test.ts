import { describe, expect, it } from "vitest";
import { createSitemapEntriesFromRoutes } from "@1-blue/seo";
import { ROUTES } from "./routes";

describe("ROUTES", () => {
  it("동적 경로와 공개 sitemap 경로를 만든다", () => {
    expect(ROUTES.ARCHIVE.DETAIL.path("2026-07-02")).toBe("/archive/2026-07-02");
    expect(createSitemapEntriesFromRoutes("https://example.com", ROUTES)).toHaveLength(5);
  });
});
