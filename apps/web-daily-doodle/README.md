# 오늘의 낙서

## 🔥 프로젝트에 대해

### 1️⃣ 프로젝트 목적

회원가입 없이 닉네임만 정해 매일 하나의 캔버스에 함께 낙서하고, 지난 결과를 날짜별로 돌아볼 수 있는 익명 공유 그림판입니다.

### 2️⃣ 프로젝트 기간

- ✏️ 개인 프로젝트
- ⏱️ 프로젝트 기간: `2025.06.21 ~ 진행 중`
- ⛓️ 배포: [오늘의 낙서](https://ob-daily-doodle.vercel.app)

### 3️⃣ 주요 기술

1. Supabase Realtime broadcast·presence로 참여자의 획과 접속 상태 동기화
2. `perfect-freehand` 기반 펜 스트로크 렌더링과 본인 획 되돌리기
3. KST 자정 cron으로 일일 보드를 마감하고 최근 30일 아카이브 제공

## ✨ 주요 기능

1. **실시간 공유 캔버스**
   - 펜·텍스트 도구와 8색 팔레트를 제공하며 다른 참여자의 낙서를 실시간 반영합니다.
2. **익명 참여와 안전한 되돌리기**
   - 닉네임을 로컬에 저장하고 본인이 작성한 최근 획만 되돌릴 수 있습니다.
3. **일일 아카이브**
   - KST 날짜 기준으로 캔버스를 마감하고 지난 낙서를 읽기 전용으로 제공합니다.

## 🛠️ 기술 스택

|                                            `Next.js`                                            |                                             `Tailwind CSS`                                             |                                           `Supabase`                                            |                                          `Vercel`                                           |
| :---------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------: |
| <img src="https://cdn.simpleicons.org/nextdotjs/000000" alt="Next.js" width="75" height="75" /> | <img src="https://cdn.simpleicons.org/tailwindcss/06B6D4" alt="Tailwind CSS" width="75" height="75" /> | <img src="https://cdn.simpleicons.org/supabase/3FCF8E" alt="Supabase" width="75" height="75" /> | <img src="https://cdn.simpleicons.org/vercel/000000" alt="Vercel" width="75" height="75" /> |

- FrontEnd: TypeScript, React 19, TanStack Query, `perfect-freehand`
- BackEnd & Data: Next.js Route Handlers, Supabase Database·Realtime
- 품질: Vitest, Playwright, ESLint, TypeScript

## 🗺️ 주요 페이지

| 경로             | 설명             | 검색 노출 |
| ---------------- | ---------------- | --------- |
| `/`              | 오늘의 공유 낙서 | O         |
| `/archive`       | 지난 낙서 목록   | O         |
| `/archive/:date` | 지난 낙서 상세   | O         |
| `/privacy`       | 개인정보처리방침 | O         |
| `/terms`         | 이용약관         | O         |

## 📁 프로젝트 구조

```text
apps/web-daily-doodle/
├── src/app/       # 화면, Route Handlers, cron 및 SEO
├── src/core/      # 스트로크 검증·렌더링·rate limit
├── src/lib/       # repository와 Supabase Realtime adapter
├── e2e/           # Playwright 사용자 흐름
├── APP.md
├── DESIGN.md
└── vercel.json    # 일일 마감 cron
```

## 🚀 실행 방법

```bash
pnpm install
cp apps/web-daily-doodle/.env.example apps/web-daily-doodle/.env.local
pnpm dev:daily-doodle
```

Supabase URL·anon key·service-role key, cron secret와 선택적인 AdSense 환경변수가 필요합니다.

## ✅ 검증

```bash
pnpm --filter web-daily-doodle test
pnpm --filter web-daily-doodle lint
pnpm --filter web-daily-doodle typecheck
pnpm --filter web-daily-doodle build
```

## 📚 문서

- [제품 요구사항](./APP.md)
- [디자인 가이드](./DESIGN.md)
