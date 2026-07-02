# 썰톡

## 🔥 프로젝트에 대해

### 1️⃣ 프로젝트 목적

AI가 만든 카카오톡 스타일의 가상 썰을 카테고리별로 읽고 반응과 댓글을 나누는 로그인 없는 익명 콘텐츠 커뮤니티입니다.

### 2️⃣ 프로젝트 기간

- ✏️ 개인 프로젝트
- ⏱️ 프로젝트 기간: `2025.06.29 ~ 진행 중`
- ⛓️ 배포: [썰톡](https://ob-sseoltalk.vercel.app)

### 3️⃣ 주요 기술

1. Anthropic 또는 Gemini로 대화형 썰을 생성하고 Gemini 검증 점수로 품질 관리
2. Supabase repository를 통한 피드·조회수·반응·익명 댓글과 답글 관리
3. Vercel Cron 기반 일일 생성과 공개 썰 동적 sitemap·구조화 데이터 구성

## ✨ 주요 기능

1. **카카오톡 스타일 썰 피드**
   - 가족·직장·연애·친구·진상 카테고리와 인기·랜덤 탐색을 제공합니다.
2. **반응과 익명 댓글**
   - 네 종류의 반응과 닉네임·비밀번호 기반 댓글, 답글, 수정·삭제를 지원합니다.
3. **AI 생성·검수 자동화**
   - 관리자 API와 cron으로 썰을 생성하고 현실성·자연스러움·공감·마무리를 검증합니다.
4. **콘텐츠 SEO**
   - 공개 썰 상세 URL을 동적 sitemap에 포함하고 FAQ·WebSite JSON-LD를 제공합니다.

## 🛠️ 기술 스택

|                                            `Next.js`                                            |                                           `Supabase`                                            |                                             `Tailwind CSS`                                             |                                          `Vercel`                                           |
| :---------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------: |
| <img src="https://cdn.simpleicons.org/nextdotjs/000000" alt="Next.js" width="75" height="75" /> | <img src="https://cdn.simpleicons.org/supabase/3FCF8E" alt="Supabase" width="75" height="75" /> | <img src="https://cdn.simpleicons.org/tailwindcss/06B6D4" alt="Tailwind CSS" width="75" height="75" /> | <img src="https://cdn.simpleicons.org/vercel/000000" alt="Vercel" width="75" height="75" /> |

- FrontEnd: TypeScript, React 19, TanStack Query, Lucide React
- BackEnd & Data: Next.js Route Handlers, Supabase, Anthropic API, Gemini API
- 품질: Zod, Vitest, Playwright, ESLint, TypeScript

## 🗺️ 주요 페이지

| 경로              | 설명             | 검색 노출 |
| ----------------- | ---------------- | --------- |
| `/`               | 최신 썰 피드     | O         |
| `/popular`        | 인기 썰          | O         |
| `/random`         | 랜덤 썰 이동     | X         |
| `/category/:name` | 카테고리별 썰    | O         |
| `/story/:id`      | 썰 상세          | 동적      |
| `/privacy`        | 개인정보처리방침 | O         |
| `/terms`          | 이용약관         | O         |

## 📁 프로젝트 구조

```text
apps/web-sseoltalk/
├── src/app/       # 피드·상세 화면, Route Handlers, cron 및 SEO
├── src/core/      # 카테고리·반응·댓글·AI prompt와 schema
├── src/lib/       # repository, 인증 및 AI provider adapter
├── e2e/           # Playwright 사용자 흐름
├── APP.md
├── DESIGN.md
└── vercel.json    # 일일 썰 생성 cron
```

## 🚀 실행 방법

```bash
pnpm install
cp apps/web-sseoltalk/.env.example apps/web-sseoltalk/.env.local
pnpm dev:sseoltalk
```

사이트 URL, Supabase, Anthropic·Gemini 모델과 API key, 관리자 secret 및 선택적인 AdSense 환경변수를 사용합니다.

## ✅ 검증

```bash
pnpm --filter web-sseoltalk test
pnpm --filter web-sseoltalk lint
pnpm --filter web-sseoltalk typecheck
pnpm --filter web-sseoltalk build
```

## 📚 문서

- [제품 요구사항](./APP.md)
- [디자인 가이드](./DESIGN.md)
