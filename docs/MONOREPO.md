# 1-blue Monorepo

템플릿과 공통 패키지로 작은 웹 서비스를 반복 제작하는 pnpm/Turborepo 서비스 팩토리다.

## Quick Start

```bash
pnpm install
pnpm create:app --type web-static --slug my-app --name "My App"
cp apps/web-my-app/.env.example apps/web-my-app/.env.local
pnpm dev:my-app
```

새 서비스는 CLI부터 실행하지 않고 [Factory Workflow](./FACTORY-WORKFLOW.md)의 기획·디자인 승인을 먼저 진행한다.

## 구조

- `apps/_template-*`: web, AIT, Expo template
- `apps/web-*`: Vercel 대상 실제 웹앱
- `packages/ui`: 여러 앱이 공유하는 shadcn/ui component
- `packages/database`: Supabase client 기반
- `packages/seo`: metadata, FAQ JSON-LD, sitemap helper
- `packages/legal`: 공통 운영자 정보와 법적 문서
- `packages/libs`: 범용 utility
- `packages/core`: 두 개 이상의 앱/채널이 실제 공유하는 domain logic만 허용
- `tools/create-app`: app scaffold와 registry/port 등록 CLI
- `.agents/skills`: 이 저장소의 Codex workflow

## 앱 내부 배치

```text
apps/web-{slug}/src/
├── app/
│   ├── _constants/routes.ts
│   ├── _components/       # 앱 전체 route가 공유할 때만
│   └── route/
│       ├── _components/   # 해당 route에 가장 가까운 UI
│       ├── _hooks/
│       ├── _utils/
│       └── page.tsx
├── core/                  # 앱 여러 route가 공유하는 순수 domain logic
└── lib/                   # repository와 외부 adapter
```

하나의 page가 쓰는 코드는 해당 route에 둔다. 여러 page가 공유하면 가장 가까운 공통 route 부모로 올린다. 미래의 재사용을 예상해 packages로 이동하지 않는다.

## 라우팅

각 앱은 `src/app/_constants/routes.ts`의 `ROUTES`를 내부 navigation, redirect, canonical, 공유 URL, sitemap의 단일 원본으로 사용한다. 상세 규칙은 [ROUTING.md](./ROUTING.md)를 따른다.

## Scripts

| Command              | Description                     |
| -------------------- | ------------------------------- |
| `pnpm create:app`    | 새 앱 생성과 registry/port 등록 |
| `pnpm dev:{slug}`    | 앱 개발 서버                    |
| `pnpm build`         | 전체 Turbo build                |
| `pnpm lint`          | 전체 lint                       |
| `pnpm typecheck`     | 전체 typecheck                  |
| `pnpm test`          | 전체 unit test                  |
| `pnpm ui:add button` | 공통 shadcn component 추가      |

앱 작업은 가능한 한 `pnpm --filter web-{slug} ...`로 좁혀 검증한다.

## 환경변수

루트 `.env.example`은 색인이다. 실제 값은 앱별 local/hosting environment에 둔다.

| Template           | Local file                                    |
| ------------------ | --------------------------------------------- |
| web-static/web-api | `apps/web-{slug}/.env.example` → `.env.local` |
| AIT                | `apps/ait-{slug}/ENV.md`                      |
| Expo               | `apps/expo-{slug}/ENV.md`와 native config     |

service-role key, provider secret, webhook URL은 client에 노출하거나 커밋하지 않는다.

## Codex Skills

| Skill                    | 역할                         |
| ------------------------ | ---------------------------- |
| `plan-service`           | 아이디어·제품·SEO 전략       |
| `design-service`         | Stitch 디자인과 개발 handoff |
| `build-service`          | scaffold·구현·로컬 검증      |
| `manage-supabase-schema` | 앱별 DB schema 관리          |
| `write-app-readme`       | 실제 구현 기반 README        |
| `launch-service`         | Vercel·검색·AdSense 출시     |

## 관련 문서

- [FACTORY-WORKFLOW.md](./FACTORY-WORKFLOW.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [ROUTING.md](./ROUTING.md)
- [EXTERNAL-CHECKLIST.md](./EXTERNAL-CHECKLIST.md)
