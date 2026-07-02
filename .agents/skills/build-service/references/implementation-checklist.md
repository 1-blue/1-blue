# 구현 체크리스트

## 입력

- 실행 모드: `staged` 또는 `one-shot`
- 앱 name, slug, template
- 승인된 기능 범위와 제외 범위
- APP.md와 DESIGN.md 또는 동등한 handoff
- Stitch PC·Tablet·Mobile 결과
- 단계형이면 사용자 디자인 승인, 일괄형이면 design-service 자체 검수 결과
- route와 공개/noindex 구분

## 외부 선행 작업

- Supabase project와 schema 정책
- AI/provider API와 비용 한도
- storage bucket과 CORS
- cron schedule과 timezone
- moderation 또는 운영자 정책
- 실제 legal/contact 값

값이 없더라도 mock/local 구현으로 안전하게 분리할 수 있는지 판단한다. 실제 연결이 필수면 먼저 요청한다.

## 배치 판단

| 범위                  | 위치                                   |
| --------------------- | -------------------------------------- |
| 단일 page             | route의 private folder                 |
| sibling page 공유     | 가장 가까운 공통 route 부모            |
| 앱 전체 공유          | `src/app/_*` 또는 `src/core`/`src/lib` |
| 여러 앱에서 현재 공유 | 적절한 `packages/*`                    |

## 검증 명령

```bash
pnpm --filter web-{slug} test
pnpm --filter web-{slug} lint
pnpm --filter web-{slug} typecheck
pnpm --filter web-{slug} build
```

필요한 경우 `pnpm --filter web-{slug} test:e2e`를 추가한다.
