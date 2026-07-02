export const ROUTES = {
  HOME: { path: "/", label: "홈", sitemap: { changeFrequency: "monthly", priority: 1 } },
  BOARD: {
    label: "뽑기판",
    ADMIN: { path: (shortCode: string) => `/b/${shortCode}/admin`, label: "관리" },
    PLAY: { path: (shortCode: string) => `/b/${shortCode}/play`, label: "뽑기" },
    RESULT: { path: (shortCode: string) => `/b/${shortCode}/result`, label: "결과" },
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
