# 오늘의 추론

## 🔥 프로젝트에 대해

### 1️⃣ 프로젝트 목적

매일 새롭게 제공되는 단서와 객관식 문제를 암기 또는 열람 모드로 풀고, 다른 참여자와 기록을 비교하는 일일 추리 퍼즐입니다.

### 2️⃣ 프로젝트 기간

- ✏️ 개인 프로젝트
- ⏱️ 프로젝트 기간: `2025.06.24 ~ 진행 중`
- ⛓️ 배포: [오늘의 추론](https://ob-daily-deduction.vercel.app)

### 3️⃣ 주요 기술

1. 정답과 FAKE 단서를 서버에 숨긴 채 제출 시 채점하는 Next.js Route Handler 구조
2. Gemini 생성 결과를 Zod로 검증하고 3일치 퍼즐을 미리 확보하는 자동화 파이프라인
3. KST 날짜, 참여 세션, 오답 수와 풀이 시간을 활용한 일일 랭킹

## ✨ 주요 기능

1. **두 가지 추론 모드**
   - 제한 시간 동안 단서를 외우는 암기 모드와 단서를 보며 푸는 열람 모드를 제공합니다.
2. **채점·랭킹·결과 공유**
   - 객관식 답안을 서버에서 채점하고 FAKE 단서를 공개하며 결과를 PNG로 저장할 수 있습니다.
3. **아카이브와 자동 생성**
   - 지난 퍼즐을 연습용으로 제공하고 Vercel Cron으로 향후 퍼즐을 생성합니다.

## 🛠️ 기술 스택

|                                            `Next.js`                                            |                                             `Tailwind CSS`                                             |                                           `Supabase`                                            |                                          `Vercel`                                           |
| :---------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------: |
| <img src="https://cdn.simpleicons.org/nextdotjs/000000" alt="Next.js" width="75" height="75" /> | <img src="https://cdn.simpleicons.org/tailwindcss/06B6D4" alt="Tailwind CSS" width="75" height="75" /> | <img src="https://cdn.simpleicons.org/supabase/3FCF8E" alt="Supabase" width="75" height="75" /> | <img src="https://cdn.simpleicons.org/vercel/000000" alt="Vercel" width="75" height="75" /> |

- FrontEnd: TypeScript, React 19, TanStack Query, html2canvas, Sonner
- BackEnd & Data: Next.js Route Handlers, Supabase, Gemini, Vercel Cron
- 품질: Zod, Vitest, Playwright, ESLint, TypeScript

## 🗺️ 주요 페이지

| 경로             | 설명             | 검색 노출 |
| ---------------- | ---------------- | --------- |
| `/`              | 오늘의 추론      | O         |
| `/archive`       | 지난 추론 목록   | O         |
| `/archive/:date` | 지난 추론 플레이 | O         |
| `/ranking`       | 일일 랭킹        | O         |
| `/privacy`       | 개인정보처리방침 | O         |
| `/terms`         | 이용약관         | O         |

## 📁 프로젝트 구조

```text
apps/web-daily-deduction/
├── src/app/       # 게임 화면, Route Handlers, cron 및 SEO
├── src/core/      # 퍼즐 타입·검증·생성 파이프라인
├── src/lib/       # repository, DB 및 Slack adapter
├── scripts/       # 퍼즐 seed 도구
├── e2e/           # Playwright 사용자 흐름
├── APP.md
├── DESIGN.md
└── vercel.json    # 퍼즐 선행 생성 cron
```

## 🚀 실행 방법

```bash
pnpm install
pnpm dev:daily-deduction
```

운영 시 사이트 URL, Supabase, Gemini, 관리자·cron secret 및 Slack 관련 환경변수를 설정해야 합니다.

## ✅ 검증

```bash
pnpm --filter web-daily-deduction test
pnpm --filter web-daily-deduction lint
pnpm --filter web-daily-deduction typecheck
pnpm --filter web-daily-deduction build
```

## 📚 문서

- [제품 요구사항](./APP.md)
- [디자인 가이드](./DESIGN.md)
