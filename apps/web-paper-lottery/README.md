# Web API Template

Vercel SSR/Route Handlers + Supabase(orval)용 Next.js 15 템플릿입니다. **AIT 배포 불가.**

## Before CLI (외부)

1. Vercel 계정 + GitHub 연동
2. Supabase 프로젝트 (DB 필요 시)
3. (선택) OpenAPI spec URL

## CLI

```bash
pnpm create:app --type web-api --slug my-app --name "My App"
pnpm --filter web-my-app dev
```

스키마 마이그레이션 스텁이 `supabase/migrations/`에 자동 생성됩니다.

## After CLI (외부)

1. `supabase db push` 또는 migration 적용
2. Vercel env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
3. (orval) `pnpm --filter @1-blue/api-client generate`
4. Vercel 배포 (Root: `apps/web-{slug}`)

## Before Launch

- RLS 정책 테스트
- API rate limit 설정
- AdSense + legal 페이지 (web-static과 동일)

통합 체크리스트: [docs/EXTERNAL-CHECKLIST.md](../../docs/EXTERNAL-CHECKLIST.md)
