import { describe, expect, it } from "vitest";
import { createSitemapEntriesFromRoutes } from "@1-blue/seo";
import { ROUTES } from "./routes";

describe("ROUTES", () => {
  it("공개 정적 경로로 sitemap을 만든다", () => {
    expect(
      createSitemapEntriesFromRoutes("https://example.com", ROUTES).map(({ url }) => url),
    ).toEqual(["https://example.com/", "https://example.com/privacy", "https://example.com/terms"]);
  });
});
