import type { FaqItem } from "@1-blue/seo";
import { SITE_OPERATOR } from "@1-blue/legal/operator";

export const SITE_KEYWORDS = [
  "온라인 종이뽑기",
  "뽑기판 만들기",
  "추첨",
  "경품 추첨",
  "QR 뽑기",
  "회원가입 없는 뽑기",
] as const;

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "회원가입이 필요한가요?",
    answer:
      "아니요. 보드를 만든 뒤 관리자·참가자 각각 비밀 URL로 접속합니다. 별도 로그인이나 회원가입은 없습니다.",
  },
  {
    question: "참가자는 몇 번 뽑을 수 있나요?",
    answer:
      "보드 생성 시 참가자마다 뽑기 횟수(quota)를 지정할 수 있습니다. 예: 2회면 두 칸까지 뽑을 수 있습니다.",
  },
  {
    question: "언제 전체 결과가 공개되나요?",
    answer:
      "모든 참가자가 지정된 뽑기 횟수를 모두 사용하면 자동으로 전체 칸의 등수가 공개됩니다. 관리자는 수동 마감도 할 수 있습니다.",
  },
  {
    question: "QR 코드는 어떻게 쓰나요?",
    answer:
      "관리자 페이지에서 참가자별 QR을 생성해 출력하거나 공유하면, 스마트폰으로 스캔해 바로 뽑기 페이지로 이동할 수 있습니다.",
  },
  {
    question: "문의는 어떻게 하나요?",
    answer: `이메일(${SITE_OPERATOR.contactEmail}) 또는 카카오 오픈채팅으로 문의해 주세요. ${SITE_OPERATOR.responseNotice}됩니다.`,
  },
];
