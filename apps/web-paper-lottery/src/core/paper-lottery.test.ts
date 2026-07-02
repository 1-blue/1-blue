import { describe, expect, it } from "vitest";
import {
  buildPrizePool,
  computePrizeRemainders,
  isBoardComplete,
  shuffleSlots,
  validateBoardInput,
} from "./index";

describe("buildPrizePool", () => {
  it("expands prize config into label array", () => {
    expect(
      buildPrizePool([
        { label: "1등", count: 2 },
        { label: "꽝", count: 1 },
      ]),
    ).toEqual(["1등", "1등", "꽝"]);
  });
});

describe("shuffleSlots", () => {
  it("preserves all items", () => {
    const input = ["a", "b", "c", "d"];
    const shuffled = shuffleSlots(input, () => 0.5);
    expect(shuffled.sort()).toEqual(input.sort());
  });

  it("can produce different order with deterministic random", () => {
    const input = [1, 2, 3, 4, 5];
    const shuffled = shuffleSlots(input, () => 0.1);
    expect(shuffled).not.toEqual(input);
  });
});

describe("computePrizeRemainders", () => {
  it("calculates remaining prizes", () => {
    const result = computePrizeRemainders(
      [
        { label: "1등", count: 2 },
        { label: "꽝", count: 3 },
      ],
      { "1등": 1 },
    );

    expect(result).toEqual([
      { label: "1등", total: 2, taken: 1, remaining: 1 },
      { label: "꽝", total: 3, taken: 0, remaining: 3 },
    ]);
  });
});

describe("isBoardComplete", () => {
  it("returns true when all quotas used", () => {
    expect(
      isBoardComplete([
        { pickQuota: 2, picksUsed: 2 },
        { pickQuota: 1, picksUsed: 1 },
      ]),
    ).toBe(true);
  });

  it("returns false when picks remain", () => {
    expect(isBoardComplete([{ pickQuota: 2, picksUsed: 1 }])).toBe(false);
  });
});

describe("validateBoardInput", () => {
  it("accepts valid board input", () => {
    const input = {
      title: "테스트",
      slotCount: 6,
      prizeConfig: [
        { label: "1등", count: 1 },
        { label: "꽝", count: 5 },
      ],
      participants: [{ displayName: "참가자 1", pickQuota: 1 }],
    };

    expect(validateBoardInput(input)).toEqual(input);
  });

  it("rejects prize count mismatch", () => {
    expect(() =>
      validateBoardInput({
        title: "",
        slotCount: 6,
        prizeConfig: [{ label: "1등", count: 1 }],
        participants: [{ displayName: "참가자 1", pickQuota: 1 }],
      }),
    ).toThrow("prize_count_mismatch");
  });
});
