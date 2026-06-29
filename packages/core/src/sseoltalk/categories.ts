export const STORY_CATEGORIES = ["가족", "직장", "연애", "친구", "진상"] as const;

export type StoryCategory = (typeof STORY_CATEGORIES)[number];

export const CATEGORY_SLUGS: Record<StoryCategory, string> = {
  가족: "family",
  직장: "work",
  연애: "love",
  친구: "friend",
  진상: "jinsang",
};

export const SLUG_TO_CATEGORY: Record<string, StoryCategory> = {
  family: "가족",
  work: "직장",
  love: "연애",
  friend: "친구",
  jinsang: "진상",
};

export const isStoryCategory = (value: string): value is StoryCategory =>
  (STORY_CATEGORIES as readonly string[]).includes(value);

export const resolveCategoryFromSlug = (slug: string): StoryCategory | null =>
  SLUG_TO_CATEGORY[slug] ?? null;
