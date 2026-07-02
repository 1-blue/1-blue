import { describe, expect, it } from "vitest";
import { createSitemapEntriesFromRoutes } from "@1-blue/seo";
import { ROUTES } from "./routes";

describe("ROUTES", () => {
  it("콘텐츠 builder를 만들고 동적 경로는 sitemap에서 제외한다", () => {
    expect(ROUTES.STORY.DETAIL.path("story-id")).toBe("/story/story-id");
    expect(createSitemapEntriesFromRoutes("https://example.com", ROUTES)).toHaveLength(9);
  });
});
