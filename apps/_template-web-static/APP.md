# {{APP_NAME}}

## Overview

- Slug: {{SLUG}}
- Template: web-static
- Channel: Vercel + AdSense
- Dev port: {{PORT}}

## Value

- (One line: what search intent this app solves)

## Features

- (Bullet list of user-facing features)

## Core logic (@1-blue/core)

- (Pure functions to implement + test)

## SEO (long-tail)

- Primary title: (browser title)
- H1: (on-page headline)
- Meta description: (155 chars max, Korean)
- Keywords: (5 long-tail phrases — `_config/site-seo.ts` → `SITE_KEYWORDS`)
- FAQ: (3–5 questions — `_config/site-seo.ts` → `FAQ_ITEMS`, `FaqSection` + JSON-LD)
- Sitemap paths: (default `/`, `/privacy`, `/terms` — `_config/site-seo.ts` → `SITEMAP_PATHS`)

### SEO 구현 체크리스트 (web-static)

| 항목 | 파일 |
|------|------|
| keywords meta | `layout.tsx` ← `SITE_KEYWORDS` |
| sitemap.xml | `app/sitemap.ts` |
| robots.txt | `app/robots.ts` |
| FAQ UI | `_components/FaqSection.tsx` |
| FAQ JSON-LD | `_components/FaqJsonLd.tsx` + `(home)/page.tsx` |
| 설정 단일 소스 | `_config/site-seo.ts`, `_config/site-url.ts` |

## Design

See [DESIGN.md](./DESIGN.md) — Stitch URL + awesome-design-md base.

## Env

```bash
cp .env.example .env.local
```

See root [`.env.example`](../../.env.example). Run: `pnpm dev:{{SLUG}}`

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_ADSENSE_CLIENT_ID` (optional)

## Workflow

1. **plan-service** — strategy before code
2. **design-service** — responsive Stitch prompt and development handoff
3. Stitch + save DESIGN.md (external)
4. **build-service** — scaffold, implement, and verify after approval
