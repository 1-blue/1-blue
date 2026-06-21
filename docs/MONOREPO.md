# 1-blue Monorepo

서비스 팩토리 Monorepo입니다. 템플릿 기반으로 웹(Vercel+AdSense), AIT(토스), Expo(Play Store+AdMob) 앱을 생성합니다.

## Quick Start

```bash
pnpm install
pnpm create:app --type web-static --slug my-app --name "My App"
cp apps/web-my-app/.env.example apps/web-my-app/.env.local
pnpm dev:my-app
```

## Structure

- `apps/_template-*` — 앱 템플릿
- `apps/web-*`, `apps/ait-*`, `apps/expo-*` — 생성된 앱
- `packages/core` — 프레임워크 무관 비즈니스 로직
- `packages/ui` — shadcn/ui + Storybook
- `packages/database` — Supabase client
- `tools/create-app` — 앱 스캐폴딩 CLI

## Factory workflow

새 앱은 **전략 → Stitch → 구현** 2단계로 진행합니다.

1. **Phase 1** — Cursor skill `plan-service`: DESIGN.md 추천, Stitch 프롬프트, SEO, APP.md 초안 (코드 없음)
2. **External** — Stitch 디자인, `DESIGN.md` 저장
3. **Phase 2** — `create-service` + `apply-design`: 승인 후 scaffold·구현

상세: [FACTORY-WORKFLOW.md](./FACTORY-WORKFLOW.md)

## Docs

- [FACTORY-WORKFLOW.md](./FACTORY-WORKFLOW.md)
- [ROADMAP.md](./ROADMAP.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [EXTERNAL-CHECKLIST.md](./EXTERNAL-CHECKLIST.md)

## Scripts

| Command                | Description                         |
| ---------------------- | ----------------------------------- |
| `pnpm create:app`      | 새 앱 생성 (포트·dev 스크립트 자동) |
| `pnpm dev:{slug}`      | web 앱 dev (없으면 ait/expo)        |
| `pnpm dev:{slug}:ait`  | ait 앱 dev                          |
| `pnpm dev:{slug}:expo` | expo 앱 dev                         |
| `pnpm dev`             | turbo dev (전체)                    |
| `pnpm test`            | affected tests                      |
| `pnpm ui:add button`   | shadcn 컴포넌트 추가                |

## Environment Variables

루트 [`.env.example`](../.env.example)는 **색인**입니다. 생성 시 템플릿별 파일이 앱 폴더로 복사됩니다.

| Template             | Env file                                      |
| -------------------- | --------------------------------------------- |
| web-static / web-api | `apps/web-{slug}/.env.example` → `.env.local` |
| ait                  | `apps/ait-{slug}/ENV.md`                      |
| expo                 | `apps/expo-{slug}/ENV.md` + `app.json`        |

### Ports (동시 실행)

| Range         | Usage                      |
| ------------- | -------------------------- |
| **7000–7599** | Next.js (`web-*`, `ait-*`) |
| **8000–8599** | Expo Metro (`expo-*`)      |

`apps/registry.json`의 `ports` 필드에 기록됩니다.

| Variable                        | Required               | Used by                           |
| ------------------------------- | ---------------------- | --------------------------------- |
| `NEXT_PUBLIC_SITE_URL`          | web apps (recommended) | `http://localhost:{port}`         |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | optional               | AdSense placeholder               |
| `NEXT_PUBLIC_SUPABASE_URL`      | web-api                | `@1-blue/database` browser client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | web-api                | `@1-blue/database` browser client |
| `SUPABASE_SERVICE_ROLE_KEY`     | web-api server         | Route Handlers only               |
