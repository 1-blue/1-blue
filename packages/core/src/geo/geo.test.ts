import { describe, expect, it } from "vitest";
import { formatCoordinate, geocodeAddressMock, parseCoordinateInput } from "./index";

describe("parseCoordinateInput", () => {
  it("parses comma-separated coordinates", () => {
    const result = parseCoordinateInput("37.566585, 126.978204");
    expect(result).toEqual({ latitude: 37.566585, longitude: 126.978204 });
  });

  it("returns null for invalid input", () => {
    expect(parseCoordinateInput("invalid")).toBeNull();
    expect(parseCoordinateInput("91, 0")).toBeNull();
  });
});

describe("formatCoordinate", () => {
  it("formats to 6 decimal places", () => {
    expect(formatCoordinate({ latitude: 37.5665851, longitude: 126.9782038 })).toBe(
      "37.566585, 126.978204",
    );
  });
});

describe("geocodeAddressMock", () => {
  it("returns mock coordinates for known addresses", async () => {
    const result = await geocodeAddressMock("서울시청");
    expect(result?.latitude).toBeCloseTo(37.5665851);
  });

  it("returns null for unknown addresses", async () => {
    expect(await geocodeAddressMock("unknown place xyz")).toBeNull();
  });
});
