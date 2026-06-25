---
name: add-supabase-schema
description: DB 필요. Create migration in supabase/migrations with app_{slug} schema.
---

# add-supabase-schema

## When to use

- 새 web-api 앱에 Supabase DB 스키마가 필요할 때
- `Invalid schema: app_{slug}` 에러가 날 때 (스키마는 있는데 API 노출 누락)

## Steps

### 1. 스키마 생성 마이그레이션

`supabase/migrations/{timestamp}_create_schema_{slug}.sql`:

- `CREATE SCHEMA app_{slug}`
- `GRANT USAGE ON SCHEMA app_{slug} TO anon, authenticated, service_role`
- 테이블·인덱스·RLS(필요 시)
- `packages/database/src/types/database.ts`에 타입 추가
- 앱 `src/lib/db.ts`: `SCHEMA = "app_{slug}"`

### 2. PostgREST 노출 마이그레이션 (필수)

**스키마만 만들면 API에서 `Invalid schema`가 난다.** 별도 expose 마이그레이션 필요.

`supabase/migrations/{timestamp}_expose_schema_{slug}.sql`:

```sql
-- 기존 목록에 새 스키마 추가 (덮어쓰기 — 전체 목록 유지)
ALTER ROLE authenticator SET pgrst.db_schemas =
  'public, app_paper_lottery, app_daily_doodle, app_daily_deduction, app_{slug}';

GRANT USAGE ON SCHEMA app_{slug} TO authenticator;
GRANT ALL ON ALL TABLES IN SCHEMA app_{slug} TO authenticator;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA app_{slug} TO authenticator;

NOTIFY pgrst, 'reload config';
NOTIFY pgrst, 'reload schema';
```

- `pgrst.db_schemas`는 **전체 목록**을 한 줄로 설정한다. 새 slug만 넣으면 기존 앱 스키마가 빠진다.
- 참고: [`20260624120000_expose_schema_daily_deduction.sql`](../../../supabase/migrations/20260624120000_expose_schema_daily_deduction.sql), [`20260625120000_expose_schema_siheomform.sql`](../../../supabase/migrations/20260625120000_expose_schema_siheomform.sql)

### 3. 원격 적용

- Supabase MCP `apply_migration`으로 create + expose 둘 다 적용
- 또는 Supabase Dashboard → Integrations → **Data API** → Exposed schemas에 `app_{slug}` 체크 후 Save

### 4. 클라이언트

`packages/database`의 `createServerClient(schema)` 사용. `db: { schema }` 옵션으로 PostgREST에 스키마 지정.

## Troubleshooting

| 증상 | 원인 | 조치 |
|------|------|------|
| `Invalid schema: app_{slug}` | expose 마이그레이션 미적용 | expose SQL 적용 또는 Data API에 스키마 추가 |
| `permission denied` | GRANT 누락 | create/expose 마이그레이션의 GRANT 확인 |
| 다른 앱은 되는데 새 앱만 안 됨 | 기존 앱은 `expose_schema_*.sql` 있음, 새 앱만 없음 | 위 2단계 수행 |

대시보드 Exposed schemas 체크박스가 비어 있어도, SQL로 `pgrst.db_schemas`가 설정돼 있으면 API는 동작할 수 있다.

## Reference

See [reference.md](./reference.md)
