import { describe, expect, it } from "vitest";
import { getKstBoardDate, hitTestStroke, isValidBoardDate, translateStroke } from "./index";
import { validateStrokeInput } from "./validate-stroke";
import type { StrokeRecord } from "./stroke-types";

describe("daily-doodle kst-date", () => {
  it("returns YYYY-MM-DD for KST", () => {
    const date = new Date("2026-06-21T15:30:00.000Z");
    expect(getKstBoardDate(date)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("validates board date format", () => {
    expect(isValidBoardDate("2026-06-21")).toBe(true);
    expect(isValidBoardDate("2026-6-21")).toBe(false);
  });
});

describe("validateStrokeInput", () => {
  it("accepts valid pen stroke", () => {
    const stroke = validateStrokeInput({
      tool: "pen",
      color: "#E85D4C",
      width: 8,
      points: [
        [10, 10],
        [20, 20],
      ],
    });

    expect(stroke.tool).toBe("pen");
  });

  it("accepts multiline text stroke with font size", () => {
    const stroke = validateStrokeInput({
      tool: "text",
      color: "#E85D4C",
      textContent: "첫 줄\n둘째 줄",
      fontFamily: "hand",
      fontSize: 36,
      x: 100,
      y: 120,
    });

    expect(stroke.tool).toBe("text");
    if (stroke.tool === "text") {
      expect(stroke.fontSize).toBe(36);
      expect(stroke.textContent).toContain("\n");
    }
  });

  it("rejects text with too many lines", () => {
    expect(() =>
      validateStrokeInput({
        tool: "text",
        color: "#E85D4C",
        textContent: "1\n2\n3\n4\n5\n6\n7\n8\n9",
        fontFamily: "hand",
        x: 10,
        y: 10,
      }),
    ).toThrow();
  });

  it("rejects invalid color", () => {
    expect(() =>
      validateStrokeInput({
        tool: "pen",
        color: "#000000",
        width: 8,
        points: [[10, 10]],
      }),
    ).toThrow();
  });
});

describe("stroke bounds and move", () => {
  const textStroke: StrokeRecord = {
    id: "text-1",
    sessionId: "session-a",
    nickname: "me",
    createdAt: new Date().toISOString(),
    tool: "text",
    color: "#E85D4C",
    textContent: "hello",
    fontFamily: "hand",
    fontSize: 28,
    x: 100,
    y: 100,
  };

  it("hits own text stroke", () => {
    const hit = hitTestStroke([textStroke], 120, 110, "session-a");
    expect(hit?.id).toBe("text-1");
  });

  it("does not hit other session strokes", () => {
    const hit = hitTestStroke([textStroke], 120, 110, "session-b");
    expect(hit).toBeNull();
  });

  it("translates text stroke", () => {
    const moved = translateStroke(textStroke, 10, 20);
    expect(moved.x).toBe(110);
    expect(moved.y).toBe(120);
  });
});
