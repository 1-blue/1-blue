import type { FaqItem } from "@1-blue/seo";
import { SITE_OPERATOR } from "@1-blue/legal/operator";

export const SITE_NAME = "썰톡";

export const SITE_TITLE = "썰톡 | AI 카톡 썰 읽기 · 익명 썰 커뮤니티";

export const SITE_DESCRIPTION =
  "AI가 매일 만드는 카카오톡 스타일 썰을 읽고 반응하고 댓글을 남기는 익명 커뮤니티입니다. 직장·연애·가족·친구·진상 썰을 채팅처럼 즐겨보세요.";

export const SITE_KEYWORDS = [
  "썰톡",
  "AI 카톡 썰",
  "카톡 대화 썰",
  "익명 썰 커뮤니티",
  "직장 카톡 썰",
  "연애 카톡 썰",
  "가족 썰",
  "온라인 썰",
  "채팅 썰",
  "인기 썰",
] as const;

export const POPULAR_PAGE_TITLE = "오늘의 인기 썰";
export const POPULAR_PAGE_DESCRIPTION = "오늘 반응이 가장 많은 카톡 스타일 썰 TOP 10을 확인하세요.";

export const PRIVACY_PAGE_TITLE = "개인정보처리방침";
export const PRIVACY_PAGE_DESCRIPTION = "썰톡 서비스의 개인정보 수집·이용·보관에 관한 안내입니다.";

export const TERMS_PAGE_TITLE = "이용약관";
export const TERMS_PAGE_DESCRIPTION =
  "썰톡 서비스 이용 조건과 운영자·이용자의 권리·의무를 안내합니다.";

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "썰톡은 어떤 서비스인가요?",
    answer:
      "AI가 매일 카카오톡 대화 형식의 썰을 생성하고, 사용자가 읽고 반응·댓글을 남기는 익명 커뮤니티입니다. 로그인 없이 이용할 수 있습니다.",
  },
  {
    question: "AI가 만든 썰은 어떻게 검수되나요?",
    answer:
      "썰 생성 후 별도 AI 검증 단계를 거쳐 현실성·자연스러움·공감·마무리 항목을 점수화합니다. 기준 점수 이상만 저장됩니다.",
  },
  {
    question: "직장·연애·가족 썰은 실제 대화인가요?",
    answer:
      "아니요. 모든 썰은 AI가 창작한 가상의 카카오톡 대화입니다. 실존 인물·회사를 특정하지 않으며, 공감과 재미를 위한 콘텐츠입니다.",
  },
  {
    question: "로그인 없이 댓글을 남길 수 있나요?",
    answer:
      "네. 닉네임과 비밀번호만 입력하면 댓글을 작성할 수 있습니다. 비밀번호는 수정·삭제 시 필요합니다.",
  },
  {
    question: "댓글 수정/삭제는 어떻게 하나요?",
    answer:
      "댓글 작성 시 입력한 비밀번호로 수정·삭제할 수 있습니다. 비밀번호 분실 시 복구할 수 없으니 안전하게 보관해 주세요.",
  },
  {
    question: "부적절한 콘텐츠는 어떻게 처리하나요?",
    answer: `문의 채널(${SITE_OPERATOR.contactEmail})로 신고해 주시면 검토 후 조치합니다. ${SITE_OPERATOR.responseNotice}됩니다.`,
  },
];
