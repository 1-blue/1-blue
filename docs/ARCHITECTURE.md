# Architecture

## Channel Separation

| Channel           | Template               | Build                      | Monetization |
| ----------------- | ---------------------- | -------------------------- | ------------ |
| Vercel Web static | `_template-web-static` | `next build` export        | AdSense      |
| Vercel Web API    | `_template-web-api`    | Next.js SSR/Route Handlers | AdSense      |
| Apps in Toss      | `_template-ait`        | `ait build`                | AIT ads      |
| Play Store        | `_template-expo`       | EAS build                  | AdMob        |

현재 기본 제품 흐름은 Vercel Web이다. AIT와 Expo는 사용자가 명시할 때만 선택형 채널로 다룬다. AIT는 SSR이나 외부 URL hosting을 전제하지 않는다.

## Ownership Boundaries

### Route-local

page 하나의 component, hook, util, type은 해당 route의 private folder가 소유한다. sibling page가 공유하면 가장 가까운 공통 route segment로 올린다.

### App-local

- 앱 전체 UI shell: `src/app/_components`
- 페이지 URL: `src/app/_constants/routes.ts`
- 앱 domain logic: `src/core`
- DB와 외부 adapter: `src/lib`

### Cross-app

두 개 이상의 독립 앱이나 채널이 현재 사용하는 안정된 API만 packages로 승격한다. 한 앱만 사용하는 기능을 공용 package에 두지 않는다.

## Routing

Next.js directory는 route 구현의 source of truth이고 `ROUTES`는 URL 문자열과 label의 source of truth다. Link, router, redirect, canonical, sitemap은 `ROUTES`를 사용한다. 공개 정적 route만 sitemap metadata를 가지며 동적 sitemap은 DB entity와 path builder를 결합한다.

상세: [ROUTING.md](./ROUTING.md)

## Supabase

- DB 없는 앱은 Supabase에 연결하지 않는다.
- DB 앱은 `app_{slug}` schema를 사용한다.
- create migration과 PostgREST expose 설정을 함께 관리한다.
- schema/table 타입과 app repository를 migration에 맞춰 동기화한다.
- 원격 migration은 사용자 승인 후 적용한다.

앱 수와 운영 복잡도가 커져 schema-per-app의 한계가 나타날 때만 tenant pattern을 재검토한다.

## SEO and Legal

- 앱 metadata, keyword, FAQ는 앱이 소유한다.
- 공통 생성 helper는 `@1-blue/seo`를 사용한다.
- 운영자 정보와 법적 content는 `@1-blue/legal`을 사용한다.
- sitemap path는 앱 `ROUTES`에서 가져온다.

## Testing

| Layer                  | Tool                        |
| ---------------------- | --------------------------- |
| route/app domain logic | Vitest                      |
| shared UI              | Storybook                   |
| web user flow          | Playwright와 browser QA     |
| build boundary         | lint, typecheck, Next build |

변경 범위의 앱 filter로 먼저 검증하고, 공통 package 변경 시 영향을 받는 앱까지 확장한다.

## Delivery

기본 출시 순서는 local QA → Vercel → Google Search Console → 네이버 Search Advisor → Google AdSense다. 외부 인증과 소유권 확인은 사용자 참여를 전제로 한다.
