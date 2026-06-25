# add-supabase-schema reference

## Monorepo conventions

- [EXTERNAL-CHECKLIST](../../docs/EXTERNAL-CHECKLIST.md)
- [MONOREPO](../../docs/MONOREPO.md)
- Template README under `apps/_template-*/README.md`

## Migration file pairs (per app)

| 단계 | 파일 패턴 | 예시 |
|------|-----------|------|
| Create | `{ts}_create_schema_{slug}.sql` | `20260625000000_create_schema_siheomform.sql` |
| Expose | `{ts}_expose_schema_{slug}.sql` | `20260625120000_expose_schema_siheomform.sql` |

Create만 적용하고 Expose를 빼면 `@supabase/supabase-js`의 `db: { schema: "app_{slug}" }` 호출 시 **`Invalid schema: app_{slug}`** 발생.

## Current `pgrst.db_schemas` (after siheomform expose)

```
public, app_paper_lottery, app_daily_doodle, app_daily_deduction, app_siheomform
```

새 앱 추가 시 expose 마이그레이션에서 **위 목록 + `app_{new_slug}`** 로 `ALTER ROLE authenticator SET pgrst.db_schemas = '...'` 전체를 다시 설정.

## Expose migration template

```sql
ALTER ROLE authenticator SET pgrst.db_schemas = 'public, app_paper_lottery, app_daily_doodle, app_daily_deduction, app_{slug}';

GRANT USAGE ON SCHEMA app_{slug} TO authenticator;
GRANT ALL ON ALL TABLES IN SCHEMA app_{slug} TO authenticator;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA app_{slug} TO authenticator;

NOTIFY pgrst, 'reload config';
NOTIFY pgrst, 'reload schema';
```

## Apply to remote

```bash
# MCP (preferred in agent)
# apply_migration name=expose_schema_{slug} query=<sql>

# Or Supabase CLI
supabase db push
```

Dashboard: **Project Settings → Integrations → Data API → Exposed schemas** — SQL과 동일 목적이지만, 이 레포는 마이그레이션으로 일관 관리.

## TypeScript

- `packages/database/src/types/database.ts` — `AppSchema` union + schema tables
- `packages/database/src/server/index.ts` — `createServerClient<S extends AppSchema>(schema)`
- App: `export const SCHEMA = "app_{slug}" as const; export const getDb = () => createServerClient(SCHEMA);`
