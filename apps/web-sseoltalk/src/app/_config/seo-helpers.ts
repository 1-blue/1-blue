import type { StoryCategory } from "@/core";

export const CATEGORY_SEO: Record<StoryCategory, { description: string; keywords: string[] }> = {
  가족: {
    description:
      "엄마·아빠·형제와의 은근한 반전이 있는 가족 카톡 썰 모음. 집안 대화의 웃픈 순간을 채팅처럼 읽어보세요.",
    keywords: ["가족 카톡 썰", "부모님 카톡", "가족 썰", "집안 이야기"],
  },
  직장: {
    description:
      "퇴근 후 보면 더 웃긴 직장 카톡 썰. 상사·동료·단톡방에서 벌어진 레전드 대화를 모았습니다.",
    keywords: ["직장 카톡 썰", "상사 카톡", "회사 단톡", "퇴근 후 썰"],
  },
  연애: {
    description:
      "설레고 빡치는 연애 카톡 썰. 남친·여친과의 대화에서 터지는 반전과 현타를 채팅처럼 즐겨보세요.",
    keywords: ["연애 카톡 썰", "남친 카톡", "여친 카톡", "연애 썰"],
  },
  친구: {
    description:
      "친구 사이 애매한 순간을 담은 카톡 썰. 은근한 배신, 찐친 레전드, 소름 돋는 대화를 모았습니다.",
    keywords: ["친구 카톡 썰", "찐친 썰", "친구 대화 썰"],
  },
  진상: {
    description:
      "당근마켓·택배·일상에서 만난 진상 빌런 카톡 썰. 현실적인 빌런 대화를 채팅 형식으로 읽어보세요.",
    keywords: ["진상 썰", "빌런 카톡", "당근마켓 썰", "레전드 진상"],
  },
};

export const buildStoryMetaDescription = (story: {
  title: string;
  category: string;
  previewMessages?: Array<{ sender: string; isMe: boolean; content: string }>;
}): string => {
  const parts = (story.previewMessages ?? [])
    .slice(0, 2)
    .map((m) => (m.isMe ? `나: ${m.content}` : `${m.sender}: ${m.content}`));

  const preview = parts.join(" ").replace(/\s+/g, " ").trim();
  if (preview.length >= 30) {
    return preview.length > 155 ? `${preview.slice(0, 152)}…` : preview;
  }

  return `${story.category} 카테고리 카톡 스타일 썰 — ${story.title}`;
};
