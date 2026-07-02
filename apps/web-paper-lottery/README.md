# 온라인 종이뽑기

## 🔥 프로젝트에 대해

### 1️⃣ 프로젝트 목적

행사 진행자가 회원가입 없이 종이뽑기판을 만들고, 참가자별 비밀 링크나 QR 코드를 공유해 온라인 추첨을 진행하는 서비스입니다.

### 2️⃣ 프로젝트 기간

- ✏️ 개인 프로젝트
- ⏱️ 프로젝트 기간: `2025.06.22 ~ 진행 중`
- ⛓️ 배포: [온라인 종이뽑기](https://ob-paper-lottery.vercel.app)

### 3️⃣ 주요 기술

1. 관리자·참가자별 비밀 URL과 참가자별 quota로 로그인 없는 뽑기 흐름 구현
2. Supabase repository와 서버 Route Handler를 통한 원자적 추첨·마감 처리
3. QR 코드 생성과 Framer Motion 기반 종이 찢기·결과 공개 애니메이션

## ✨ 주요 기능

1. **뽑기판 생성 및 관리**
   - 참가자, 뽑기 횟수, 등수별 수량을 설정하고 관리자 화면에서 진행 상태를 확인합니다.
2. **참가자별 온라인 추첨**
   - 비밀 링크 또는 QR 코드로 접속해 배정된 횟수만큼 종이를 선택합니다.
3. **마감과 결과 공개**
   - 모든 quota 소진 시 자동 마감되며 관리자가 수동 마감하거나 전체 결과를 확인할 수 있습니다.

## 🛠️ 기술 스택

|                                            `Next.js`                                            |                                           `Supabase`                                            |                                             `Tailwind CSS`                                             |                                          `Vercel`                                           |
| :---------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------: |
| <img src="https://cdn.simpleicons.org/nextdotjs/000000" alt="Next.js" width="75" height="75" /> | <img src="https://cdn.simpleicons.org/supabase/3FCF8E" alt="Supabase" width="75" height="75" /> | <img src="https://cdn.simpleicons.org/tailwindcss/06B6D4" alt="Tailwind CSS" width="75" height="75" /> | <img src="https://cdn.simpleicons.org/vercel/000000" alt="Vercel" width="75" height="75" /> |

- FrontEnd: TypeScript, React 19, TanStack Query, Framer Motion, Lucide React
- BackEnd & Data: Next.js Route Handlers, Supabase, QRCode
- 품질: Zod, Vitest, Playwright, ESLint, TypeScript

## 🗺️ 주요 페이지

| 경로                   | 설명                    | 검색 노출 |
| ---------------------- | ----------------------- | --------- |
| `/`                    | 뽑기판 생성             | O         |
| `/b/:shortCode/admin`  | 뽑기판 관리용 비밀 화면 | X         |
| `/b/:shortCode/play`   | 참가자 뽑기 화면        | X         |
| `/b/:shortCode/result` | 전체 결과 화면          | X         |
| `/privacy`             | 개인정보처리방침        | O         |
| `/terms`               | 이용약관                | O         |

실제 `shortCode`나 관리자 URL은 README에 노출하지 않습니다.

## 📁 프로젝트 구조

```text
apps/web-paper-lottery/
├── src/app/       # 생성·관리·플레이 화면과 Route Handlers
├── src/core/      # 뽑기판 도메인 로직과 단위 테스트
├── src/lib/       # Supabase repository와 데이터 타입
├── src/types/     # 앱 공유 타입
├── e2e/           # Playwright 사용자 흐름
├── APP.md
├── DESIGN.md
└── package.json
```

## 🚀 실행 방법

```bash
pnpm install
cp apps/web-paper-lottery/.env.example apps/web-paper-lottery/.env.local
pnpm dev:paper-lottery
```

사이트 URL, Supabase URL·anon key·service-role key와 선택적인 AdSense 환경변수를 사용합니다.

## ✅ 검증

```bash
pnpm --filter web-paper-lottery test
pnpm --filter web-paper-lottery lint
pnpm --filter web-paper-lottery typecheck
pnpm --filter web-paper-lottery build
```

## 📚 문서

- [제품 요구사항](./APP.md)
- [디자인 가이드](./DESIGN.md)
