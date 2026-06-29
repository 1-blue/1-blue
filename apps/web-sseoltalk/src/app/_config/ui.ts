import type { StoryCategory } from "@1-blue/core/sseoltalk";
import { CATEGORY_SLUGS } from "@1-blue/core/sseoltalk";

export const CATEGORY_EMOJIS: Record<StoryCategory, string> = {
  가족: "👨‍👩‍👧",
  직장: "💼",
  연애: "💗",
  친구: "🧑‍🤝‍🧑",
  진상: "🤬",
};

export const CATEGORY_CLASS: Record<StoryCategory, string> = {
  가족: "category-family",
  직장: "category-work",
  연애: "category-love",
  친구: "category-friend",
  진상: "category-jinsang",
};

export const formatCount = (value: number): string => {
  if (value >= 10_000) {
    return `${(value / 10_000).toFixed(1)}만`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}천`;
  }
  return String(value);
};

export const categoryToSlug = (category: StoryCategory): string => CATEGORY_SLUGS[category];

export const totalReactions = (counts: Record<string, number>): number =>
  Object.values(counts).reduce((sum, n) => sum + n, 0);
