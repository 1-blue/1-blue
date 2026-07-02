# 시험폼

## 🔥 프로젝트에 대해

### 1️⃣ 프로젝트 목적

회원가입 없이 객관식 CBT를 만들고 링크로 공유해 응시·자동 채점·결과 분석까지 진행하는 온라인 시험 제작 서비스입니다.

### 2️⃣ 프로젝트 기간

- ✏️ 개인 프로젝트
- ⏱️ 프로젝트 기간: `2025.06.25 ~ 진행 중`
- ⛓️ 배포: [시험폼](https://ob-siheomform.vercel.app)

### 3️⃣ 주요 기술

1. dnd-kit 기반 문제 편집기와 Zod 검증으로 객관식 CBT 구성
2. 공개 ID와 복구할 수 없는 관리자 token을 분리한 로그인 없는 공유·관리 흐름
3. Supabase에 시험·응시·댓글을 저장하고 S3에 문제 이미지를 업로드

## ✨ 주요 기능

1. **CBT 제작**
   - 제목, 제한 시간, 합격 점수, 객관식 문제와 선택지를 설정하고 순서를 변경할 수 있습니다.
2. **응시와 자동 채점**
   - 공개 링크에서 닉네임으로 응시하고 제출 즉시 점수와 문항별 결과를 확인합니다.
3. **관리와 통계**
   - 관리자 링크에서 시험을 수정하고 응시자 수·평균 점수·문항별 정답률을 확인합니다.
4. **커뮤니티 기능**
   - 공개 시험 목록, 좋아요, 댓글과 답글을 지원합니다.

## 🛠️ 기술 스택

|                                            `Next.js`                                            |                                           `Supabase`                                            |                                             `Tailwind CSS`                                             |                                           `Amazon S3`                                            |
| :---------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------: |
| <img src="https://cdn.simpleicons.org/nextdotjs/000000" alt="Next.js" width="75" height="75" /> | <img src="https://cdn.simpleicons.org/supabase/3FCF8E" alt="Supabase" width="75" height="75" /> | <img src="https://cdn.simpleicons.org/tailwindcss/06B6D4" alt="Tailwind CSS" width="75" height="75" /> | <img src="https://cdn.simpleicons.org/amazons3/569A31" alt="Amazon S3" width="75" height="75" /> |

- FrontEnd: TypeScript, React 19, dnd-kit, TanStack Query, Recharts, html2canvas
- BackEnd & Data: Next.js Route Handlers, Supabase, AWS SDK for S3
- 품질: Zod, Vitest, Playwright, ESLint, TypeScript

## 🗺️ 주요 페이지

| 경로                               | 설명                  | 검색 노출 |
| ---------------------------------- | --------------------- | --------- |
| `/`                                | 서비스 소개·공개 시험 | O         |
| `/create`                          | CBT 만들기            | O         |
| `/create/questions`                | 문제 작성             | X         |
| `/create/complete`                 | 생성 완료             | X         |
| `/cbt/:publicId`                   | 시험 소개             | 동적      |
| `/cbt/:publicId/take`              | 시험 응시             | X         |
| `/cbt/:publicId/result/:attemptId` | 응시 결과             | X         |
| `/manage/:adminToken`              | 시험 관리             | X         |
| `/manage/:adminToken/edit`         | 시험 수정             | X         |
| `/manage/:adminToken/stats`        | 시험 통계             | X         |
| `/privacy`                         | 개인정보처리방침      | O         |
| `/terms`                           | 이용약관              | O         |

관리자 token과 실제 관리 URL은 README에 노출하지 않습니다.

## 📁 프로젝트 구조

```text
apps/web-siheomform/
├── src/app/       # CBT 제작·응시·관리 화면과 Route Handlers
├── src/core/      # draft, mapper, token 및 점수 계산 로직
├── src/lib/       # Supabase repository와 DB client
├── scripts/       # 공개 CBT seed 데이터
├── e2e/           # Playwright 제작·편집 흐름
├── APP.md
├── DESIGN.md
└── package.json
```

## 🚀 실행 방법

```bash
pnpm install
cp apps/web-siheomform/.env.example apps/web-siheomform/.env
pnpm dev:siheomform
```

사이트 URL, Supabase 3종, S3 region·access key·secret key·bucket과 선택적인 AdSense 환경변수를 사용합니다.

## ✅ 검증

```bash
pnpm --filter web-siheomform test
pnpm --filter web-siheomform lint
pnpm --filter web-siheomform typecheck
pnpm --filter web-siheomform build
```

## 📚 문서

- [제품 요구사항](./APP.md)
- [디자인 가이드](./DESIGN.md)
