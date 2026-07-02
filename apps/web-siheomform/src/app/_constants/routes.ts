export const ROUTES = {
  HOME: { path: "/", label: "홈", sitemap: { changeFrequency: "daily", priority: 1 } },
  CREATE: {
    path: "/create",
    label: "CBT 만들기",
    sitemap: { changeFrequency: "monthly", priority: 0.9 },
    QUESTIONS: { path: "/create/questions", label: "문제 작성" },
    COMPLETE: { path: "/create/complete", label: "생성 완료" },
  },
  CBT: {
    label: "CBT",
    DETAIL: {
      path: (publicId: string) => `/cbt/${publicId}`,
      label: "시험 소개",
      TAKE: { path: (publicId: string) => `/cbt/${publicId}/take`, label: "시험 응시" },
      RESULT: {
        path: (publicId: string, attemptId: string) => `/cbt/${publicId}/result/${attemptId}`,
        label: "시험 결과",
      },
    },
  },
  MANAGE: {
    label: "시험 관리",
    DETAIL: {
      path: (adminToken: string) => `/manage/${adminToken}`,
      label: "관리",
      EDIT: { path: (adminToken: string) => `/manage/${adminToken}/edit`, label: "시험 수정" },
      STATS: { path: (adminToken: string) => `/manage/${adminToken}/stats`, label: "통계" },
    },
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
