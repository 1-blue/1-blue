# 1-blue Factory Agent Guide

이 저장소는 작은 웹 서비스를 반복적으로 기획·구현·출시하는 pnpm/Turborepo 모노레포다. 기본 스택은 Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, Supabase, Vercel이다.

## 작업 원칙

- 요청 범위를 먼저 확인하고, 분석 요청에는 코드를 변경하지 않는다.
- 새 서비스는 `plan-service` → `design-service` → `build-service` → `write-app-readme` → `launch-service` 흐름을 따른다.
- 기본은 단계형 모드다. Stitch 디자인을 생성·정리한 뒤 사용자 확인을 받고 구현한다.
- 사용자가 "한번에", "중간 확인 없이", "디자인부터 구현까지", "끝까지 진행"처럼 명시하면 일괄 모드로 전환해 Stitch 결과를 자체 검수하고 로컬 구현·검증까지 이어간다.
- 일괄 모드는 배포, 원격 DB 변경, 결제, OAuth, 소유권 확인까지 자동 승인하지 않는다. 해당 작업은 사용자가 명시적으로 포함한 범위와 외부 권한을 다시 확인한다.
- 앱 작업 전 해당 앱의 `APP.md`, `DESIGN.md`, `README.md`와 [라우팅 규칙](docs/ROUTING.md)을 읽는다.
- 새 앱은 `pnpm create:app`으로 생성하고 `apps/registry.json`과 루트 dev script를 일관되게 유지한다.
- 날짜 계산은 `date-fns`와 `@1-blue/libs`만 사용한다. dayjs와 moment를 추가하지 않는다.
- 새 production dependency, 원격 DB 변경, 배포, 외부 서비스 등록, commit 또는 push는 사용자 승인 범위 안에서만 수행한다.
- API key, token, webhook, service-role key 등 비밀값을 출력하거나 커밋하지 않는다.

## Next.js 파일 배치

- 한 페이지에서만 사용하는 코드는 해당 route segment의 `_components`, `_hooks`, `_utils`, `_types`, `_constants`에 둔다.
- 여러 페이지가 공유하면 그 페이지들의 가장 가까운 공통 route 부모에 있는 동일한 private folder로 올린다.
- 앱의 모든 route에서 사용하는 코드만 `src/app/_components` 등의 app-root private folder에 둔다.
- 두 개 이상의 앱에서 실제로 공유하는 UI만 `packages/ui`로 옮긴다. 재사용을 예상한다는 이유만으로 공용화하지 않는다.
- App Router의 `page.tsx`와 `layout.tsx`는 조합과 데이터 경계를 담당하게 하고 큰 UI 구현은 가까운 `_components`로 분리한다.
- private folder를 우회하는 포괄적 `components/`, `utils/` 폴더를 새로 만들지 않는다.

## 비즈니스 로직 배치

- 페이지 전용 순수 로직은 해당 route의 `_utils`에 둔다.
- 앱 안의 여러 route가 공유하는 도메인 로직은 `apps/{app}/src/core`에 두고 앱 안에서 테스트한다.
- DB repository, 외부 API adapter, 서버 전용 연동은 앱의 `src/lib`에 둔다.
- `packages/core`에는 두 개 이상의 독립 앱 또는 Web/AIT/Expo 채널에서 현재 공유하는 프레임워크 비의존 로직만 둔다.
- 한 앱만 사용하는 기존 `packages/core` 모듈은 후속 리팩터링 대상이며, 관련 없는 작업에서 임의로 이동하지 않는다.

## 라우팅

- 각 앱은 `src/app/_constants/routes.ts`의 `ROUTES`를 페이지 URL의 단일 원본으로 사용한다.
- 내부 route는 `/`로 시작하는 문자열, 동적 route는 타입이 지정된 path builder, 외부 URL은 `EXTERNAL_LINKS` 아래에 둔다.
- `Link`, `router.push/replace`, `redirect`, canonical, 공유 URL, sitemap에서 경로 문자열을 직접 반복하지 않는다.
- 공개 정적 route에는 선택적 `sitemap` metadata를 두고, 동적 sitemap은 repository 결과와 path builder를 조합한다.
- API endpoint와 Server Action 식별자는 페이지 `ROUTES`에 넣지 않는다.
- 상세 규칙과 migration 기준은 [docs/ROUTING.md](docs/ROUTING.md)를 따른다.

## 공통 패키지

- `@1-blue/ui`: 여러 앱에서 공유하는 shadcn/ui 기반 UI
- `@1-blue/database`: Supabase client 기반
- `@1-blue/seo`: metadata, sitemap, FAQ JSON-LD helper
- `@1-blue/legal`: 운영자 정보와 법적 문서
- `@1-blue/libs`: 범용 유틸리티
- `@1-blue/api-client`: OpenAPI/Orval client가 실제로 필요할 때만 사용

## 검증

- 앱 변경 시 해당 앱 filter로 `test`, `lint`, `typecheck`, `build`를 실행한다.
- 사용자 흐름이 바뀌면 Playwright 또는 실제 브라우저로 PC·Tablet·Mobile을 확인한다.
- 문서를 변경하면 변경한 Markdown/JSON/YAML만 Prettier로 검사한다.
- 저장소 전체 `format:check`에는 기존 미포맷 파일이 있으므로, 전체 포맷을 요청받지 않은 작업에서는 기존 파일을 일괄 수정하지 않는다.
- 실패한 검증은 숨기지 말고 명령, 원인, 미실행된 검증을 최종 응답에 기록한다.

## 문서 책임

- `APP.md`: 제품 목적, 기능, SEO, route와 운영 요구사항
- `DESIGN.md`: Stitch 출처, 화면, 디자인 토큰과 반응형 규칙
- `README.md`: 실제 구현을 기반으로 한 외부 공개용 프로젝트 소개
- `docs/`: 팩토리 전체의 아키텍처와 운영 정책
- 문서와 코드가 다르면 현재 코드를 확인하고 차이를 명시한다. 추측으로 문서를 채우지 않는다.

## 외부 작업

- Stitch MCP가 있으면 프로젝트 생성, DESIGN.md 기반 디자인 시스템 적용, 반응형 화면 생성과 결과 조회를 직접 수행한다.
- 단계형 모드에서는 Stitch 결과와 자체 검토 내용을 제시한 뒤 구현 전에 기다린다. 일괄 모드에서는 접근성·반응형·화면 상태를 자체 검수하고 필요한 수정을 거쳐 구현으로 이어간다.
- Stitch MCP가 없으면 Stitch URL·스크린샷·export를 요청한다. 일괄 모드여도 연결이나 권한을 우회하지 않는다.
- Vercel 기본 프로젝트 URL은 사용 가능한 경우 `ob-{slug}.vercel.app`을 사용한다.
- 배포 확인 후 Google Search Console, 네이버 Search Advisor, Google AdSense 순으로 진행한다.
- 사용자 로그인, 결제, 소유권 확인, 심사 제출이 필요한 지점에서는 필요한 작업을 명확히 안내하고 기다린다.
