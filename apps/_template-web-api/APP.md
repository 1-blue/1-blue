# {{APP_NAME}}

## Overview

- Slug: {{SLUG}}
- Template: web-api
- Channel: Vercel + AdSense + Supabase/API
- Dev port: {{PORT}}

## Design

See DESIGN.md for UI references.

## Env

```bash
cp .env.example .env.local
```

See root [`.env.example`](../../.env.example). Run: `pnpm dev:{{SLUG}}`

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_ADSENSE_CLIENT_ID` (optional)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server only)
