export const REACTION_TYPES = ["lol", "agree", "shock", "angry"] as const;

export type ReactionType = (typeof REACTION_TYPES)[number];

export const REACTION_LABELS: Record<ReactionType, string> = {
  lol: "ㅋㅋ",
  agree: "공감",
  shock: "충격",
  angry: "화남",
};

export const REACTION_EMOJIS: Record<ReactionType, string> = {
  lol: "🤣",
  agree: "👍",
  shock: "😱",
  angry: "😡",
};

export const isReactionType = (value: string): value is ReactionType =>
  (REACTION_TYPES as readonly string[]).includes(value);
