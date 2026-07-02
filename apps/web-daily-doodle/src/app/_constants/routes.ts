export const ROUTES = {
  HOME: { path: "/", label: "홈", sitemap: { changeFrequency: "daily", priority: 1 } },
  ARCHIVE: {
    path: "/archive",
    label: "지난 낙서",
    sitemap: { changeFrequency: "daily", priority: 0.8 },
    DETAIL: { path: (date: string) => `/archive/${date}`, label: "지난 낙서 상세" },
  },
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
