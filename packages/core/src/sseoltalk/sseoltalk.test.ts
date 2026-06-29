import { describe, expect, it } from "vitest";
import {
  canReplyToComment,
  isReactionType,
  isStoryCategory,
  validateCommentInput,
  validateGeneratedStory,
} from "./index";

describe("sseoltalk categories", () => {
  it("accepts valid categories", () => {
    expect(isStoryCategory("직장")).toBe(true);
    expect(isStoryCategory("invalid")).toBe(false);
  });
});

describe("sseoltalk reactions", () => {
  it("accepts valid reaction types", () => {
    expect(isReactionType("lol")).toBe(true);
    expect(isReactionType("invalid")).toBe(false);
  });
});

describe("validateGeneratedStory", () => {
  const base = {
    category: "직장" as const,
    title: "팀장님이 야근 가능하냐고 물어본 이유",
    messages: Array.from({ length: 16 }, (_, i) => ({
      sender: i % 2 === 0 ? "팀장" : "나",
      is_me: i % 2 !== 0,
      content: `메시지 ${i}`,
      order_index: i,
    })),
  };

  it("accepts valid story", () => {
    expect(validateGeneratedStory(base).title).toBe(base.title);
  });

  it("rejects multiple me senders", () => {
    const invalid = {
      ...base,
      messages: base.messages.map((m, i) =>
        i < 2 ? { ...m, is_me: true, sender: i === 0 ? "나" : "친구" } : m,
      ),
    };
    expect(() => validateGeneratedStory(invalid)).toThrow("invalid_me_sender");
  });
});

describe("comment validation", () => {
  it("validates nickname and content", () => {
    const result = validateCommentInput({
      nickname: "익명",
      password: "1234",
      content: "공감돼요",
    });
    expect(result.nickname).toBe("익명");
  });

  it("blocks reply to reply", () => {
    expect(canReplyToComment(true)).toBe(false);
    expect(canReplyToComment(false)).toBe(true);
  });
});
