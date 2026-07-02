export const ROUTES = {
  HOME: { path: "/", label: "홈", sitemap: { changeFrequency: "monthly", priority: 1 } },
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
