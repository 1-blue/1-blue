# 시험폼

## Overview

- Slug: siheomform
- Template: web-api
- Channel: Vercel + AdSense + Supabase/API + S3
- Dev port: 7005

로그인 없이 CBT 시험을 만들고 공유·응시하는 플랫폼.

## Phase 1 (현재)

- 앱 스캐폴딩, env, Supabase 스키마 선행 세팅 (에디터 미연동)
- S3 이미지 업로드 API (`POST /api/upload`)
- `/create` CBT 문제 에디터 (dnd-kit, 더미 로컬 상태)
- 나머지 라우트 빈 스텁

## Phase 2 (로드맵)

- CBT CRUD API, DB 저장
- `admin_token` / `public_id` 발급
- 응시·통계·랭킹
- localStorage CBT 목록
- recharts, html2canvas

## Routes

| 경로                          | Phase 1                         |
| ----------------------------- | ------------------------------- |
| `/`                           | 랜딩 (준비 중) + `/create` 링크 |
| `/create`                     | 문제 에디터                     |
| `/create/complete`            | 스텁                            |
| `/manage/[admin_token]`       | 스텁                            |
| `/manage/[admin_token]/edit`  | 스텁                            |
| `/manage/[admin_token]/stats` | 스텁                            |
| `/cbt/[public_id]`            | 스텁                            |
| `/privacy`, `/terms`          | 법적 고지                       |

## Design

See [DESIGN.md](./DESIGN.md) for UI references.

## Env

```bash
cp .env.example .env
```

- `NEXT_PUBLIC_SITE_URL=http://localhost:7005`
- Supabase 3종 + `APP_AWS_*` 4종

Run: `pnpm dev:siheomform`
