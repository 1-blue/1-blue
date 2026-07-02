export const PUZZLE_THEME_IDS = ["mystery", "alibi", "theft"] as const;
export type PuzzleThemeId = (typeof PUZZLE_THEME_IDS)[number];

export type PuzzleThemeMeta = {
  id: PuzzleThemeId;
  label: string;
  description: string;
  promptGuide: string;
};

export const PUZZLE_THEMES: readonly PuzzleThemeMeta[] = [
  {
    id: "mystery",
    label: "미스터리",
    description: "실종·행방·정체를 추적하는 미스터리",
    promptGuide:
      "사람 또는 핵심 사건의 실종·행방·정체가 중심인 미스터리. 인물 관계와 사건의 핵심 진실을 규명하는 구조로 작성하세요.",
  },
  {
    id: "alibi",
    label: "알리바이",
    description: "시간·장소 증언을 교차 검증하는 추리",
    promptGuide:
      "시간대·장소별 증언(알리바이)이 핵심인 추리. 누가 언제 어디에 있었는지 교차 검증하여 범인·거짓말을 밝히는 구조로 작성하세요.",
  },
  {
    id: "theft",
    label: "도난",
    description: "물건 도난·침입 사건의 용의자 추적",
    promptGuide:
      "물건 도난·장소 침입이 중심인 사건. 용의자, 수법, 범행 경로를 단서로 좁혀 범인을 특정하는 구조로 작성하세요.",
  },
] as const;

const themeById = new Map(PUZZLE_THEMES.map((theme) => [theme.id, theme]));

export const resolveThemeForDate = (puzzleDate: string): PuzzleThemeId => {
  const numeric = Number(puzzleDate.replace(/-/g, ""));
  const index = ((numeric % 3) + 3) % 3;
  return PUZZLE_THEME_IDS[index] ?? "mystery";
};

export const getThemeMeta = (themeId: PuzzleThemeId): PuzzleThemeMeta => {
  const theme = themeById.get(themeId);
  if (!theme) {
    throw new Error(`unknown_theme: ${themeId}`);
  }
  return theme;
};
