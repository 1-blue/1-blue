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
- Keywords: (5 long-tail phrases, comma-separated)
- FAQ: (3–5 questions for on-page accordion)

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
2. Stitch + save DESIGN.md (external)
3. **create-service** — scaffold + implement after approval
