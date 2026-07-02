# Schema Workflow

## Create migration

`supabase/migrations/{timestamp}_create_schema_{slug}.sql`에 다음을 포함한다.

- `CREATE SCHEMA app_{slug}`
- 필요한 role의 schema usage
- table, foreign key, unique constraint, check constraint
- 조회·정렬 패턴에 필요한 index
- RLS 활성화와 정책 또는 server-only 접근 근거
- sequence 권한

## Expose migration

custom schema를 Supabase Data API로 사용할 때 별도 expose migration을 둔다.

```sql
ALTER ROLE authenticator SET pgrst.db_schemas =
  'public, app_paper_lottery, app_daily_doodle, app_daily_deduction, app_siheomform, app_sseoltalk, app_{slug}';

GRANT USAGE ON SCHEMA app_{slug} TO authenticator;
GRANT ALL ON ALL TABLES IN SCHEMA app_{slug} TO authenticator;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA app_{slug} TO authenticator;

NOTIFY pgrst, 'reload config';
NOTIFY pgrst, 'reload schema';
```

실행 시점의 migration을 다시 읽고 전체 schema 목록을 재구성한다. 위 목록을 영구적인 최신값으로 간주하지 않는다.

## Code synchronization

- 앱 `src/lib/db.ts`의 schema literal
- repository가 사용하는 table과 column
- database package의 schema/table 타입
- seed와 cron 코드
- health check

## Remote verification

1. migration history 확인
2. anonymous/authenticated/service-role별 의도된 접근 확인
3. 잘못된 role과 다른 앱 schema 접근 거부 확인
4. PostgREST schema cache reload 확인
