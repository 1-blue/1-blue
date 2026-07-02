import { describe, expect, it } from "vitest";
import { addCalendarDays, countDaysBetween, normalizeDate } from "./index";

const d = (iso: string) => new Date(`${iso}T12:00:00`);

describe("normalizeDate", () => {
  it("strips time component", () => {
    const date = new Date("2024-06-15T23:59:59");
    expect(normalizeDate(date).getHours()).toBe(0);
  });
});

describe("countDaysBetween", () => {
  it("counts exclusive days between dates", () => {
    expect(countDaysBetween(d("2024-01-01"), d("2024-01-03"))).toBe(2);
  });

  it("counts inclusive days when includeStart is true", () => {
    expect(countDaysBetween(d("2024-01-01"), d("2024-01-03"), { includeStart: true })).toBe(3);
  });

  it("returns 1 for same day with includeStart", () => {
    expect(countDaysBetween(d("2024-01-01"), d("2024-01-01"), { includeStart: true })).toBe(1);
  });

  it("returns 0 for same day without includeStart", () => {
    expect(countDaysBetween(d("2024-01-01"), d("2024-01-01"))).toBe(0);
  });

  it("returns negative when end is before start", () => {
    expect(countDaysBetween(d("2024-01-10"), d("2024-01-01"))).toBe(-9);
  });

  it("handles leap year correctly", () => {
    expect(countDaysBetween(d("2024-02-28"), d("2024-03-01"))).toBe(2);
  });
});

describe("addCalendarDays", () => {
  it("adds days forward", () => {
    const result = addCalendarDays(d("2024-01-01"), 100);
    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(3);
    expect(result.getDate()).toBe(10);
  });

  it("subtracts days when negative", () => {
    const result = addCalendarDays(d("2024-01-10"), -9);
    expect(result.getMonth()).toBe(0);
    expect(result.getDate()).toBe(1);
  });
});
