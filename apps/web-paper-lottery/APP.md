# 온라인 종이뽑기

## Overview

- Slug: paper-lottery
- Template: web-api
- Channel: Vercel + AdSense + Supabase/API
- Dev port: 7002

## Design

See DESIGN.md for UI references.

## Env

```bash
cp .env.example .env.local
```

See root [`.env.example`](../../.env.example). Run: `pnpm dev:paper-lottery`

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_ADSENSE_CLIENT_ID` — `ca-pub-4749665400027362` (`public/ads.txt`의 `pub-` 접두사 없는 동일 ID)
- `NEXT_PUBLIC_ADSENSE_SLOT_ID` — AdSense 광고 단위 ID
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server only)

## Contact

문의 채널(이메일·카카오)은 monorepo 공통 [`packages/legal/src/operator.ts`](../../packages/legal/src/operator.ts) `SITE_OPERATOR`를 따릅니다. 푸터·약관·개인정보처리방침에 자동 반영됩니다.
