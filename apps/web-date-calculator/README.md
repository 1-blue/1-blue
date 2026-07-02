# 날짜 계산기

## 🔥 프로젝트에 대해

### 1️⃣ 프로젝트 목적

두 날짜 사이의 일수와 특정 날짜를 기준으로 N일 후·전 날짜를 빠르게 계산하는 모바일 친화적 웹 도구입니다.

### 2️⃣ 프로젝트 기간

- ✏️ 개인 프로젝트
- ⏱️ 프로젝트 기간: `2025.06.21 ~ 진행 중`
- ⛓️ 배포: [날짜 계산기](https://ob-date-calculator.vercel.app)

### 3️⃣ 주요 기술

1. 날짜를 정규화한 순수 함수로 일수 차이와 날짜 더하기·빼기 계산
2. Next.js 정적 내보내기와 검색 키워드·FAQ JSON-LD를 활용한 SEO 구성
3. `ROUTES`를 기준으로 canonical, sitemap, 법적 페이지 경로를 일관되게 관리

## ✨ 주요 기능

1. **두 날짜 사이 일수 계산**
   - 시작일 포함 여부를 선택해 두 날짜 사이의 달력 일수를 계산합니다.
2. **날짜 더하기·빼기**
   - 기준일로부터 N일 후·전 날짜를 계산하며 7·30·100·365일 프리셋을 제공합니다.
3. **검색 및 운영 페이지**
   - FAQ 구조화 데이터, sitemap, robots, 개인정보처리방침과 이용약관을 제공합니다.

## 🛠️ 기술 스택

|                                            `TypeScript`                                             |                                            `Next.js`                                            |                                             `Tailwind CSS`                                             |                                          `Vercel`                                           |
| :-------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------: |
| <img src="https://cdn.simpleicons.org/typescript/3178C6" alt="TypeScript" width="75" height="75" /> | <img src="https://cdn.simpleicons.org/nextdotjs/000000" alt="Next.js" width="75" height="75" /> | <img src="https://cdn.simpleicons.org/tailwindcss/06B6D4" alt="Tailwind CSS" width="75" height="75" /> | <img src="https://cdn.simpleicons.org/vercel/000000" alt="Vercel" width="75" height="75" /> |

- UI: React 19, `@1-blue/ui`, Tailwind CSS 4
- 품질: Vitest, Playwright, ESLint, TypeScript
- SEO·운영: `@1-blue/seo`, 정적 sitemap·robots, AdSense 연동 환경변수

## 🗺️ 주요 페이지

| 경로       | 설명             | 검색 노출 |
| ---------- | ---------------- | --------- |
| `/`        | 날짜 계산기      | O         |
| `/privacy` | 개인정보처리방침 | O         |
| `/terms`   | 이용약관         | O         |

## 📁 프로젝트 구조

```text
apps/web-date-calculator/
├── src/app/       # App Router 화면, SEO 및 법적 페이지
├── src/core/      # 날짜 계산 순수 함수와 단위 테스트
├── e2e/           # Playwright 사용자 흐름
├── public/        # 정적 자산
├── APP.md
├── DESIGN.md
└── package.json
```

## 🚀 실행 방법

```bash
pnpm install
cp apps/web-date-calculator/.env.example apps/web-date-calculator/.env.local
pnpm dev:date-calculator
```

환경변수는 사이트 기준 URL과 선택적인 AdSense client·slot ID를 사용합니다.

## ✅ 검증

```bash
pnpm --filter web-date-calculator test
pnpm --filter web-date-calculator lint
pnpm --filter web-date-calculator typecheck
pnpm --filter web-date-calculator build
```

## 📚 문서

- [제품 요구사항](./APP.md)
- [디자인 가이드](./DESIGN.md)
