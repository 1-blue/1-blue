import type { FaqItem } from "@1-blue/seo";
import { SITE_OPERATOR } from "@1-blue/legal/operator";

export const SITE_KEYWORDS = [
  "오늘의 추론",
  "추리 게임",
  "일일 퍼즐",
  "단서 암기",
  "지니어스",
  "객관식 추론",
  "피의 게임",
  "피의 게임 x",
] as const;

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "암기 모드와 열람 모드의 차이는?",
    answer:
      "암기 모드는 제한 시간 동안 단서를 암기한 뒤 단서 없이 문제를 풉니다. 열람 모드는 단서를 보면서 풀 수 있습니다. 두 모드 모두 풀이 시간은 랭킹에 반영됩니다.",
  },
  {
    question: "하루에 몇 번 풀 수 있나요?",
    answer:
      "오늘의 세트는 기기당 하루 1회만 제출할 수 있습니다. 이미 풀었다면 결과 화면으로 이동합니다.",
  },
  {
    question: "FAKE 단서란?",
    answer: "거짓 단서입니다. 결과 화면에서 어떤 단서가 FAKE였는지 공개됩니다.",
  },
  {
    question: "아카이브는 랭킹에 반영되나요?",
    answer: "아니요. 과거 세트는 연습용이며 결과는 기기에만 저장되고 랭킹에는 반영되지 않습니다.",
  },
  {
    question: "문의는 어떻게 하나요?",
    answer: `이메일(${SITE_OPERATOR.contactEmail}) 또는 카카오 오픈채팅으로 문의해 주세요. ${SITE_OPERATOR.responseNotice}됩니다.`,
  },
];
