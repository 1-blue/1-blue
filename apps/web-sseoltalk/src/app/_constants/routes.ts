export const ROUTES = {
  HOME: { path: "/", label: "홈", sitemap: { changeFrequency: "daily", priority: 1 } },
  POPULAR: {
    path: "/popular",
    label: "인기 썰",
    sitemap: { changeFrequency: "daily", priority: 0.9 },
  },
  RANDOM: { path: "/random", label: "랜덤 썰" },
  CATEGORY: {
    label: "카테고리",
    DETAIL: { path: (name: string) => `/category/${name}`, label: "카테고리별 썰" },
    FAMILY: {
      path: "/category/family",
      label: "가족 썰",
      sitemap: { changeFrequency: "daily", priority: 0.8 },
    },
    WORK: {
      path: "/category/work",
      label: "직장 썰",
      sitemap: { changeFrequency: "daily", priority: 0.8 },
    },
    LOVE: {
      path: "/category/love",
      label: "연애 썰",
      sitemap: { changeFrequency: "daily", priority: 0.8 },
    },
    FRIEND: {
      path: "/category/friend",
      label: "친구 썰",
      sitemap: { changeFrequency: "daily", priority: 0.8 },
    },
    JINSANG: {
      path: "/category/jinsang",
      label: "진상 썰",
      sitemap: { changeFrequency: "daily", priority: 0.8 },
    },
  },
  STORY: { label: "썰", DETAIL: { path: (id: string) => `/story/${id}`, label: "썰 상세" } },
  PRIVACY: {
    path: "/privacy",
    label: "개인정보처리방침",
    sitemap: { changeFrequency: "yearly", priority: 0.2 },
  },
  TERMS: {
    path: "/terms",
    label: "이용약관",
    sitemap: { changeFrequency: "yearly", priority: 0.2 },
  },
} as const;
