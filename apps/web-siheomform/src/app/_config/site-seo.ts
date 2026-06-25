import type { FaqItem } from "@1-blue/seo";
import { SITE_OPERATOR } from "@1-blue/legal/operator";

export const SITE_NAME = "시험폼";

export const SITE_TITLE = "시험폼 | 로그인 없이 만드는 온라인 CBT·링크 시험";

export const SITE_DESCRIPTION =
  "회원가입 없이 객관식 CBT를 만들고 링크로 공유하세요. 자동 채점·통계·공개 시험 목록을 지원합니다. 수업·스터디·이벤트 퀴즈에 바로 쓸 수 있습니다.";

export const SITE_KEYWORDS = [
  "시험폼",
  "온라인 시험 만들기",
  "CBT 만들기",
  "무료 온라인 시험",
  "링크 시험",
  "객관식 시험 제작",
  "자동 채점 시험",
  "회원가입 없는 시험",
  "온라인 퀴즈 만들기",
  "교사용 온라인 시험",
] as const;

export const CREATE_PAGE_TITLE = "CBT 만들기";
export const CREATE_PAGE_DESCRIPTION =
  "객관식 문제를 추가하고 시험 제목·제한 시간·합격 점수를 설정하세요. 완료 후 응시자·관리자 링크를 바로 받을 수 있습니다.";

export const PRIVACY_PAGE_TITLE = "개인정보처리방침";
export const PRIVACY_PAGE_DESCRIPTION = "시험폼 서비스의 개인정보 수집·이용·보관에 관한 안내입니다.";

export const TERMS_PAGE_TITLE = "이용약관";
export const TERMS_PAGE_DESCRIPTION = "시험폼 서비스 이용 조건과 운영자·이용자의 권리·의무를 안내합니다.";

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "회원가입이 필요한가요?",
    answer:
      "아니요. 시험을 만들고 응시하는 모두 별도 로그인 없이 링크만으로 이용할 수 있습니다. 관리자 링크는 북마크해 두세요.",
  },
  {
    question: "관리자 링크를 잃어버리면 어떻게 하나요?",
    answer:
      "관리자 링크는 복구할 수 없습니다. CBT 생성 완료 화면에서 반드시 북마크하거나 안전한 곳에 저장해 두세요.",
  },
  {
    question: "응시자에게 시험을 어떻게 공유하나요?",
    answer:
      "생성 완료 후 표시되는 응시자 링크를 복사해 카카오톡, 이메일 등으로 공유하면 됩니다. 응시자는 닉네임만 입력하고 바로 시험을 볼 수 있습니다.",
  },
  {
    question: "채점과 통계는 자동인가요?",
    answer:
      "객관식 시험은 제출 즉시 자동 채점됩니다. 관리 페이지에서 응시자 수, 평균 점수, 문제별 정답률 등 통계를 확인할 수 있습니다.",
  },
  {
    question: "문의는 어떻게 하나요?",
    answer: `이메일(${SITE_OPERATOR.contactEmail}) 또는 카카오 오픈채팅으로 문의해 주세요. ${SITE_OPERATOR.responseNotice}됩니다.`,
  },
];

export const SITEMAP_PATHS = ["/", "/create", "/privacy", "/terms"] as const;

export const ROBOTS_NOINDEX = { index: false, follow: false } as const;
