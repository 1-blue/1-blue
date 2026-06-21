import { describe, expect, it } from "vitest";
import { makeURLQueries, slugify } from "./index";

describe("makeURLQueries", () => {
  it("builds query string", () => {
    expect(makeURLQueries({ q: "test", page: 1 })).toBe("?q=test&page=1");
  });

  it("skips empty values", () => {
    expect(makeURLQueries({ q: "", page: undefined })).toBe("");
  });
});

describe("slugify", () => {
  it("converts text to slug", () => {
    expect(slugify("Hello World!")).toBe("hello-world");
  });
});
