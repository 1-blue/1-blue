import type { FaqItem } from "@1-blue/seo";

/** APP.md SEO 섹션의 Keywords·FAQ를 여기에 반영하세요. */
export const SITE_KEYWORDS = ["{{APP_NAME}}"] as const;

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "{{APP_NAME}}은(는) 무엇인가요?",
    answer: "{{APP_DESCRIPTION}}",
  },
  {
    question: "무료로 사용할 수 있나요?",
    answer: "네. 회원가입 없이 무료로 이용할 수 있습니다.",
  },
  {
    question: "모바일에서도 사용할 수 있나요?",
    answer: "네. 모바일 브라우저에 최적화되어 있습니다.",
  },
];
