import type { FaqItem } from "@1-blue/seo";
import { SITE_OPERATOR } from "@1-blue/legal/operator";

export const SITE_KEYWORDS = [
  "오늘의 낙서",
  "공유 그림판",
  "같이 그리기",
  "매일 초기화 낙서장",
  "온라인 방명록 그리기",
] as const;

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "매일 언제 초기화되나요?",
    answer:
      "한국 시간 기준 매일 자정(00:00)에 오늘의 캔버스가 비워지고, 전날 낙서는 아카이브에 저장됩니다.",
  },
  {
    question: "회원가입이 필요한가요?",
    answer: "아니요. 처음 방문 시 닉네임만 정하면 바로 그릴 수 있습니다. 별도 로그인은 없습니다.",
  },
  {
    question: "다른 사람 낙서를 지울 수 있나요?",
    answer: "아니요. 되돌리기는 내가 그린 획만 가능합니다. 지우개 기능은 제공하지 않습니다.",
  },
  {
    question: "어제 낙서는 어디서 보나요?",
    answer: "상단의 ‘지난 낙서’ 메뉴에서 날짜별 아카이브를 읽기 전용으로 볼 수 있습니다.",
  },
  {
    question: "문의는 어떻게 하나요?",
    answer: `이메일(${SITE_OPERATOR.contactEmail}) 또는 카카오 오픈채팅으로 문의해 주세요. ${SITE_OPERATOR.responseNotice}됩니다.`,
  },
];
