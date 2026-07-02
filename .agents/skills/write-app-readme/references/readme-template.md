# App README Template

앱에 존재하는 정보만 남기고 괄호 placeholder는 실제 값으로 교체한다.

````markdown
<!-- 대표 이미지가 확인된 경우에만 삽입 -->
<img width="..." height="..." alt="{앱 이름} 대표 화면" src="{확인된 URL}" />

## 🔥 프로젝트에 대해

### 1️⃣ 프로젝트 목적

{누구의 어떤 문제를 어떻게 해결하는지 1~3문장}

### 2️⃣ 프로젝트 기간

- ✏️ 개인 프로젝트
- ⏱️ 프로젝트 기간: `{사용자가 확인한 값}`
- ⛓️ 배포: [{앱 이름}]({확인된 배포 URL})

### 3️⃣ 주요 기술

1. {제품의 핵심 경험을 만든 기술 선택}
2. {데이터·실시간·AI·배포에서 중요한 선택}
3. {테스트·운영·SEO에서 중요한 선택}

## ✨ 주요 기능

1. **{기능명}**
   - {실제 동작}
2. **{기능명}**
   - {실제 동작}

## 🛠️ 기술 스택

### 1️⃣ Common

|                                            `TypeScript`                                             |                                            `Turborepo`                                            |                                         `pnpm`                                          |
| :-------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------: |
| <img src="https://cdn.simpleicons.org/typescript/3178C6" alt="TypeScript" width="75" height="75" /> | <img src="https://cdn.simpleicons.org/turborepo/FF1E56" alt="Turborepo" width="75" height="75" /> | <img src="https://cdn.simpleicons.org/pnpm/F69220" alt="pnpm" width="75" height="75" /> |

### 2️⃣ FrontEnd

{실제로 사용하는 framework와 UI library만 표로 작성}

### 3️⃣ BackEnd & Data

{Route Handler, Supabase, storage, AI provider 등 실제 사용 항목만 작성}

### 4️⃣ Infra & Quality

{Vercel, GitHub Actions, Vitest, Playwright 등 실제 사용 항목만 작성}

## 🗺️ 주요 페이지

| 경로                       | 설명    | 검색 노출 |
| -------------------------- | ------- | --------- |
| `/`                        | 홈      | O         |
| `{ROUTES에서 확인한 경로}` | {label} | {정책}    |

동적 경로는 `/items/:id`처럼 구조만 표시하고 실제 token과 ID는 넣지 않는다.

## 📁 프로젝트 구조

```text
apps/{app}/
├── src/app/       # App Router pages and route handlers
├── src/core/      # App-local domain logic, when present
├── src/lib/       # Repositories and external adapters
├── public/
├── APP.md
├── DESIGN.md
└── package.json
```
````

실제 존재하는 폴더만 남기고 앱 특화 구조를 짧게 설명한다.

## 🚀 실행 방법

```bash
pnpm install
cp apps/{app}/.env.example apps/{app}/.env.local
pnpm dev:{slug}
```

환경변수는 이름과 용도만 설명하고 값을 노출하지 않는다.

## ✅ 검증

```bash
pnpm --filter {package-name} test
pnpm --filter {package-name} lint
pnpm --filter {package-name} typecheck
pnpm --filter {package-name} build
```

## 📚 문서

- [제품 요구사항](./APP.md)
- [디자인 가이드](./DESIGN.md)
- {확인된 외부 문서나 블로그 링크}

```

## 작성 원칙

- 목적은 기능 나열보다 먼저 쓴다.
- 주요 기술은 package 목록이 아니라 설계상 의미가 있는 선택을 설명한다.
- DB가 없는 앱에는 BackEnd section을 만들지 않는다.
- 자동화가 없는 앱에는 자동화 section을 만들지 않는다.
- 미배포 앱은 배포 링크를 생략하되 사용자와 합의한 경우에만 상태를 명시한다.
```
