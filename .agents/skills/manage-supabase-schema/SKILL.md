---
name: manage-supabase-schema
description: 1-blue Factory의 web-api 앱에 app_{slug} Supabase schema를 설계·생성·노출하거나 Invalid schema·permission denied 문제를 진단한다. migration, PostgREST pgrst.db_schemas, GRANT/RLS, TypeScript DB 타입, 앱 server client 연결을 변경할 때 사용하며 원격 적용 전에는 반드시 승인을 받는다.
---

# Manage Supabase Schema

앱별 schema를 migration과 코드에서 일관되게 관리한다.

## 절차

1. 현재 `supabase/migrations`, `supabase/config.toml`, 앱 `src/lib/db.ts`, database package를 읽는다.
2. schema 이름을 `app_{slug_with_underscores}`로 정하고 기존 schema와 충돌하지 않는지 확인한다.
3. [schema workflow](references/schema-workflow.md)에 따라 create와 expose migration을 설계한다.
4. table, constraint, index, RLS, role별 권한을 실제 접근 경로에 맞춰 최소 권한으로 설정한다.
5. repository가 사용하는 table/column과 TypeScript DB 타입을 동기화한다.
6. 앱 server client가 정확한 schema를 선택하는지 확인한다.
7. migration SQL과 영향 범위를 사용자에게 보여 주고 원격 적용 승인을 받는다.
8. 적용 후 schema 접근, 대표 CRUD, RLS 거부 사례를 검증한다.

## 진단

- `Invalid schema`: schema 생성 여부와 `pgrst.db_schemas`, authenticator 권한, PostgREST reload를 확인한다.
- `permission denied`: schema/table/sequence GRANT와 사용 role을 확인한다.
- table을 찾지 못함: 앱 client schema, migration 적용 순서, schema cache를 확인한다.
- 다른 앱 장애: expose migration이 기존 schema 목록을 덮어쓰지 않았는지 확인한다.

## 경계

- service-role key를 client에 노출하지 않는다.
- migration 파일을 수정해 이미 적용된 이력을 재작성하지 않고 새 migration을 추가한다.
- 사용자 승인 없이 원격 `apply_migration`, `db push`, dashboard 변경을 실행하지 않는다.
