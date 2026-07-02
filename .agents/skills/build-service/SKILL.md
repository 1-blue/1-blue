---
name: build-service
description: 승인된 APP.md·DESIGN.md 또는 개발 프롬프트로 1-blue Factory 앱을 생성·구현·검증한다. 단계형 모드의 디자인 승인 후 요청과, 사용자가 한번에·중간 확인 없이·디자인부터 구현까지를 명시해 design-service가 자체 검수한 일괄 모드 handoff 모두에 사용하며 web template, page-private 배치, 앱 로컬 core, ROUTES, UI·SEO·테스트·로컬 확인을 담당한다.
---

# Build Service

승인된 전략과 디자인을 현재 모노레포 규칙에 맞춰 구현한다.

## 시작 조건

1. `APP.md`, `DESIGN.md` 또는 동등한 승인된 handoff를 확인한다.
2. 실행 모드를 확인한다.
   - `staged`: 사용자가 Stitch 결과를 확인하고 구현을 승인했는지 확인한다.
   - `one-shot`: 최초 요청에 일괄 진행이 명시됐고 `$design-service`가 결과를 자체 검수했다면 별도 승인 없이 계속한다.
3. 제품 선택이 남았거나 Stitch 결과가 없으면 모드와 관계없이 `$plan-service` 또는 `$design-service`로 돌아간다.
4. 계정, API key, schema 결정 등 외부 선행 작업을 [구현 체크리스트](references/implementation-checklist.md)로 확인한다.
5. 선행 작업 없이는 안전하게 진행할 수 없으면 일괄 모드라도 필요한 사용자 작업을 알리고 기다린다.

## 구현

1. `web-static` 또는 `web-api`를 선택하고 앱이 없을 때만 `pnpm create:app`을 실행한다.
2. `apps/registry.json`, port, root dev script를 확인한다.
3. route별 UI를 가장 가까운 `_components`, `_hooks`, `_utils`, `_types`에 배치한다.
4. 페이지 전용 로직은 `_utils`, 앱 공통 도메인 로직은 `src/core`, repository와 외부 adapter는 `src/lib`에 둔다.
5. 실제로 여러 앱/채널이 공유하지 않는 로직을 `packages/core`에 추가하지 않는다.
6. `src/app/_constants/routes.ts`에 `ROUTES`를 만들고 Link, router, redirect, canonical, 공유 URL, sitemap에서 사용한다.
7. [docs/ROUTING.md](../../../docs/ROUTING.md)에 따라 sitemap metadata와 동적 path builder를 구분한다.
8. DB가 필요하면 `$manage-supabase-schema` 절차를 따른다. OpenAPI가 실제로 있을 때만 Orval client를 연결한다.
9. metadata, H1, FAQ, JSON-LD, sitemap, robots, privacy, terms를 제품 범위에 맞게 구현한다.
10. 디자인 screenshot과 PC·Tablet·Mobile 결과를 브라우저에서 비교해 수정한다.

## 완료

1. 앱 filter로 test, lint, typecheck, build를 실행한다.
2. 주요 happy path와 오류·빈 상태를 실제 브라우저로 확인한다.
3. `$write-app-readme`를 사용하되 외부 정보가 없으면 사용자에게 확인한다.
4. 검증 결과와 남은 외부 작업을 보고하고, 사용자가 요청하기 전에는 배포하지 않는다.

## 경계

- 관련 없는 기존 앱이나 전역 포맷을 함께 리팩터링하지 않는다.
- 원격 migration, Vercel 배포, Search Console/AdSense 등록은 구현 완료와 별도 승인 없이 실행하지 않는다.
