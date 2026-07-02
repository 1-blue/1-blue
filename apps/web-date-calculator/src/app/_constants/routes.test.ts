import { describe, expect, it } from "vitest";
import { createSitemapEntriesFromRoutes } from "@1-blue/seo";
import { ROUTES } from "./routes";

describe("ROUTES", () => {
  it("공개 정적 경로만 sitemap에 포함한다", () => {
    expect(createSitemapEntriesFromRoutes("https://example.com", ROUTES)).toHaveLength(3);
  });
});
